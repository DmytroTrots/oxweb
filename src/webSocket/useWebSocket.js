import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

const useWebSocket = (userId, onMessageReceived) => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const stompClient = new Client({
                                     brokerURL: "ws://localhost:8080/ws",
                                     connectHeaders: { login: userId },
                                     debug: (str) => console.log(str),
                                     reconnectDelay: 100000,
                                     heartbeatIncoming: 40000,
                                     heartbeatOutgoing: 40000,
                                     onConnect: () => {
                                       console.log("Connected to WebSocket");
                                       stompClient.subscribe(`/user/${userId}/topic/notifications`, (message) => {
                                         onMessageReceived(JSON.parse(message.body));
                                       });
                                     },
                                     onDisconnect: () => console.log("Disconnected from WebSocket"),
                                   });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [ userId ]);

  return client;
};

export default useWebSocket;