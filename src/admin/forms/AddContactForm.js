import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { api } from "../../api/api";

const AddContactForm = ({ onAdd }) => {
  const [contact, setContact] = useState({
                                           firstName: "",
                                           lastName: "",
                                           phone: "",
                                           email: "",
                                           password: ""
                                         });

  const auth = useAuth();
  const user = auth.getUser();
  const client = auth.getClient();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newContact = await api.createContact(user, {
        ...contact,
        clientId: client.id,
        user: {
          email: contact.email,
          password: contact.password,
          roles: ["USER"]
        }
      });
      onAdd(newContact?.data);
      alert("Contact added successfully!");
    } catch (err) {
      alert("Failed to add contact");
    }
  };

  return (
          <form onSubmit={handleSubmit}>
            <h2>Add Contact</h2>
            <div>
              <label>
                First Name:
                <input
                        type="text"
                        name="firstName"
                        value={contact.firstName}
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
                        value={contact.lastName}
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
                        value={contact.phone}
                        onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Email:
                <input
                        type="email"
                        name="email"
                        value={contact.email}
                        onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Password:
                <input
                        type="password"
                        name="password"
                        value={contact.password}
                        onChange={handleChange}
                />
              </label>
            </div>
            <button type="submit">Add</button>
          </form>
  );
};

export default AddContactForm;