// // require express
// const express = require('express');

// // require routes: html & api
// const htmlRoutes = require('./routes/htmlRoutes')
// const apiRoutes = require('./routes/apiRoutes');

// // initialize the app
// const app = express();
// const PORT = process.env.PORT || 3002;

// // set up body parsing, static, and route middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use('/', htmlRoutes); 
// app.use('/api', apiRoutes);

// app.use(express.static('public'));

// // start the server on the port 
// app.listen(PORT, () =>
//   console.log(`App listening at http://localhost:${PORT}`)
// );


const express = require('express');
const path = require('path');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
const uuid = require('./helpers/uuid');
const notes = require('./db/db.json');
const fs = require('fs');

const PORT = 3001;
const app = express();

// middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'));



// GET ROUTE for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);


// GET ROUTE for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET ROUTE for note input
app.get('/api/notes', (req, res) => {
    res.json(notes)
});

// POST ROUTE for new note
app.post('/api/notes', (req, res) => {

    const { title, text} = req.body;

    if(title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                }else {

    
    const parsedItems = JSON.parse(data);

    parsedItems.push(newNote);

    fs.writeFile('./db/db.json', JSON.stringify(parsedItems), (err) =>
    err ? console.error(err) : console.info('Note Added!'));

    }
});

const response = {
    status: 'success',
    body: newNote,
}

    res.status(201).json(response)
} else {
    res.status(500).json('Error')
}
});

// DELETE ROUTE for a note
// app.delete('/api/notes/:id', (req, res) => {
//     const noteId = req.params.id;
//     readFromFile('./db/db.json').then((data) => res.json)
// })


// app.listen(PORT, () => 
// console.log(`App listening at http://localhost:${PORT}`)
// );

app.listen(process.env.PORT || 3001, '0.0.0.0', () => {
  console.log("Server is running.");
});