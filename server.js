// require express
const express = require('express');
const path = require('path');
const fs = require('fs');

// initialize the app
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.post('/api/notes', (req, res) => {
    let addNote = req.body;
    let tasks = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteString = (tasks.length).toString();
    
    addNote.id = noteString;
    tasks.push(addNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(tasks));
    res.json(tasks);
});

//delete notes
app.delete('/api/notes/:id', (req, res) => {
    let tasks = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteId = (req.params.id).toString();

    tasks = tasks.filter(selected =>{
        return selected.id != noteId;
    })

   fs.writeFileSync("./db/db.json", JSON.stringify(tasks));
    res.json(tasks);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);