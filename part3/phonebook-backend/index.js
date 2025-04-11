require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(express.static("dist"));

morgan.token("body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  } else {
    return null;
  }
});

app.use(
  morgan((tokens, req, res) => {
    const base = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ];

    if (req.method === "POST") {
      base.push(tokens.body(req, res));
    }

    return base.join(" ");
  })
);

app.get("/info", (req, res) => {
  // TODO error handling
  Person.countDocuments({}).then((count) => {
    const now = new Date();
    res.send(`<p>Phonebook has info for ${count} people</p><p>${now}</p>`);
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    if (person) {
      return res.json(person);
    } else {
      return res.status(404).end();
    }
  });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name and number are required" });
  }

  // TODO ensure unique name

  new Person({ name: body.name, number: body.number })
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    });
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id).then((result) => {
    res.status(204).end();
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
