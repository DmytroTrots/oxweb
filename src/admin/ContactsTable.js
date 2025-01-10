import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";
import EditContactForm from "./forms/EditContactForm";
import AddContactForm from "./forms/AddContactForm";

const ContactsTable = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  }, []);


  const handleUpdateContact = (contact) => {
    setSelectedContact(contact);
    setShowAddContactForm(false);
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setShowAddContactForm(true);
  };

  const handleContactAdded  = (newContact) => {
    setContacts((prevContacts) => [...prevContacts, newContact]);
    setShowAddContactForm(false);
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await api.deleteContactById(user, contactId);
      setContacts((prevContacts) =>
                          prevContacts.filter((contact) => contact.id !== contactId)
      );

      if (selectedContact?.id === contactId) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleContactUpdate = (updatedContact) => {
    setContacts((prevContacts) =>
                        prevContacts.map((contact) =>
                                                 contact.id === updatedContact.id ? updatedContact : contact
                        )
    );
    setSelectedContact(null);
  };

  return (
          contacts &&
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div>
              <h2>Contacts</h2>
              <button onClick={handleAddContact} style={{ marginBottom: "10px" }}>
                Add Contact
              </button>
              <table
                      border="1"
                      cellPadding="10"
                      style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                <tr>
                  <th>Contact Name</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {contacts.map((contact) => (
                        <tr key={contact.id}>
                          <td
                                  style={{ cursor: "pointer", color: "blue" }}
                                  onClick={() => handleUpdateContact(contact)}
                          >
                            {contact.firstName} {contact.lastName}
                          </td>
                          <td>
                            <button onClick={() => handleDeleteContact(contact.id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                ))}
                </tbody>
              </table>
            </div>

            {selectedContact && (
                    <div
                            style={{
                              border: "1px solid #ccc",
                              padding: "20px",
                              marginRight: "20px",
                              width: "300px",
                              backgroundColor: "#f9f9f9",
                            }}
                    >
                      <EditContactForm selectedContact={selectedContact}
                                       onUpdate={handleContactUpdate}
                                       onClose={() => setSelectedContact(null)}
                      />
                    </div>
            )}

            {showAddContactForm && (
                    <div
                            style={{
                              border: "1px solid #ccc",
                              padding: "20px",
                              marginRight: "20px",
                              width: "300px",
                              backgroundColor: "#f9f9f9",
                            }}
                    >
                      <AddContactForm onAdd={handleContactAdded} />
                    </div>
            )}
          </div>
  );
};

export default ContactsTable;