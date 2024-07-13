import express from 'express'; // Import the express framework
import bodyParser from 'body-parser'; // Import body-parser to handle form data
import { dirname } from 'path'; // Import dirname to work with file paths
import { fileURLToPath } from 'url'; // Import fileURLToPath to convert URLs to file paths

// Define __dirname to get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express(); // Create an Express application
const port = 3000; // Define the port for the server

// Set static files directory for serving static assets
app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/public/css'));

// Body parser middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Array to store notes (simulates a simple database)
let notes = [];

// Set the view engine to EJS for rendering views
app.set('view engine', 'ejs');
// Specify the directory for views
app.set('views', __dirname + '/views');

// Route to display the home page with the list of notes
app.get('/', (req, res) => {
    res.render('index', { 
        notes: notes, // Pass the notes to the view
        errorMessage: '' // Pass an empty error message
    });
});

// Route to display the edit form for a specific note
app.get('/edit/:id', (req, res) => {
    const note = notes[req.params.id]; // Get the note by ID
    if (note) {
        res.render('partials/edit', { 
            note: note, // Pass the note to the edit view
            id: req.params.id, // Pass the note ID
            errorMessage: '' // Pass an empty error message
        });
    } else {
        res.redirect('/'); // Redirect to home if the note is not found
    }
});

// Route to handle new note submission
app.post('/submit', (req, res) => {
    const noteTitle = req.body['noteTitle']; // Get the title from the form
    const noteDescription = req.body['noteDescription']; // Get the description from the form
    const noteBody = req.body['noteBody']; // Get the body from the form
    const noteCreated = new Date().toLocaleString(); // Get the current date and time

    // Check if the note title is provided
    if (!noteTitle) {
        return res.render('index', {
            notes: notes, // Pass existing notes
            errorMessage: 'Please fill out all the required fields.', // Show error message
        });
    }

    // Create a new note object
    const newNote = {
        title: noteTitle,
        description: noteDescription,
        body: noteBody,
        createdAt: noteCreated
    };

    // Add the new note to the notes array
    notes.push(newNote);

    res.redirect('/'); // Redirect to the home page
});

// Route to handle edited note submission
app.post('/edit/:id', (req, res) => {
    try {
        const note = notes[req.params.id]; // Get the note by ID
        if (!note) {
            console.log("Note not found for id:", req.params.id); // Log if the note is not found
            return res.redirect('/'); // Redirect to home if the note is not found
        }

        // Get the edited values from the form or keep the existing ones
        const noteTitle = req.body['noteTitle'] || note.title;
        const noteDescription = req.body['noteDescription'] || note.description;
        const noteBody = req.body['noteBody'] || note.body;

        // Log the received edit data for debugging
        console.log("Received Edit Data:");
        console.log("Title:", req.body['noteTitle']);
        console.log("Description:", req.body['noteDescription']);
        console.log("Body:", req.body['noteBody']);

        // Update the note in the notes array
        notes[req.params.id] = {
            title: noteTitle,
            description: noteDescription,
            body: noteBody,
            createdAt: note.createdAt, // Keep the original creation date
        };

        // Log the updated note for debugging
        console.log("Updated Note:", notes[req.params.id]);

        res.redirect('/'); // Redirect to the home page
    } catch (error) {
        console.error("Error updating note: ", error); // Log any errors
        res.redirect('/'); // Redirect to home on error
    }
});

// Route to handle note deletion
app.post('/delete/:id', (req, res) => {
    const noteId = parseInt(req.params.id, 10); // Convert ID to integer
    // Check if the note ID is valid
    if (noteId >= 0 && noteId < notes.length) {
        notes.splice(noteId, 1); // Remove the note from the array
    }
    console.log(`Note ${noteId} has been deleted.`); // Log the deletion
    res.redirect('/'); // Redirect to the home page
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Listening on port ${port}`); // Log server start
});
