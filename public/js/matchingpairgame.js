// Matching Pair Game

// initializes variables needed
var picture_Array = [];
var seen_Pictures_Array = [];
var x = 0;

var game_Image1 = document.getElementsByClassName("pic1")[0];
var game_Image2 = document.getElementsByClassName("pic2")[0];
var game_Image3 = document.getElementsByClassName("pic3")[0];

var game_Word1 = document.getElementsByClassName("word1")[0];
var game_Word2 = document.getElementsByClassName("word2")[0];
var game_Word3 = document.getElementsByClassName("word3")[0];



// class to store pictures with associated word
class Picture {
    constructor(image1, image2, image3, word) {
        this._image1 = image1;
        this._image1 = image2;
        this._image2 = image3;
        this._word = word;
    }

    get image() {
        return this._image;
    }

    get image1() {
        return this._image1;
    }

    get image2() {
        return this._image2;
    }

    get word() {
        return this._word;
    }
}



// firebase
const config = {
    apiKey: "AIzaSyAWCffYBhhwfmwao-gkgg_3f86bErtpHj0",
    authDomain: "english-with-sammy.firebaseapp.com",
    databaseURL: "https://english-with-sammy.firebaseio.com",
    projectId: "english-with-sammy",
    storageBucket: "",
    messagingSenderId: "938824486935",
    appId: "1:938824486935:web:86652c039bb3a069"
};

firebase.initializeApp(config);



// checks which category the user chose
function checkCategory() {
    let urlParams = new URLSearchParams(window.location.search);
    let category = urlParams.get("category");
    if (category != null) {
        return category
    }
    else {
        return ""
    }
}

let chosen_category = checkCategory();



// retrieves values from database | creates picture object and stores it into array
function retrieve_Database_Values() {
    picture_Array = [];

    var ref = firebase.database().ref(`/Categories/${chosen_category}`);
    ref.once("value").then(function (snapshot) {

        let words = snapshot.val();

        // gets each image from word and stores in array
        for (let i in words) {
            var img1 = snapshot.child(i).child("img0").val();
            var img2 = snapshot.child(i).child("img1").val();
            var img3 = snapshot.child(i).child("img2").val();

            const picture = new Picture(img1, img2, img3, i);
            picture_Array.push(picture);
        }
    });
}

retrieve_Database_Values();



initialize_Game();

// initializes all buttons and pages
function initialize_Game() {
    document.getElementById("game_Page");
    document.getElementById("continue_Page")[0];

    document.getElementById("play_Button").addEventListener("click", start_Game);
    document.getElementById("restart_Button").addEventListener("click", restart_Game);
    document.getElementById("quit_Button").addEventListener("click", quit_Game);
    document.getElementById("continue_Button").addEventListener("click", continue_Game);
}



// gets the first set of images from the array when user starts
function start_Game(evt) {
    x = 0;

    change_Images();

    play_Button.style.visibility = "hidden";
    game_Description.style.visibility = "visible";
    game_Page.style.visibility = "visible";
}



// gets new pictures from the array when user continues
function continue_Game(evt) {
    x = 0;

    change_Images();

    game_Page.style.visibility = "visible";
    end_Page.style.visibility = "hidden";
}



// re-retrieves data from the database and starts a new game when user restarts
function restart_Game(evt) {
    x = 0;

    end_Page.style.visibility = "hidden";
    game_Description.style.visibility = "visible";
    end_Message.style.visibility = "hidden";

    change_Images();

    retrieve_Database_Values();
}



// Resets the entire game when the user quits
function quit_Game(evt) {
    end_Message.style.visibility = "hidden";
    game_Description.style.visibility = "hidden";

    game_Image1.style.visibility = "hidden";
    game_Image2.style.visibility = "hidden";
    game_Image3.style.visibility = "hidden";

    game_Word1.style.visibility = "hidden";
    game_Word2.style.visibility = "hidden";
    game_Word3.style.visibility = "hidden";

    continue_Page.style.visibility = "hidden";
    game_Page.style.visibility = "hidden";
    play_Button.style.visibility = "visible";

    retrieve_Database_Values();
}



