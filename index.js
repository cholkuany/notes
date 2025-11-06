require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const Note = require("./models/note");

const PORT = process.env.PORT;

const logFilePath = path.join(__dirname, "requests.log");

const app = express();

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

app.use(express.json());
app.use(requestLogger);
app.use(express.static("dist"));

app.get("/", (request, response) => {
  response.send("<h1> Hello World </h1>");
});
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});
app.get("/api/notes/:id", (request, response, next) => {
  const id = request.params.id;
  Note.findById(id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.sendStatus(404);
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndDelete({ _id: id })
    .then((result) => {
      console.log(`deleted: ${id}`);
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => {
    res.json(savedNote);
  });
});
app.put("/api/notes/:id", (request, response, next) => {
  const { content, important } = request.body;

  Note.findById(request.params.id)
    .then((note) => {
      if (!note) {
        return response.status(404).end();
      }

      note.content = content;
      note.important = important;

      return note.save().then((updatedNote) => {
        response.json(updatedNote);
      });
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
