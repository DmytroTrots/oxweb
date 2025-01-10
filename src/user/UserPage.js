import { useAuth } from "../context/AuthContext";
import Notifications from "../webSocket/Notifications";

const UserPage = () => {
  const auth = useAuth();
  const user = auth.getUser();

  return (
          <div>
            <Notifications userId={user?.id}></Notifications>
          </div>
  );
};

export default UserPage;