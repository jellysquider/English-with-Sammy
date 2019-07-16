const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
// const PORT = process.env.PORT || 1750

const app = express();

// use absolute path /css/custom.css
// (with a trailing slash for loading static files on the client side
app.use(express.static(path.join(__dirname, 'public/')));
app.set('/views', path.join(__dirname, './views/'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.render('pages/index.ejs');
});

// The / and /home routes need to be edited in Sprint 3 so that users who are logged in
// are redirected to the dashboard.ejs and those that are not to index.js
app.get('', (req, res) => res.render('pages/index.ejs'));
app.get('/', (req, res) => res.render('pages/index.ejs'));
app.get('/home', (req, res) => res.render('pages/index.ejs'));
app.get('/dashboard', (req, res) => res.render('pages/dashboard.ejs'));


// Sprint 1 functionality
app.get('/games', (req, res) => res.render('pages/games.ejs'));
app.get('/matchingPairs', (req, res) => res.render('pages/games/mPairs.ejs'));
app.get('/matchingLetters', (req, res) => res.render('pages/games/mLetters.ejs'));

// Sprint 2 functionality
app.get('/crosswords', (req, res) => res.render('pages/games/crosswords.ejs'));

// Sprint 3 functionality
app.get('/login', (req, res) => res.render('pages/login.ejs'));
app.get('/signup', (req, res) => res.render('pages/signup.ejs'));

exports.app = functions.https.onRequest(app);
