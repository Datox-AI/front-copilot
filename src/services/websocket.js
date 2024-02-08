class WebSocketService {
  constructor() {
    this.socket = null;
    this.messageHandlers = [];
  }

  connect(url) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    this.socket.onmessage = (event) => {
      this.handleMessage(event);
    };

    this.socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  handleMessage(event) {
    const data = JSON.parse(event.data);

    // Call all registered message handlers
    this.messageHandlers.forEach((handler) => handler(data));
  }

  sendMessage(message) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error("WebSocket is not open. Unable to send message.");
    }
  }

  closeConnection() {
    this.socket.close();
  }

  addMessageHandler(handler) {
    // Add a function to handle incoming messages
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler) {
    // Remove a message handler
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  }
}

export default new WebSocketService();
