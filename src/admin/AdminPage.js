import { useEffect, useState } from "react";
import EditClientForm from "./forms/EditClientForm";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import ContactsTable from "./ContactsTable";
import TasksTable from "./TasksTable";
import Notifications from "../webSocket/Notifications";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("clientName");
  const auth = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = auth.getUser();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const clientData = await api.getClientByUserId(user);
        auth.setClientData(clientData?.data);
      } catch (err) {
        setError("Failed to fetch client data");
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [ user.id ]);

  const renderContent = () => {
    switch (activeSection) {
      case "clientName":
        return <EditClientForm />;
      case "contacts":
        return <ContactsTable />;
      case "tasks":
        return <TasksTable />;
      default:
        return null;
    }
  };

  return (
          <div>
            <nav style={{ display: "flex", gap: "20px", padding: "10px", borderBottom: "1px solid #ccc" }}>
              <button onClick={() => setActiveSection("clientName")}>Client Name</button>
              <button onClick={() => setActiveSection("contacts")}>Contacts</button>
              <button onClick={() => setActiveSection("tasks")}>Tasks</button>
            </nav>

            <div style={{ marginTop: "20px" }}>
              {renderContent()}
            </div>

            <Notifications userId={user?.id}></Notifications>
          </div>
  );
};

export default AdminPage;