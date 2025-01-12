import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { api } from "../api/api";

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const AddTaskForm = ({ onAdd }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contacts, setContacts] = useState([]);
  const [task, setTask] = useState({
                                           description: "",
                                           deadlineTime: "",
                                           contactId: ""
  });

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
  }, []);

  const auth = useAuth();
  const user = auth.getUser();
  const client = auth.getClient();

  const handleChange = (e) => {
    const { name, value } = e.target;

    const formattedValue =
            name === "deadlineTime" ? formatDate(value) : value;

    setTask((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTask = await api.createTask(user, task);
      onAdd(newTask?.data);
      alert("Task added successfully!");
    } catch (err) {
      alert("Failed to add task");
    }
  };

  return (
          <form onSubmit={handleSubmit}>
            <h2>Add Task</h2>
            <div>
              <label>
                Description:
                <input
                        type="text"
                        name="description"
                        value={task.description}
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
                        value={task.deadlineTime}
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
                                value={task.contactId}
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
            <button type="submit">Add</button>
          </form>
  );
};

export default AddTaskForm;