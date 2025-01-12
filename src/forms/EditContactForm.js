import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";

const EditContactForm = ({selectedContact, onUpdate, onClose}) => {

  const [contact, setContact] = useState(null);

  const auth = useAuth();
  const user = auth.getUser();

  useEffect(() => {
    setContact(selectedContact)
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedContact = await api.updateContact(user, contact);
      onUpdate(updatedContact?.data);
      alert("Contact updated successfully!");
    } catch (err) {
      alert("Failed to update contact");
    }
  };

  return (contact &&
          <form onSubmit={handleUpdate}>
            <h2>Edit Contact</h2>
            <div>
              <label>
                First Name:
                <input
                        type="text"
                        name="firstName"
                        value={contact?.firstName}
                        onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Last Name:
                <input
                        type="text"
                        name="lastName"
                        value={contact?.lastName}
                        onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Phone:
                <input
                        type="text"
                        name="phone"
                        value={contact?.phone}
                        onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                User Email:
                <input
                        type="email"
                        name="user.email"
                        value={contact?.email}
                        disabled
                />
              </label>
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Close</button>
          </form>
  );
};

export default EditContactForm;