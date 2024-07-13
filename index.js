import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// Array to store posts (simulate database)
let posts = [];

app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/public/css'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render(__dirname + '/views/index.ejs', {
        posts: posts // Pass posts array to template
    });
});

app.post('/submit', (req, res) => {
    const { postTitle, postDescription, postBody, postAuthor, postReadTime } = req.body;

    const newPost = {
        title: postTitle,
        description: postDescription,
        body: postBody,
        author: postAuthor,
        readTime: postReadTime,
        createdAt: new Date().toLocaleString() // Simulate created timestamp
    };

    // Add the new post to the beginning of the posts array
    posts.unshift(newPost);

    // Redirect to the home page after successful submission
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
