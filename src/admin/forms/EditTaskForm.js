import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const EditTaskForm = ({selectedTask, onUpdate, onClose}) => {

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contacts, setContacts] = useState([]);

  const auth = useAuth();
  const user = auth.getUser();
  const client = auth.getClient();

  const fetchContactsData = async () => {
    try {
      const contactsData = await api.getContactsByClientId(user, client.id);
      setContacts(contactsData?.data);
    } catch (err) {
      setError("Failed to fetch contacts data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactsData();
    setTask(selectedTask)
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;

    const formattedValue =
            name === "deadlineTime" ? formatDate(value) : value;

    setTask((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedTask = await api.updateTask(user, task);
      onUpdate(updatedTask?.data);
      alert("Task updated successfully!");
    } catch (err) {
      alert("Failed to update task");
    }
  };

  return (task &&
          <form onSubmit={handleUpdate}>
            <h2>Edit Task</h2>
            <div>
              <label>
                Description:
                <input
                        type="text"
                        name="description"
                        value={task?.description}
                        onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Deadline:
                <input
                        type="date"
                        name="deadlineTime"
                        value={task?.deadlineTime}
                        onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Contact:
                {loading ? (
                        <p>Loading contacts...</p>
                ) : error ? (
                        <p style={{ color: "red" }}>{error}</p>
                ) : (
                        <select
                                name="contactId"
                                value={task?.contactId}
                                onChange={handleChange}
                        >
                          <option value="">Select Contact</option>
                          {contacts.map((contact) => (
                                  <option key={contact.id} value={contact.id}>
                                    {contact.firstName} {contact.lastName}
                                  </option>
                          ))}
                        </select>
                )}
              </label>
            </div>
            <div>
              <label>
                Status:
                <select
                        name="status"
                        value={task?.status}
                        onChange={handleChange}>
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </label>
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Close</button>
          </form>
  );
};

export default EditTaskForm;