
const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const loginPage = document.getElementById("login-page");
const chatPage = document.getElementById("chat-page");
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const synth = window.speechSynthesis;
let assistantVoice;

speechSynthesis.onvoiceschanged = () => {
  const voices = synth.getVoices();
  assistantVoice = voices.find(v => v.name.includes("Google") && v.lang === "en-US");
};

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  if (assistantVoice) utterance.voice = assistantVoice;
  synth.speak(utterance);
}

function addMessage(sender, text) {
  const messageElem = document.createElement("div");
  messageElem.className = `message ${sender}`;
  messageElem.textContent = text;
  chatContainer.appendChild(messageElem);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  if (sender === "bot") speak(text);
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  addMessage("user", message);
  userInput.value = "";

  try {
    addMessage("bot", "Thinking...");
    const loadingElem = chatContainer.lastChild;

    const res = await fetch("https://chawlis-backend.masroof.codes/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    chatContainer.removeChild(loadingElem);
    addMessage("bot", data.reply);
  } catch (err) {
    addMessage("bot", "Sorry, I can't reach the server right now.");
  }
}

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  loginPage.style.display = "none";
  chatPage.style.display = "block";
  addMessage("bot", "Hello, I am Charlie, your AI assistant. How can I help you?");
});
