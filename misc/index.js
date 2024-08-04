'use strict';

const express = require('express');
const session = require ('express-session')
const passport = require('passport');


const path = require('path');

require('./auth');


function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

const app = express();
app.use(session({ secret: "cats"}))
app.use(passport.initialize());
app.use(passport.session());



const reactAppFolder = path.join(__dirname, '/./react-app/build');

app.get('/', (req, res)=> {
    res.send('<a href="/auth/google"> Authenticate With Google</a>')
})

app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile']})
);

app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/failure'
    })
)

app.get('/failure', (req, res) => {
    res.send('something went wrong');
});

app.get('/protected', isLoggedIn, (req, res) => {
    res.send ('Hello!' + JSON.stringify(req.user.displayName));
});

app.listen(8080, () => console.log('listening on 8080'));









// app.get("/api", (req, res) => {
//     res.status(200).send('Calling API method');
// });



// app.use(express.static(reactAppFolder));


// // Start the server
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//     console.log(`App listening on port ${PORT}`);
//     console.log ("__dirname: " + __dirname);
//     console.log ("reactAppFolder: " + reactAppFolder);
//     console.log('Press Ctrl+C to quit.');
// });

// /*
//     This was the very first file we created to validate the single repo for both React and Node codebase together.

//     TEST - DO NOT DELETE. NOT USED IN VTS-HUB app project.
//     */
