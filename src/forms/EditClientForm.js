import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";

const EditClientForm = () => {

  const [client, setClient] = useState(null);

  const auth = useAuth();
  const user = auth.getUser();

  useEffect(() => {
    setClient(auth.getClient())
  }, [ localStorage.getItem("client") ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedClient = await api.updateClient(user, client);
      setClient(updatedClient?.data);
      auth.setClientData(updatedClient?.data);
      alert("Client updated successfully!");
    } catch (err) {
      alert("Failed to update client");
    }
  };

  return (client?.id &&
          <form onSubmit={handleUpdate}>
            <h2>Edit Client</h2>
            <div>
              <label>
                Company Name:
                <input
                        type="text"
                        name="companyName"
                        value={client?.companyName}
                        onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Industry:
                <input
                        type="text"
                        name="industry"
                        value={client?.industry}
                        onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Address:
                <input
                        type="text"
                        name="address"
                        value={client?.address}
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
                        value={client?.user?.email}
                        disabled
                />
              </label>
            </div>
            <button type="submit">Save</button>
          </form>
  );
};

export default EditClientForm;