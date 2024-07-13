import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// Array to store notes (simulate database)
let notes = [];

app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/public/css'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render(__dirname + '/views/index.ejs', {
        notes: notes // Pass notes array to template
    });
});

app.post('/submit', (req, res) => {
    const { noteTitle, noteDescription, noteBody, noteAuthor, noteReadTime } = req.body;

    const newNote = {
        title: noteTitle,
        description: noteDescription,
        body: noteBody,
        author: noteAuthor,
        readTime: noteReadTime,
        createdAt: new Date().toLocaleString() // Simulate created timestamp
    };

    // Add the new note to the beginning of the notes array
    notes.unshift(newNote);

    // Redirect to the home page after successful submission
    res.redirect('/s');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
