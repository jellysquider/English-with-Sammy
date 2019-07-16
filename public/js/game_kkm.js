var collection = [];

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


var easyMode = false;
var score = 0;
var missed_word_count = 0;
var speed = 3000; //3s
var endAt = 10000; //10s
var minEndAt = 6000; //6s

var speedDecrementBy = 200; //150
var endAtDecrementBy = 600; //500

// DOM vars
var key;
var typing;
var c1;
var c2;
var oldKeys;
var playBtn;

var oldKeysArray = [];

// Timer varialbles
let c1FillerTimer;
let c2FillerTimer;

// Is Array c1 and c2 ended
let isC1Ended = false;
let isC2Ended = false;

// Array container for 1 and 2 with pointer index
var arr1 = [];
var arr1Pointer = 0;
var arr2 = [];
var arr2Pointer = 0;

let sound = new Audio();

let damaged_sount = new Audio('../../../../public/sound/damaged_sound.mp3');

let heart_bar = document.getElementById("life_bar");

let one_two_three = Math.floor(Math.random()*3);


//function parses querystring and return category that user chose
function checkCategory(){
    let urlParams = new URLSearchParams(window.location.search);
    let category = urlParams.get("category");
    if (category != null){
        return category
    }
    else{
        return ""
    }
}

let chosen_category = checkCategory();

//function which read vocabulary from the database
function readFromDatabase() {
    return firebase.database().ref(`/Categories/${chosen_category}`).on('value', function(snapshot) {

        let all_words_in_database = [];

        let myValue = snapshot.val();

        console.log(myValue)


        for (let key in myValue){
            all_words_in_database.push(key)
        }
        console.log(all_words_in_database)
        collection = all_words_in_database;
        fillAndShuffleArray();


    });
}

readFromDatabase();

//function randomly shuffles the array
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let rnd = Math.floor(Math.random() * i);

        let temp = arr[i];
        arr[i] = arr[rnd];
        arr[rnd] = temp;
    }
    return arr;
}

document.addEventListener("DOMContentLoaded", setup);

//function add basic components
function setup() {
    // EASY MODE SWITCHER //
    document.getElementById("easyMode").addEventListener("change", function() {
        if (document.getElementById("easyMode").checked) {
            easyMode = true;
            isC2Ended = true;
        } else {
            easyMode = false;
            isC2Ended = false;
        }
    });

    // Setup Array 1 and 2
    fillAndShuffleArray();

    // Setup DOM variables
    typing = document.getElementsByClassName("typing")[0];
    oldKeys = document.getElementsByClassName("old_keys")[0];
    playBtn = document.getElementsByClassName("play_btn")[0];
    c1 = document.getElementById("c1");
    c2 = document.getElementById("c2");

    // Start Game click event add to Play btn
    playBtn.addEventListener("click", startGame);
}

//divide 'collection' array to arr1 and arr2
function fillAndShuffleArray() {
    let collectionShuffle = shuffle(collection);
    arr1 = collectionShuffle.slice(0, Math.round(collectionShuffle.length / 2));
    arr2 = collectionShuffle.slice(
        Math.round(collectionShuffle.length / 2),
        collectionShuffle.length
    );

    // Double shuffle
    arr1 = shuffle(arr1);
    arr2 = shuffle(arr2);
}

//function invoked when user press 'play' button
function startGame(evt) {
    console.log("game start")

    let heart_bar = document.getElementById("life_bar")
    let heart = `<img src = '../../../../public/img/heart_icon.png' width = 100px>`

    for (let k = 0; k < 3; k ++){
        heart_bar.insertAdjacentHTML('beforeend',heart);
    }


    playBtn.removeEventListener("click", startGame);
    playBtn.style.display = "none";
    document.getElementById("easyMode").parentElement.style.display = "none";

    oldKeys.innerHTML = "Start Typing..";
    document.addEventListener("keyup", typeTrack);

    oldKeysArray = [];

    fillC1Timer();
    if (!easyMode) {
        fillC2Timer();
    }

    sound.src = "https://freesound.org/data/previews/243/243020_4284968-lq.mp3";
    sound.autoplay = true;
    sound.play();

    c1.parentElement.style.background = "#39e6ef";
    c1.parentElement.style.cursor = "initial";
    c1.parentElement.title = "";

    c2.parentElement.style.background = "#39e6ef";
    c2.parentElement.style.cursor = "initial";
    c2.parentElement.title = "";
}

