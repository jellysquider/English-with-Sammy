class Picture {
    constructor(image, word) {
        this._image = image;
        this._word = word;
    }

    get image() {
        return this._image;
    }

    get word() {
        return this._word;
    }
}

var picture_Array = [];
var x = 0;


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


function retrieve_Database_Values() {
    picture_Array = [];

    var ref = firebase.database().ref("/Categories/Fruits");
    ref.once("value").then(function (snapshot) {


        let fruits = snapshot.val();

        for (let i in fruits) {
            var img = snapshot.child(i).child("img0").val();

            const picture = new Picture(img, i);
            picture_Array.push(picture);
        }
    });
}


retrieve_Database_Values();
initialize_Game();




function initialize_Game() {


    document.getElementById("game_Page");
    document.getElementById("end_Page")[0];

    document.getElementById("play_Button").addEventListener("click", start_Game);
    document.getElementById("restart_Button").addEventListener("click", restart_Game);
    document.getElementById("quit_Button").addEventListener("click", quit_Game);
    document.getElementById("continue_Button").addEventListener("click", continue_Game);

}


function start_Game(evt) {
    x = 0;

    change_Images();

    play_Button.style.visibility = "hidden";
    game_Page.style.visibility = "visible";


}

function change_Images() {

    var game_Image1 = document.getElementsByClassName("pic1")[0];
    var game_Image2 = document.getElementsByClassName("pic2")[0];
    var game_Image3 = document.getElementsByClassName("pic3")[0];

    var game_Word1 = document.getElementsByClassName("word1")[0];
    var game_Word2 = document.getElementsByClassName("word2")[0];
    var game_Word3 = document.getElementsByClassName("word3")[0];

    game_Image1.style.visibility = "visible";
    game_Image2.style.visibility = "visible";
    game_Image3.style.visibility = "visible";

    game_Word1.style.visibility = "visible";
    game_Word2.style.visibility = "visible";
    game_Word3.style.visibility = "visible";


    let temp_Picture_Array = [];


    if (picture_Array.length <= 3) {
        console.log("sigh");
    }
    else {
        for (i = 0; i < 3; i++) {
            let temp = picture_Array[Math.floor(Math.random() * picture_Array.length)];



            picture_Array.splice(temp, 1);

            if (temp_Picture_Array.includes(temp)) {
                temp = picture_Array[Math.floor(Math.random() * picture_Array.length)];
            }


            console.log(picture_Array.length);


            temp_Picture_Array.push(temp);

        }
    }




    if (temp_Picture_Array[0].image == "") {
        console.log("hi");
    }
    else {
        game_Image1.src = temp_Picture_Array[0].image;
        game_Image1.height = 200;
        game_Image1.width = 200;
        game_Image1.alt = temp_Picture_Array[0].word

        game_Word1.textContent = temp_Picture_Array[0].word;

    }
    if (temp_Picture_Array[1].image == "") {
        console.log("hi");
    }
    else {
        game_Image2.src = temp_Picture_Array[1].image;
        game_Image2.height = 200;
        game_Image2.width = 200;
        game_Image2.alt = temp_Picture_Array[1].word

        game_Word2.textContent = temp_Picture_Array[1].word;
    }
    if (temp_Picture_Array[2].image == "") {
        console.log("hi");
    }
    else {
        game_Image3.src = temp_Picture_Array[2].image;
        game_Image3.height = 200;
        game_Image3.width = 200;
        game_Image3.alt = temp_Picture_Array[2].word

        game_Word3.textContent = temp_Picture_Array[2].word;
    }
}


function restart_Game(evt) {

    x = 0;


    change_Images();


    retrieve_Database_Values();






}

function quit_Game(evt) {



    var game_Image1 = document.getElementsByClassName("pic1")[0];
    var game_Image2 = document.getElementsByClassName("pic2")[0];
    var game_Image3 = document.getElementsByClassName("pic3")[0];

    var game_Word1 = document.getElementsByClassName("word1")[0];
    var game_Word2 = document.getElementsByClassName("word2")[0];
    var game_Word3 = document.getElementsByClassName("word3")[0];

    game_Image1.style.visibility = "hidden";
    game_Image2.style.visibility = "hidden";
    game_Image3.style.visibility = "hidden";

    game_Word1.style.visibility = "hidden";
    game_Word2.style.visibility = "hidden";
    game_Word3.style.visibility = "hidden";

    game_Page.style.visibility = "hidden";
    play_Button.style.visibility = "visible";

    retrieve_Database_Values();





}

function continue_Game(evt) {

    x = 0;

    change_Images();

    game_Page.style.visibility = "visible";

    end_Page.style.visibility = "hidden";

}




var data = null;

function handleDragStart(e) {
    // Target (this) element is the source node.


    data = this.textContent;

    box = this;


    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}


function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }

    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.


    return false;
}

var x = 0;

function handleDrop(e) {
    // this/e.target is current target element.

    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }



    if (data != this.alt) {
        console.log("not the same");
    }

    else {

        this.style.visibility = "hidden";

        box.style.visibility = "hidden";

        x = x + 1;

        check_GameStatus();


    }


    // Don't do anything if dropping the same column we're dragging.


    return false;
}




function check_GameStatus() {
    if (x == 3) {
        console.log("congrats");
        game_Page.style.visibility = "hidden";
        end_Page.style.visibility = "visible";


    }

}






var words = document.querySelectorAll('#words .word1');
[].forEach.call(words, function (word) {
    word.addEventListener('dragstart', handleDragStart, false);

    word.addEventListener('dragover', handleDragOver, false);

    word.addEventListener('drop', handleDrop, false);

});

var words = document.querySelectorAll('#words .word2');
[].forEach.call(words, function (word) {
    word.addEventListener('dragstart', handleDragStart, false);

    word.addEventListener('dragover', handleDragOver, false);

    word.addEventListener('drop', handleDrop, false);

});

var words = document.querySelectorAll('#words .word3');
[].forEach.call(words, function (word) {
    word.addEventListener('dragstart', handleDragStart, false);

    word.addEventListener('dragover', handleDragOver, false);

    word.addEventListener('drop', handleDrop, false);

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
