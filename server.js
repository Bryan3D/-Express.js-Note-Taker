//dependencies

var express = require('express');
const path  = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({extended: true}));
app.use(express.json());

//middleware
app.use(express.static('public'));

//routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// request
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'db/db.json'));
});

app.get('/api/notes/:id' , (req , res)=>{

   res.json(data[Number(req.params.id)]);

});

//post

app.post('/api/notes', (req, res) => {

        let newNotes = req.body;
        let id = (data.length).toString();
        newNotes.id = id;
        data.push(newNotes);
        console.log(data);

    //read
    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newNote = req.body;
        notes.push(newNote);
        //write
        fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.json(notes);
        });
    }   
    );
});

// delete
app.delete('/api/notes/:id', (req, res) => {

    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const id = req.params.id;
        notes.splice(id, 1);
        //write
        fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.json(notes);
        });
    }   
    );
});

app.listen(PORT, () => {

    console.log(`App listening on PORT ${PORT}`);

});