// gets random picture from the array and displays it
function change_Images() {
    game_Image1.style.visibility = "visible";
    game_Image2.style.visibility = "visible";
    game_Image3.style.visibility = "visible";

    game_Word1.style.visibility = "visible";
    game_Word2.style.visibility = "visible";
    game_Word3.style.visibility = "visible";

    let temp_Picture_Array = [];
    let temp_Word_Array = [];

    // retrieves 3 random pictures from all pictures, stores it in a different array, and removes from all pictures
    for (i = 0; i < 3; i++) {
        let alpha = Math.floor(Math.random() * picture_Array.length);
        let temp = picture_Array[alpha];

        picture_Array.splice(alpha, 1);

        temp_Word_Array.push(temp.word);
        temp_Picture_Array.push(temp);
        seen_Pictures_Array.push(temp);
    }

    // calls functions to change picture/word
    change_PictureWord1(temp_Picture_Array, temp_Word_Array);
    change_PictureWord2(temp_Picture_Array, temp_Word_Array);
    change_PictureWord3(temp_Picture_Array, temp_Word_Array);
}



// changes the first picture/word
function change_PictureWord1(temp_Picture_Array, temp_Word_Array) {
    game_Image1.src = temp_Picture_Array[0].image1;
    game_Image1.height = 200;
    game_Image1.width = 200;
    game_Image1.alt = temp_Picture_Array[0].word;

    let x = Math.floor(Math.random() * temp_Word_Array.length);

    game_Word1.textContent = temp_Word_Array[x];
    temp_Word_Array.splice(x, 1);
}



// changes the second picture/word
function change_PictureWord2(temp_Picture_Array, temp_Word_Array) {
    game_Image2.src = temp_Picture_Array[1].image1;
    game_Image2.height = 200;
    game_Image2.width = 200;
    game_Image2.alt = temp_Picture_Array[1].word;

    let y = Math.floor(Math.random() * temp_Word_Array.length);

    game_Word2.textContent = temp_Word_Array[y];
    temp_Word_Array.splice(y, 1);
}



// changes the third picture/word
function change_PictureWord3(temp_Picture_Array, temp_Word_Array) {
    game_Image3.src = temp_Picture_Array[2].image1;
    game_Image3.height = 200;
    game_Image3.width = 200;
    game_Image3.alt = temp_Picture_Array[2].word;

    let z = Math.floor(Math.random() * temp_Word_Array.length);

    game_Word3.textContent = temp_Word_Array[z];
    temp_Word_Array.splice(z, 1);
}



// checks if the user successfully matched all pairs
function check_GameStatus() {
    if (x == 3) {
        if (picture_Array.length <= 6) {
            game_Description.style.visibility = "hidden";
            end_Message.style.visibility = "visible";
        }
        else {
            end_Page.style.visibility = "visible";
        }
    }
}



// drag and drop handler | based on code from https://www.html5rocks.com/en/tutorials/dnd/basics/
var data = null;

// when user starts dragging
function handleDragStart(e) {
    data = this.textContent;
    box = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}



// allow user to drag over image
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }

    e.dataTransfer.dropEffect = 'move';

    return false;
}



// allows user to drag on picture
function handleDrop(e) {
    // this/e.target is current target element.

    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }

    // checks if user matched the correct word with image
    if (data == this.alt) {
        this.style.visibility = "hidden";
        box.style.visibility = "hidden";

        x = x + 1;

        check_GameStatus();
    }

    return false;
}



// drag and drop initialization for words/pictures
var words = document.querySelectorAll('#words .word1');
[].forEach.call(words, function (word) {
    word.addEventListener('dragstart', handleDragStart, false);
    word.addEventListener('dragover', handleDragOver, false);
});

var words = document.querySelectorAll('#words .word2');
[].forEach.call(words, function (word) {
    word.addEventListener('dragstart', handleDragStart, false);
    word.addEventListener('dragover', handleDragOver, false);
});

var words = document.querySelectorAll('#words .word3');
[].forEach.call(words, function (word) {
    word.addEventListener('dragstart', handleDragStart, false);
    word.addEventListener('dragover', handleDragOver, false);
});

var words = document.querySelectorAll('#pictures .pic1');
[].forEach.call(words, function (word) {
    word.addEventListener('dragover', handleDragOver, false);
    word.addEventListener('drop', handleDrop, false);
});

var words = document.querySelectorAll('#pictures .pic2');
[].forEach.call(words, function (word) {
    word.addEventListener('dragover', handleDragOver, false);
    word.addEventListener('drop', handleDrop, false);
});

var words = document.querySelectorAll('#pictures .pic3');
[].forEach.call(words, function (word) {
    word.addEventListener('dragover', handleDragOver, false);
    word.addEventListener('drop', handleDrop, false);
});