// containerNumber,arrayOfWords,ArrayPointerForThatArrayList,ResetFunction,DOMContainerVarialbe(c1,c2 etc),FillerTimer
// Example - 1,arr1,arr1Pointer,resetC1,c1,c1FillerTimer
function fillC1Timer() {
    c1FillerTimer = setInterval(fillC1, 200); // speed 200 for first word
}

function fillC2Timer() {
    c2FillerTimer = setInterval(fillC2, 2000); // speed 200 for first word
}

//function fill content on the upper line
function fillC1() {
    let word = document.createElement("span");
    word.innerHTML = arr1[arr1Pointer];

    //word.innerHTML = `<img src = ${arr1[arr1Pointer].img0} height = 80px>`
    word.style.animation =
        "floater " + (endAt / 1000).toFixed(2) + "s linear forwards";
    word.id = "word-" + "1-" + arr1Pointer;
    word.classList.add("typing_word");
    c1.appendChild(word);

    let ap = arr1Pointer;
    setTimeout(function() {

        if(arr1[ap]!=""){ // when user missed the typing
            missed_word_count++;

            heart_bar.removeChild(heart_bar.lastChild)

            damaged_sount.play();

        }

        arr1[ap] = "";
        word.innerHTML = "";
    }, endAt);

    arr1Pointer++;

    if (missed_word_count >= 3){ // when user missed more than three times
        clearInterval(c1FillerTimer);
        resetC1();
        resetAll();
        // setTimeout(function() {
        //     resetC1();
        // }, endAt + 200);
    }

    else if (arr1Pointer < arr1.length) { //when there is words remain on the array

        if (endAt > minEndAt) {
            speed = speed - speedDecrementBy;
            endAt = endAt - endAtDecrementBy;
        }

        clearInterval(c1FillerTimer);
        c1FillerTimer = setInterval(fillC1, speed);
    }



    else {// when user user typed every word in the array

        clearInterval(c1FillerTimer);
        setTimeout(function() {
            resetC1();
        }, endAt+200);
    }
}

//same with fillC1 function, but this function fills the lower line
function fillC2() {
    let word = document.createElement("span");
    word.innerHTML = arr2[arr2Pointer];
    word.style.animation =
        "floater " + (endAt / 1000).toFixed(2) + "s linear forwards";
    word.id = "word-" + "2-" + arr2Pointer;
    word.classList.add("typing_word");
    c2.appendChild(word);

    let ap = arr2Pointer;
    setTimeout(function() {
        if (arr2[ap]!=""){
            missed_word_count++;

            heart_bar.removeChild(heart_bar.lastChild)

            damaged_sount.play();
        }
        arr2[ap] = "";
        word.innerHTML = "";
    }, endAt);

    arr2Pointer++;

    if (missed_word_count >= 3){
        clearInterval(c2FillerTimer);
        resetC2();
        resetAll();

    }

    else if (arr2Pointer < arr2.length) {
        // No need to decrement timer speed and end here //


        clearInterval(c2FillerTimer);
        c2FillerTimer = setInterval(fillC2, speed);
    }



    else {

        clearInterval(c2FillerTimer);
        setTimeout(function() {
            resetC2();
        }, endAt + 200);
    }
}

function checkGameOver() { //check whether both top and bottom lines are finished.

    if (isC1Ended && isC2Ended) {
        playBtn.addEventListener("click", startGame);
        playBtn.style.display = "initial";

        resetAll();
    }
}

function resetC1() { // action when upper line is finished
    c1.parentElement.style.background = "brown";
    c1.parentElement.style.cursor = "not-allowed";
    c1.parentElement.title = "Pack Ended";
    c1.innerHTML = "";
    isC1Ended = true;
    checkGameOver();
}

function resetC2() {//action when lower line is finished
    c2.parentElement.style.background = "brown";
    c2.parentElement.style.cursor = "not-allowed";
    c2.parentElement.title = "Pack Ended";
    c2.innerHTML = "";
    isC2Ended = true;
    checkGameOver();
}

