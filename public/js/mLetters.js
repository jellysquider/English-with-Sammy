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

readFromDatabase();

var b = 0;
var count = 6;

function createDragBoxes() {

  wordIndex = Math.floor(Math.random() * collection.length);
  var word = collection[wordIndex];
  console.log("word: ", collection[wordIndex])
  //console.log("word_index ", wordIndex);
  createLetterDragBoxes(wordIndex, collection);

  function createLetterDragBoxes(wordIndex, collection) {
    // var h = document.createElement("H1")                // Create a <h1> element
    // var t = document.createTextNode("Hello World");     // Create a text node
    // h.appendChild(t);                                   // Append the text to
    wordLength =  collection[wordIndex].length;
    //console.log("word length", wordLength);
    for (let i = 0; i < wordLength; i++) {
      letter = collection[wordIndex].charAt(i);
      //console.log("letter ", letter);
      letterDragBox = document.createElement("div");
      letterDragBox.setAttribute("class", "drag-box");
      //console.log("Box ", letterDragBox);
      letterDragBox.id = "drag-box" + i;
      //letterDragBox.addEventListener = ('ondragstart', dragStart(event));
      letterDragBox.setAttribute("draggable", "true");
      letterDragBox.innerHTML = letter.toUpperCase();
      document.getElementById("drag-boxes").appendChild(letterDragBox);
    }
  }


  // var urlRef = rootRef.child("user1/DAA Notes/URL");
  getAttributes = rootRef.child(word);
  getAttributes.once("value", function(snapshot) {
    snapshot.forEach(function(childAttr) {
      //console.log(childAttr.key + ": " + childAttr.val());
      if (childAttr.key.includes("img")) {
        console.log(childAttr.key + ": " + childAttr.val());
        document.getElementById("matchPicture").setAttribute("src", childAttr.val())
      }

      });
    });

  //imgLink = collection[wordIndex].child("img");
  // console.log("img link ", imgLink)
  //document.getElementById("matchPicture").setAttribute("src", )

}



function dragStart(event) {
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
    event.target.appendChild(document.getElementById(data));
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

function submit001() {
  if (b == count) {
  message001.innerHTML = "Congratulations!";
  }
}
