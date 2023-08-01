const socket = io();

const usernameInput = document.getElementById("username");
const chatboxInput = document.getElementById("chatbox");
const messageLogsDiv = document.getElementById("messageLogs");


let username = prompt("Enter your username:");
socket.emit("setUsername", username);


chatboxInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const message = chatboxInput.value.trim();
    if (message !== "") {
      socket.emit("sendMessage", { user: username, message });
      chatboxInput.value = "";
    }
  }
});


function addMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  messageLogsDiv.appendChild(messageElement);
}

socket.on("receiveMessage", (message) => {
  addMessage(message);
});
socket.on("userJoined", (username) => {
  addMessage(`${username} has joined the chat.`);
});
socket.on("userLeft", (username) => {
  addMessage(`${username} has left the chat.`);
});