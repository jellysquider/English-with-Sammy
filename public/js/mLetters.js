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

// helper function to shuffle a string
String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}


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

// use chosen category to retrieve data from the database
var rootRef = firebase.database().ref(`/Categories/${chosen_category}`);

// function to read data from the database
function readFromDatabase() {
    // create a new array
    let all_words_in_database = new Array();
    // database query
    rootRef.once('value').then(function(snapshot) {

      snapshot.forEach(function(childSnapshot) {
        // key will be "ada" the first time and "alan" the second time
        var key = childSnapshot.key;

        all_words_in_database.push(key);
      });
      console.log(all_words_in_database);
    });
    return all_words_in_database;
}

var userScoreInt = 0;
var wordsUserSaw = new Array();

let collection = readFromDatabase();

function Play() {
  // reset array to be empty
  //databasePictures = new Array();

  createDragBoxes();
  console.log("Playing! Invoked createDragBoxes()");


  document.getElementById("playBtn").style.display = "none";

  nextBtn = document.createElement("button");
  nextBtn.setAttribute("class", "btn btn-success");
  nextBtn.setAttribute("onclick", "Next()");
  nextBtn.innerHTML = "Next";
  //dragBox.appendChild(letterDragBox);
  document.getElementById("buttons").appendChild(nextBtn);



  // <button type="button" class="btn btn-success" onclick="Next()">Next</button>
  // <button type="button" class="btn btn-outline-info" onclick="Finish()">Finish</button>
}

function createDragBoxes() {
  var wordIndex = Math.floor(Math.random() * collection.length);
  console.log("word index: ", wordIndex);
  var word = await collection[wordIndex];
  console.log("word: ", word);

  getDatabasePictures(word).then(() => {
    if(wordsUserSaw.includes(word)) {
      return createDragBoxes();
    }
    wordsUserSaw.push(word);
  
    wordShuffle = word.shuffle();
    //console.log("shuffled: " + wordShuffle);
    wordLength =  collection[wordIndex].length;
    //console.log("word length" + wordLength);
    for (let i = 0; i < wordLength; i++) {
      letter = wordShuffle.charAt(i);
      //console.log("letter ", letter);
      letterDragBox = document.createElement("div");
      letterDragBox.setAttribute("class", "drag-box");
      letterDragBox.setAttribute('ondrop', "drop(event)");
      letterDragBox.id = "drag-box" + i;
      letterDragBox.setAttribute('ondragstart', "dragStart(event)");
      letterDragBox.setAttribute("draggable", "true");
      letterDragBox.innerHTML = letter.toUpperCase();
      //dragBox.appendChild(letterDragBox);
      document.getElementById("drag-boxes").appendChild(letterDragBox);
  
      acceptingBox = document.createElement("div");
      acceptingBox.setAttribute("class", "drag-box");
      acceptingBox.setAttribute('ondrop', "actualDrop(event)");
      acceptingBox.setAttribute('ondragover', "allowDrop(event)");
      acceptingBox.id = "letter:" + word.toUpperCase().charAt(i);
      document.getElementById("drop-boxes").appendChild(acceptingBox);
  
    }
    next_done = false;
  });

}

function getDatabasePictures(word) {
  let databasePictures = new Array();

  getAttributes = rootRef.child(word);
  //console.log("getAttributes: ", getAttributes);

  return getAttributes.once("value", function(snapshot) {
      snapshot.forEach(function(childAttr) {
        //console.log(childAttr.key + ": " + childAttr.val());
        // check if one of the keys include image
        if (childAttr.key.includes("img")) {
          // add it to the databasePictures array
          databasePictures.push(childAttr.val());

          console.log("databasePictures: " + databasePictures);
          randomPicture = databasePictures[Math.floor(Math.random()*databasePictures.length)];
          wordPicture = document.getElementById("letter-picture");
          wordPicture.setAttribute("class", "mx-auto my-5 d-block letterPic");
          wordPicture.setAttribute("style", "display: block;");
          wordPicture.setAttribute("src", randomPicture);
        };
      });
    });
}


// allowDrop(event) is prevented so that nothing can be dragged by default
function allowDrop(event) {
  event.preventDefault();
}

// dragStart(event) is used to assign dragging event to buttons that are allowed
// to be dragged for setting data: what button the user selected (choise = button ID)
// and what letter is in that button (letter = inner.HTML of the button)
function dragStart(event) {
  //console.log(event)
  event.dataTransfer.setData("choice", event.target.id);
  event.dataTransfer.setData("letter", event.target.innerHTML);
}

// actualDrop(event) is used to getting data set by the dragStart(event)
// it also compares if the letter-button that user selected equals to
// the correct letter
function actualDrop(event) {
  var data = event.dataTransfer.getData("choice");
  var letter = event.dataTransfer.getData("letter");
  //console.log(letter)
  var str = event.target.id;
  str = str.split("letter:")
  if(str[1] == letter) {
    //console.log("Yes!")
    event.target.innerHTML = letter;
    //userScore.innerHTML = ++userScoreInt;
    //console.log(userScoreInt)
    var idStr = data;
    // regex syntaxt to replace a non-digit character globally with an empty one
    idStr = idStr.replace(/\D/g,'');
    // set a different id so that it can
    event.target.id = "drag-box" + idStr + "matched"

    document.getElementById("drag-box" + idStr + "matched").style.background = '#3fd262';
    document.getElementById("drag-box" + idStr + "matched").style.border = '0px';

    // hide the letter-button after it was already dragged and dropped in place
    document.getElementById("drag-box" + idStr).style.visibility = "hidden";

  }
  else {
    console.log("No!")
  }
}

function drop(event) {
  event.preventDefault();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

next_done = false
async function Next() {
  next_done = true;
  //if (userScoreInt == wordLength) {
  //message001.innerHTML = "Congratulations!";

  if(!next_done){
    await sleep(500);
  
    userScoreInt = 0;
    //userScore.innerHTML = 0;
  
    var removeDragBoxes = document.getElementById("drag-boxes");
    while (removeDragBoxes.firstChild) {
        removeDragBoxes.removeChild(removeDragBoxes.firstChild);
    }
  
    var removeDropBoxes = document.getElementById("drop-boxes");
    while (removeDropBoxes.firstChild) {
        removeDropBoxes.removeChild(removeDropBoxes.firstChild);
    }
  
    var removeImg = document.getElementById("letter-picture");
    while (removeImg.firstChild) {
        removeImg.removeChild(removeImg.firstChild);
    }
    createDragBoxes();
  
    //message001.innerHTML = "";
    //}
  }
}
