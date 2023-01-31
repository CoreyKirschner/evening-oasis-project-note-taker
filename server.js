const express = require('express')
const path = require("path");
const fs = require("fs");
const app = express();

// middlewares
// for static asset loading
app.use(express.static("public"))

//for body encoding
app.use(express.urlencoded({extended: false}))

// for json
app.use(express.json())


// routes
app.get("/notes", (req, res) => {
    console.log(req.body)
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})


app.get("/api/notes", (req, res) => {
    fs.readFile(path.join("./db/db.json"), "UTF8", (err, data) => {
        if(err){
          console.log("There is an error")
          return;
        }
        console.log(data)
        const notes = JSON.parse(data)
        res.json(notes)
    })
})

app.post("/api/notes", (req, res) => {
    // Get the note from the request body
    const newNote = req.body;

    // Read the db.json file
    fs.readFile(path.join("./db/db.json"), "UTF8", (err, data) => {
        if(err){
          console.log("There is an error")
          return;
        }
        console.log(data)
        // Parse the data as JSON
        let notes = JSON.parse(data);
        // Assign a unique id to the new note
        notes.push(newNote);
        // Write the updated notes array to the db.json file
        fs.writeFile(path.join("./db/db.json"), JSON.stringify(notes), err => {
            if (err) throw err;
            // Send the new note as a response
            res.json(notes);// its notes or newNote
        });
    });
});

app.delete("/api/notes/:id", (req, res) => {
    // Get the id from the request parameters
    const id = req.params.id;

    // Read the db.json file
    fs.readFile(path.join("./db/db.json"), "UTF8", (err, data) => {
        if(err){
          console.log("There is an error")
          return;
        }
        // Parse the data as JSON
        let notes = JSON.parse(data);
        // Find the note with the matching id
        const noteIndex = notes.findIndex(note => note.id === id);
        // Remove the note from the array
        notes.splice(noteIndex, 1);
        // Write the updated notes array to the db.json file
        fs.writeFile(path.join("./db/db.json"), JSON.stringify(notes), err => {
            if (err) throw err;
            // Send the updated notes array as a response
            res.status(204).send();
        });
    });
});


// the catch-all route
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})


// app.listen(3001, () => {
//     console.log("Server is running on PORT 3001")
// })

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});