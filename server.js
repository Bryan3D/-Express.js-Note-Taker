// imports several dependencies: the express and path modules, the fs (file system) module, and the body-parser middleware. The app variable is created as an instance of the express function.

const express = require('express');
const path  = require('path');
const fs = require('fs');
var data = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8")); 
const app = express();
const PORT = process.env.PORT || 3001;
const bodyParser = require('body-parser');

// The script then sets up the server to use the urlencoded and json Middlewares, and to serve static files from the Develop/public directory.

app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Serve static files

app.use(express.static('./Develop/public'));

//The script sets up several routes for handling HTTP requests. The first two routes are for the '/' and '/notes' paths and simply send the corresponding HTML files when requested

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

// The next two routes are for handling HTTP GET requests to the '/api/notes' and '/api/notes/:id' paths. These routes return the contents of the data variable, which is initialized as the parsed contents of the db.json file, and a single item in the data array, respectively

app.get('/api/notes', (req, res) => {
    res.json(data);
});

app.get("api/notes/:id", function(req, res){

    res.json(data[Number(req.params.id)]);
});


//The '/api/notes' route also handles HTTP POST requests, which add a new note to the data array and write the updated array to the db.json file.

app.post('/api/notes', (req, res) => {

        let newNotes = req.body;
        let uniqueId = (data.length).toString();
        console.log(uniqueId);
        newNotes.id = uniqueId;
        data.push(newNotes);

        //write
       fs.writeFileSync("./Develop/db/db.json", JSON.stringify(data), 
       function(err){
        if (err) throw err;
        console.log('Saved!');
        res.json(data);
});
});


// The '/api/notes/:id' route also handles HTTP DELETE requests, which remove the specified note from the data array and update the id properties of the remaining items in the array.

app.delete("/api/notes/:id", function(req, res){

    let noteId = req.params.id;
    let newId = 0;
    console.log(`Deleting note with id ${noteId}`);
    data = data.filter(currentNote => {
        return currentNote.id != noteId;
    });
    for (currentNote of data) {
        currentNote.id = newId.toString();
        newId++;
    }
    fs.writeFileSync("./Develop/db/db.json", JSON.stringify(data));
    res.json(data);
});

// Listener on port 3001 (or the value of the PORT environment variable, if it is set) to listen for incoming requests.

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);

});