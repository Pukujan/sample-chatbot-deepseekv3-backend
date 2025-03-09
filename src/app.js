const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const dotenv = require("dotenv");
const serviceAccount = require("../firebase-admin-key.json");
const authRoutes = require("./routes/authRoutes");



// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin SDK initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error);
  process.exit(1); // Exit the process if Firebase initialization fails
}

const db = admin.firestore(); // Initialize Firestore
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // Allow requests from the client
app.use(express.json()); // Parse JSON request bodies

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api", authRoutes); // Mount auth routes under /api

// DeepSeek endpoint using OpenRouter API
app.post("/api/deepseek", async (req, res) => {
  const { inputText, userId } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "My Chatbot",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat:free",
        messages: [
          {
            role: "user",
            content: inputText,
          },
        ],
        temperature: 0.9,
        top_p: 1,
        repetition_penalty: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const botMessage = { text: data.choices[0].message.content, sender: "bot", timestamp: new Date() };

    // Save bot message to Firestore
    await db.collection("chats").doc(userId).collection("messages").add(botMessage);

    res.json({ success: true, response: botMessage.text });
  } catch (error) {
    console.error("Error generating text with DeepSeek:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err); // Log unhandled errors
  res.status(500).json({ success: false, error: "Internal server error" });
});

module.exports = app;