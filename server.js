const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;
const data = require('./db/db');

// MIDDLEWARE - parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
//serves js and css files
app.use(express.static('public'));

function createNewNote(body, db) {
    const newNote = body;
    newNote.id = uuidv4();
    db.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(db, null, 2)
    );
    return db;
}
function deleteNote(noteID, db) {
    index = db.findIndex(obj => obj.id === noteID);
    db.splice(index, 1);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(db, null, 2)
    );
    return db;
}

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));;
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));;
});
app.get('/api/notes', (req, res) => {
    res.json(data);
});
app.post('/api/notes', (req, res) => {
    const addNote = createNewNote(req.body, data)
    res.json(addNote);
});
app.delete('/api/notes/:id', (req, res) => {
    const newBody = deleteNote(req.params.id, data);
    res.json(newBody);
});
app.listen(PORT, () => {
    console.log(`API Server now on port ${PORT}!`);
});
