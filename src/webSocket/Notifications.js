import React, { useState } from "react";
import useWebSocket from "./useWebSocket";

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  const handleNewNotification = (message) => {
    setNotifications((prev) => [...prev, message]);
  };

  useWebSocket(userId, handleNewNotification);

  return (
          <div style={{ position: "fixed", top: "10px", right: "10px", zIndex: 1000 }}>
            <h4>Notifications</h4>
            <ul>
              {notifications.map((notification, index) => (
                      <li key={index}>{notification}</li>
              ))}
            </ul>
          </div>
  );
};

export default Notifications;