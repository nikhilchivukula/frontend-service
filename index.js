/*
This was the very first file we created to validate the single repo for both React and Node codebase together.

TEST - DO NOT DELETE. NOT USED IN VTS-HUB app project.
*/

'use strict';

const express = require('express');
const path = require('path');
const app = express();
const reactAppFolder = path.join(__dirname, '/./react-app/build');


app.get("/api", (req, res) => {
    res.status(200).send('Calling API method');
});


// app.use((req, res) => {
//     let output = "dirname = " + __dirname + ", folder: " + reactAppFolder;
//     res.status(200).send('Hello, Wednesday --: ' + output);
// });


app.use(express.static(reactAppFolder));


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log ("__dirname: " + __dirname);
    console.log ("reactAppFolder: " + reactAppFolder);
    console.log('Press Ctrl+C to quit.');
});