function resetAll() { //action when both line are finished.
    clearInterval(c1FillerTimer);
    clearInterval(c2FillerTimer);
    c1FillerTimer = null;
    c2FillerTimer = null;

    if (!easyMode) {
        document.getElementById("score").innerHTML =
            score + "/" + collection.join("").length;
    } else {
        document.getElementById("score").innerHTML =
            score +
            "/" +
            collection.slice(0, Math.round(collection.length / 2)).join("").length;
    }

    oldKeys.innerHTML = "Game Over";
    typing.innerHTML = "";

    score = 0;
    speed = 3000; //3s
    endAt = 10000; //10s
    minEndAt = 6000; //6s

    speedDecrementBy = 200; //150
    endAtDecrementBy = 600; //500

    arr1 = [];
    arr1Pointer = 0;
    arr2 = [];
    arr2Pointer = 0;

    fillAndShuffleArray();

    oldKeysArray = [];

    isC1Ended = false;
    isC2Ended = false;

    c1.parentElement.style.background = "#ACACAC";
    c1.parentElement.style.cursor = "initial";
    c1.parentElement.title = "";

    c1.innerHTML = "";

    c2.parentElement.style.background = "#ACACAC";
    c2.parentElement.style.cursor = "initial";
    c2.parentElement.title = "";
    c2.innerHTML = "";

    document.getElementById("easyMode").parentElement.style.display = "initial";

    sound.src = "https://freesound.org/data/previews/243/243020_4284968-lq.mp3";
    sound.autoplay = true;
    sound.play();

    missed_word_count = 0

    let heart_bar = document.getElementById("life_bar");
    heart_bar.innerHTML = '';

    setTimeout(function(){
        location.reload();
    },2000);
}

function typeTrack(evt) { //action when user types something
    if (evt.keyCode == 8) {
        backspaceHandler();
        return;
    }

    // key var + oldKey array fill
    key = evt.key[0].toLowerCase();
    typing.innerHTML = key;

    if (key != null) {
        oldKeysArray.push(key);
    }

    // Key press animation
    typing.className += " new";
    setTimeout(() => {
        typing.className = "typing";
    }, 80);

    // Old Key show
    oldKeys.innerHTML =
        oldKeysArray.length < 10 ? oldKeysArray : "..." + oldKeysArray.slice(-10);
    //typing.innerHTML = String.fromCharCode((96 <= key && key <= 105)? key-48 : key);

    // THEN CHECK IF VALID TO SPELLING //
    typeCheck();
}

function typeCheck() { //function to check spelling.
    for (let i = 0; i < arr1Pointer; i++) {
        //comapre slice of oldKeys to length of this word with this word //
        if (arr1[i].toLowerCase() == (oldKeysArray.slice(-arr1[i].length).join("")).toLowerCase()) {
            // Update Score
            score += arr1[i].length;
            document.getElementById("score").innerHTML = score;
            // Remove Word
            arr1[i] = "";
            document.getElementById("word-1-" + i).className = "fade";
            setTimeout(function() {
                try {
                    if (arr1.join("").length <= 0 && oldKeysArray.length > 0) {
                        resetC1();
                    }
                    document.getElementById("word-1-" + i).innerHTML = "";
                } catch (e) {
                    console.log("Quick End");
                }
            }, 1500);
            correctDing();
            return;

        }
    }

    if (!easyMode) {
        for (let i = 0; i < arr2Pointer; i++) {
            //compare slice of oldKeys to length of this word with this word //
            if (arr2[i].toLowerCase() == (oldKeysArray.slice(-arr2[i].length).join("")).toLowerCase()) {
                // Update Score
                score += arr2[i].length;
                document.getElementById("score").innerHTML = score;
                // Remove Word
                arr2[i] = "";
                document.getElementById("word-2-" + i).className = "fade";
                setTimeout(function() {
                    try {
                        if (arr2.join("").length <= 0 && oldKeysArray.length > 0) {
                            resetC2();
                        }
                        document.getElementById("word-2-" + i).innerHTML = "";
                    } catch (e) {
                        console.log("Quick End");
                    }
                }, 1500);
                correctDing();
                return;
            }
        }
    }
}

function backspaceHandler() {//when user types backspace
    oldKeysArray.pop();
    typing.innerHTML = "⌫";
    oldKeys.innerHTML =
        oldKeysArray.length < 10 ? oldKeysArray : "..." + oldKeysArray.slice(-10);
}

function correctDing() {//sound play when user get a correct answer
    sound.src = "https://freesound.org/data/previews/335/335908_5865517-lq.mp3";
    sound.autoplay = true;
    sound.play();
}
