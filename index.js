const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const logFilePath = path.join(__dirname, "requests.log");

const app = express();

// const corsOptions = {
//   origin: "http://localhost:5173",
//   optionsSuccessStatus: 200,
// };
const requestLogger = (request, response, next) => {
  const logEntry = [
    `Time:   ${new Date().toISOString()}`,
    `Method: ${request.method}`,
    `Path:   ${request.path}`,
    `Body:   ${JSON.stringify(request.body)}`,
    "---\n",
  ].join("\n");

  console.log(logEntry);

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error("Failed to write request log:", err);
    }
  });

  next();
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static("dist"));

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (request, response) => {
  response.send("<h1> Hello World </h1>");
});
app.get("/api/notes", (request, response) => {
  response.json(notes);
});
app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  }
  response.status(404).end();
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  notes = notes.filter((n) => n.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
};

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: "content missing" });
  }

  const note = {
    id: generateId(),
    content: body.content,
    important: body.important || false,
  };

  notes = notes.concat(note);
  res.json(note);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
