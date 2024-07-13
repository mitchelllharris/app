import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use(bodyParser.urlencoded({ extended: true }));

// Array to store notes (simulate database)
let notes = [];

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render(__dirname + '/views/index.ejs', { 
        notes: notes, 
        errorMessage: '' 
    });
});

app.post('/submit', (req, res) => {
    const noteTitle = req.body['noteTitle'];
    const noteDescription = req.body['noteDescription'];
    const noteBody = req.body['noteBody'];
    const noteCreated = new Date().toLocaleString();

    if (!noteTitle) {
        return res.render(__dirname + '/views/index.ejs', {
            notes: notes,
            errorMessage: 'Please fill out all the required fields.',
        });
    }

    const newNote = {
        title: noteTitle,
        description: noteDescription,
        body: noteBody,
        createdAt: noteCreated
    };

    notes.push(newNote);

    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
