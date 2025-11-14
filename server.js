const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pdfParse = require('pdf-parse');
const sendMail = require('./mailer'); 
require("dotenv").config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const allowedOrigins = [
  "https://prompt-paraphrase-pro.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

app.post('/extract-pdf-text', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded');
    const text = await pdfParse(req.file.buffer);
    console.log("done")
    res.json({ text: text.text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/send-mail", async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const result = await sendMail(to, subject, html);

  if (result.success) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: result.error });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`PDF and Email Text API running on http://localhost:${PORT}`));
