const functions = require('firebase-functions');
const express = require('express');
const path = require('path');
// const PORT = process.env.PORT || 1750

const app = express();

// use absolute path /css/custom.css
// (with a trailing slash for loading static files on the client side
app.use(express.static(path.join(__dirname, '/public/')));
app.set('/views', path.join(__dirname, './views/'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.render('pages/index.ejs');
});

// default routes
app.get('', (req, res) => res.render('pages/index.ejs'));
app.get('/', (req, res) => res.render('pages/index.ejs'));
app.get('/home', (req, res) => res.render('pages/index.ejs'));
//app.get('/home#Features', (req, res) => res.render('pages/index.ejs'));
// specific routes
app.get('/games', (req, res) => res.render('pages/games.ejs'));
app.get('/games/matchingPictures', (req, res) => res.render('pages/games/mPairs.ejs'));
app.get('/games/matchingLetters', (req, res) => res.render('pages/games/mLetters.ejs'));
app.get('/games/typingRacer', (req, res) => res.render('pages/games/game_kkm.ejs'));
app.get('/games/crossword', (req, res) => res.render('pages/games/crosswords.ejs'));

exports.app = functions.https.onRequest(app);
