const fs = require('fs'); // enable file sharing
const express = require('express'); // allow use of express functions
const uniqid = require('uniqid'); // added module for unique id
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();

// tells express to properly read and parse the data for use
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// telling express where our folder is fo static assest
app.use(express.static('public'));

// route listener - for home pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        err ? res.status(500).json(err) : res.status(200).json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    let db = fs.readFileSync('./db/db.json', 'utf-8', (err, data) => {
        err ? res.status(500).json(err) : data;
    });

    const notes = JSON.parse(db);
    
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uniqid()
        };
        notes.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(notes), err => {
            err
            ? res.status(500).json(notes)
            : res.status(200).json(notes)
        });
    } else {
        res.status(400).json({ "result": "Failed"});
    }
});

// wildcard listener incase request is outside of parameters
app.get('*', (req, res) => res.sendFile(__dirname, 'public/'));

// tell express to start listening for request on stated port
app.listen(PORT, () => {
    console.log(`App is listening on http://localhost:${PORT}`);
})