import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messages, setMessages] = useState<
    { app: string; userId: string; consentId: string; responseId: string }[]
  >([]);
  const [userId, setUserId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const startSSEConnection = (userId: string) => {
    if (!userId) return;

    console.log("Starting SSE connection...");
    const eventSource = new EventSource(
      `http://localhost:3000/events?app=app1&userId=${userId}`
    );

    eventSource.onopen = () => {
      console.log("APP 2: SSE connection opened!");
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      console.log("Received event:", event.data);
      const data = JSON.parse(event.data);
      if (data.userId === userId) {
        setMessages((prev) => [...prev, data]);

        // Close the connection after receiving the message
        eventSource.close();
        console.log("SSE connection closed after message received");
        setIsConnected(false);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
      setIsConnected(false);
    };

    eventSourceRef.current = eventSource;
  };

  const handleClick = async () => {
    if (!userId || isConnected) return; // Prevent multiple connections

    const data = {
      userId,
      app: "app2",
    };
    try {
      await fetch(`http://localhost:3000/events/consent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log("Consent request sent, waiting for response...");
      startSSEConnection(userId);
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        console.log("SSE connection closed on unmount");
      }
    };
  }, []);

  return (
    <div className="main-container">
      <h1>App 2</h1>
      <h4>User Id</h4>
      <input
        style={{ margin: "10px", padding: "10px", fontSize: "large" }}
        type="text"
        placeholder="Enter userId"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button
        onClick={handleClick}
        style={{ backgroundColor: "blue", color: "white", width: "150px" }}
        disabled={isConnected} // Disable button while waiting for response
      >
        {isConnected ? "Waiting..." : "Send Request"}
      </button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index + 1}>
            userId: {msg.userId}, consentId: {msg.consentId}, ResponseId:{" "}
            {msg.responseId}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;
