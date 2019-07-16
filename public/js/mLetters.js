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

var rootRef = firebase.database().ref('/Categories/Fruits');


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

function readFromDatabase() {
    return rootRef.on('value', function(snapshot) {
        // initializeTable();
        let all_words_in_database = [];

        let myValue = snapshot.val();

        for (let i in myValue) {
          all_words_in_database.push(i);
        }
        console.log(all_words_in_database)
        collection = all_words_in_database;
        createDragBoxes();
    });
}


var b = 0;
var count = 0;
var seen = new Array();

readFromDatabase();
function createDragBoxes() {

  console.log("createDragBoxes()")
  wordIndex = Math.floor(Math.random() * collection.length);
  var word = collection[wordIndex];
  getDatabasePictures(word);

  if(seen.includes(word)) {
    return createDragBoxes();
  }
  seen.push(word);
  console.log("word: ", collection[wordIndex])
  console.log("hello")

  wordShuffle = word.shuffle();
  console.log("shuffled: " + wordShuffle);
  wordLength =  collection[wordIndex].length;
  count = wordLength;

  console.log("word length" + wordLength);
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
    acceptingBox.id = "b:" + word.toUpperCase().charAt(i);
    document.getElementById("drop-boxes").appendChild(acceptingBox);

    }
}

function getDatabasePictures(word) {
  databasePictures = []
  getAttributes = rootRef.child(word);
  getAttributes.once("value", function(snapshot) {
    snapshot.forEach(function(childAttr) {
      //console.log(childAttr.key + ": " + childAttr.val());
      if (childAttr.key.includes("img")) {
        databasePictures.push(childAttr.val());
        //console.log("databasePictures: " + databasePictures);
      }
      });
    });
    wordPictureTag = document.createElement("img");
    randomPicture = databasePictures[Math.floor(Math.random()*databasePictures.length)];
    //console.log("randomPicture: " + randomPicture);
    wordPictureTag.setAttribute("class", "mx-auto my-5 d-block letterPic");
    wordPictureTag.setAttribute("src", randomPicture);
    document.getElementById("letter-picture").appendChild(wordPictureTag);
}

function dragStart(event) {
  console.log(event)
  event.dataTransfer.setData("choice", event.target.id);
  event.dataTransfer.setData("letter", event.target.innerHTML);
}

function allowDrop(event) {
  event.preventDefault();
}

function actualDrop(event) {
  var data = event.dataTransfer.getData("choice");
  var letter = event.dataTransfer.getData("letter");
  console.log(letter)
  var str = event.target.id;
  str = str.split("b:")
  if(str[1] == letter) {
    console.log("Yes!")
    event.target.innerHTML = letter;
    score001.innerHTML = ++b;
    console.log(b)
    var idStr = data;
    idStr = idStr.replace(/\D/g,'');
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

async function submit001() {
  if (b == count) {
  message001.innerHTML = "Congratulations!";

  await sleep(1000);

  b = 0;
  count = 0;
  score001.innerHTML = 0;

  var myNode = document.getElementById("drag-boxes");
  while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
  }

  var myNode = document.getElementById("drop-boxes");
  while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
  }

  createDragBoxes();

  message001.innerHTML = "";

  }
}
