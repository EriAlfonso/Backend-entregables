
const socket = io();


const usernameInput = document.getElementById("username");
const chatboxInput = document.getElementById("chatbox");
const messageLogsDiv = document.getElementById("messageLogs");

let username = prompt("Enter your username:");
socket.emit("setUsername", username);

const sendButton = document.getElementById("sendButton");
sendButton.addEventListener("click", () => {
  const message = chatboxInput.value.trim();
  if (message !== "") {
    socket.emit("sendMessage", { user: username, message });
    chatboxInput.value = "";
  }
});


function addMessage(data) {
  const messageElement = document.createElement("div");
  messageElement.textContent = `${data.user}: ${data.message}`;
  messageLogsDiv.appendChild(messageElement);
}

socket.on("receiveMessage", (data) => {
  addMessage(data);
});

socket.on("userJoined", (username) => {
    addMessage(`${username} has joined the chat.`);
  });
  

  socket.on("userLeft", (username) => {
    addMessage(`${username} has left the chat.`);
  });
  
  async function loadPreviousMessages() {
    try {
      const response = await fetch("/"); 
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const messages = await response.json();
      messages.forEach((message) => {
        addMessage(message);
      });
    } catch (error) {
      console.error("Error loading previous messages:", error);
    }}