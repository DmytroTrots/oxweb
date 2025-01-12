import { useAuth } from "../context/AuthContext";
import { StompSessionProvider, useSubscription } from "react-stomp-hooks";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import EditContactForm from "../forms/EditContactForm";
import TasksTable from "../components/TasksTable";

const UserPage = () => {
  const [activeSection, setActiveSection] = useState("contactName");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contact, setContact] = useState()

  const auth = useAuth();
  const user = auth.getUser();

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const contactData = await api.getContactByUserId(user);
        setContact(contactData?.data);
        const clientData = await api.getClientById(user, contactData?.data);
        auth.setClientData(clientData?.data)
      } catch (err) {
        setError("Failed to fetch contact data");
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, [ user.id ]);

  const renderContent = () => {
    switch (activeSection) {
      case "contactName":
        return <EditContactForm selectedContact={contact} onUpdate={() => {}} onClose={() => {}}/>;
      case "tasks":
        return <TasksTable />;
      default:
        return null;
    }
  };

  return (
          <div>
            <nav style={{ display: "flex", gap: "20px", padding: "10px", borderBottom: "1px solid #ccc" }}>
              <button onClick={() => setActiveSection("contactName")}>Contact</button>
              <button onClick={() => setActiveSection("tasks")}>All tasks</button>
            </nav>

            <div style={{ marginTop: "20px" }}>
              {contact && renderContent()}
            </div>

            <div>
              <StompSessionProvider
                      url={'http://localhost:8082/ws'}
              >
                <ChildComponent userId={user.id}/>
              </StompSessionProvider>
            </div>
          </div>
  );
};

const ChildComponent = ({userId}) => {
  const [message, setMessage] = useState("");
  useSubscription(`/queue/notifications-${userId}`, (message) => {
    setMessage(message.body)});
  return (
          <div>{message}</div>
  )
}

export default UserPage;