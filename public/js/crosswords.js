/*
    crosswords.js

    This file is script file for the Crossword game including map generation, correcting, and difficulty changing.
*/

//==================================================
// Global

var board, wordArr, wordBank, wordsActive, mode;

var Bounds = {  
  top:0, right:0, bottom:0, left:0,

  Update:function(x,y){
    this.top = Math.min(y,this.top);
    this.right = Math.max(x,this.right);
    this.bottom = Math.max(y,this.bottom);
    this.left = Math.min(x,this.left);
  },
  
  Clean:function(){
    this.top = 999;
    this.right = 0;
    this.bottom = 0;    
    this.left = 999;
  }
};

function WordObj(stringValue, i){
    this.string = stringValue;
    this.char = stringValue.split("");
    this.totalMatches = 0;
    this.effectiveMatches = 0;
    this.successfulMatches = [];  
    this.index = i;
}

//==================================================
// Main Routine
// - The only code runs directly from the Javascript
$(() => {
    init();

    $("#mode").click(() => {
      if($("[for='mode']").text() === "Text Mode"){
        $("[for='mode']").text("Image Mode");
        resetBoard(true);
      }
      else {
        $("[for='mode']").text("Text Mode")
        resetBoard(false);
      }
    })

    setBoard();
})

// function init: void -> void
// - initialize everything needed before running the program
function init(){
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyAWCffYBhhwfmwao-gkgg_3f86bErtpHj0",
        authDomain: "english-with-sammy.firebaseapp.com",
        databaseURL: "https://english-with-sammy.firebaseio.com",
        projectId: "english-with-sammy",
        storageBucket: "english-with-sammy.appspot.com",
        messagingSenderId: "938824486935",
        appId: "1:938824486935:web:86652c039bb3a069"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}

//==================================================
// Board Creation
// - Read data from DB
// - Generate crossword

// function setBoard: boolean -> void
// - set the Crossword board on HTML
function setBoard(image_mode){
    var parser = document.createElement('a'); // parse URL
    parser.href = window.location.href;
    var category = parser.search.split("=")[1];
    if(!category) category = "Fruits";  // default category for error handling

    firebase.database().ref(`Categories/${category}/`).once('value').then(snapshot => {
        if(snapshot.val() !== null){
            var words = Object.keys(snapshot.val());
            wordArr = words.map(word => word.toUpperCase());
    
            // Populate board
            for(var i = 0, isSuccess=false; i < 10 && !isSuccess; i++){
                resetGlobal();
                isSuccess = populateBoard();
            }

            // Make Playable
            $("#crossword").html(generateHTML());
            $(".letter").html("<input class='char' type='text' maxlength='1'></input>");

            // Add Index
            addBoardIndex();

            // Add Hints
            if(image_mode)  addImages(snapshot.val());
            else addHints(snapshot.val());
        }
    })
}

// function setBoard: boolean -> void
// - set the Crossword board on HTML without re-generation
function resetBoard(image_mode){
  var parser = document.createElement('a'); // parse URL
  parser.href = window.location.href;
  var category = parser.search.split("=")[1];
  if(!category) category = "Fruits";  // default category for error handling

  firebase.database().ref(`Categories/${category}/`).once('value').then(snapshot => {
      if(snapshot.val() !== null){
          var words = Object.keys(snapshot.val());
          wordArr = words.map(word => word.toUpperCase());

          // Make Playable
          $("#crossword").html(generateHTML());
          $(".letter").html("<input class='char' type='text' maxlength='1'></input>");

          // Add Index
          addBoardIndex();

          // Add Hints
          if(image_mode)  addImages(snapshot.val());
          else addHints(snapshot.val());
      }
  })
}

// function generateBoardFromWords: words -> void
// - initially generate the board with words
function generateBoardFromWords(words){
    wordArr = words.map(word => word.toUpperCase());
    
    for(var i = 0, isSuccess=false; i < 10 && !isSuccess; i++){
        resetGlobal();
        isSuccess = populateBoard();
    }
}

// function: addBoardIndex: void -> void
// - add index to board html
function addBoardIndex(){
    wordsActive.forEach(word => {
        var x = -1, y = -1;
        if(word.dir == 0){  //horizontal
            x = word.x + 1 - Bounds.left;
            y = word.y + 2 - Bounds.top;
        }
        else{ //vertical
            x = word.x + 2 - Bounds.left;
            y = word.y + 1 - Bounds.top;
        }

        $(`.row:nth-child(${y}) > .square:nth-child(${x})`).html(word.index);
        $(`.row:nth-child(${y}) > .square:nth-child(${x})`).addClass('index');
    })
}

// function resetGlobal: void -> void
// - reset global variables
function resetGlobal(){
    Bounds.Clean();
    wordBank = [];
    wordsActive = [];
    board = [];
    
    for(var i = 0; i < 32; i++){
      board.push([]);
      for(var j = 0; j < 32; j++){
        board[i].push(null);
      }
    }
}

// function populateBoard: void -> void
// - populate board
function populateBoard(){
    wordBank = wordArr.map((word, index) => new WordObj(word, index + 1));
    for(i = 0; i < wordBank.length; i++){
        for(var j = 0, wA=wordBank[i]; j<wA.char.length; j++){
          for(var k = 0, cA=wA.char[j]; k<wordBank.length; k++){
            for(var l = 0,wB=wordBank[k]; k!==i && l<wB.char.length; l++){
              wA.totalMatches += (cA === wB.char[l])?1:0;
            }
          }
        }
    } 
    
    for(var i=0,isOk=true,len=wordBank.length; i<len && isOk; i++){
      isOk = addWordToBoard();
    }  
    return isOk;
}

// function addWordToBoard: void -> void
// - add each word to board
function addWordToBoard(){
    var i, len, curIndex, curWord, curChar, curMatch, testWord, testChar, 
        minMatchDiff = 9999, curMatchDiff;  
  
    if(wordsActive.length < 1){
      curIndex = 0;
      for(i = 0, len = wordBank.length; i < len; i++){
        if (wordBank[i].totalMatches < wordBank[curIndex].totalMatches){
          curIndex = i;
        }
      }
      wordBank[curIndex].successfulMatches = [{x:12,y:12,dir:0}];
    }
    else{  
      curIndex = -1;
      
      for(i = 0, len = wordBank.length; i < len; i++){
        curWord = wordBank[i];
        curWord.effectiveMatches = 0;
        curWord.successfulMatches = [];
        for(var j = 0, lenJ = curWord.char.length; j < lenJ; j++){
          curChar = curWord.char[j];
          for (var k = 0, lenK = wordsActive.length; k < lenK; k++){
            testWord = wordsActive[k];
            for (var l = 0, lenL = testWord.char.length; l < lenL; l++){
              testChar = testWord.char[l];            
              if (curChar === testChar){
                curWord.effectiveMatches++;
                
                var curCross = {x:testWord.x,y:testWord.y,dir:0};              
                if(testWord.dir === 0){                
                  curCross.dir = 1;
                  curCross.x += l;
                  curCross.y -= j;
                } 
                else{
                  curCross.dir = 0;
                  curCross.y += l;
                  curCross.x -= j;
                }
                
                var isMatch = true;
                
                for(var m = -1, lenM = curWord.char.length + 1; m < lenM; m++){
                  var crossVal = [];
                  if (m !== j){
                    if (curCross.dir === 0){
                      var xIndex = curCross.x + m;
                      
                      if (xIndex < 0 || xIndex > board.length){
                        isMatch = false;
                        break;
                      }
                      
                      crossVal.push(board[xIndex][curCross.y]);
                      crossVal.push(board[xIndex][curCross.y + 1]);
                      crossVal.push(board[xIndex][curCross.y - 1]);
                    }
                    else{
                      var yIndex = curCross.y + m;
                      
                      if (yIndex < 0 || yIndex > board[curCross.x].length){
                        isMatch = false;
                        break;
                      }
                      
                      crossVal.push(board[curCross.x][yIndex]);
                      crossVal.push(board[curCross.x + 1][yIndex]);
                      crossVal.push(board[curCross.x - 1][yIndex]);
                    }
  
                    if(m > -1 && m < lenM-1){
                      if (crossVal[0] !== curWord.char[m]){
                        if (crossVal[0] !== null){
                          isMatch = false;                  
                          break;
                        }
                        else if (crossVal[1] !== null){
                          isMatch = false;
                          break;
                        }
                        else if (crossVal[2] !== null){
                          isMatch = false;                  
                          break;
                        }
                      }
                    }
                    else if (crossVal[0] !== null){
                      isMatch = false;                  
                      break;
                    }
                  }
                }
                
                if (isMatch === true){                
                  curWord.successfulMatches.push(curCross);
                }
              }
            }
          }
        }
        
        curMatchDiff = curWord.totalMatches - curWord.effectiveMatches;
        
        if (curMatchDiff<minMatchDiff && curWord.successfulMatches.length>0){
          curMatchDiff = minMatchDiff;
          curIndex = i;
        }
        else if (curMatchDiff <= 0){
          return false;
        }
      }
    }
    
    if (curIndex === -1){
      return false;
    }
      
    var spliced = wordBank.splice(curIndex, 1);
    wordsActive.push(spliced[0]);
    
    var pushIndex = wordsActive.length - 1,
        rand = Math.random(),
        matchArr = wordsActive[pushIndex].successfulMatches,
        matchIndex = Math.floor(rand * matchArr.length),  
        matchData = matchArr[matchIndex];
    
    wordsActive[pushIndex].x = matchData.x;
    wordsActive[pushIndex].y = matchData.y;
    wordsActive[pushIndex].dir = matchData.dir;
    
    for(i = 0, len = wordsActive[pushIndex].char.length; i < len; i++){
      var xIndex = matchData.x,
          yIndex = matchData.y;
      
      if (matchData.dir === 0){
        xIndex += i;    
        board[xIndex][yIndex] = wordsActive[pushIndex].char[i];
      }
      else{
        yIndex += i;  
        board[xIndex][yIndex] = wordsActive[pushIndex].char[i];
      }
      
      Bounds.Update(xIndex,yIndex);
    }
      
    return true;
}

// function generateHTML: void -> html
// - generate html of board
function generateHTML(){
    var html = "";
    for(var i = Bounds.top - 1; i < Bounds.bottom + 2; i++){
        html += "<div class='row'>";
        for(var j = Bounds.left - 1; j < Bounds.right + 2; j++){
            html += board[j][i] ? `<div class="square letter">${board[j][i]}</div>` : `<div class="square" />`;
        }
        html += "</div>";
    }
    return html;
}

// function addHints: data -> void
// - set hints on html
function addHints(data){
    var keys = Object.keys(data);
    var _data = {}
    keys.forEach(key => {
        _data[key.toUpperCase()] = data[key];
    })
    data = _data;

    var hints = {}
    wordsActive.forEach(word => {
        hints[word.index] = data[word.string].description;
    })

    var html = "";
    keys = Object.keys(hints);
    keys = keys.map(key => parseInt(key)).sort((a, b)=>{return a-b});

    keys.forEach(key => {
        html += hints[key] ? `<p class="hint">${key}. ${hints[key]}</p>` : `<p class="hint">${key}. description does not exist</p>`;
    })

    $(".hints").html(html);
}

// function: addImages: data -> void
// - set images on html
function addImages(data){
  var keys = Object.keys(data);
    var _data = {}
    keys.forEach(key => {
        _data[key.toUpperCase()] = data[key];
    })
    data = _data;

    var hints = {}
    wordsActive.forEach(word => {
        hints[word.index] = data[word.string].img0;
    })

    var html = "";
    keys = Object.keys(hints);
    keys = keys.map(key => parseInt(key)).sort((a, b)=>{return a-b});

    keys.forEach(key => {
      html += hints[key] ? `<div class="hint-image"><div class="key"><div class="key-value">${key}</div></div><img src="${hints[key]}"></img></div>`: `<p class="hint">${key}. image does not exist</p>`;
    })

    $(".hints").html(html);
}

//==================================================
// Answer-Related
// - All of answer-related functions here

//function: gatherAnswer: void -> void
// - gather answer of user
function gatherAnswer(){
  const nRows = $(".row").length;
  const nCols = $(".row:nth-child(1) > .square").length;

  var users = [];
  for(var row = 1; row <= nRows; row++){
    users.push([]);
    for(var col = 1; col <= nCols; col++){
      if($(`.row:nth-child(${row}) > .square:nth-child(${col})`).hasClass('letter')){
        users[row-1].push($(`.row:nth-child(${row}) > .square:nth-child(${col}) > input`).val());
      }
      else{
        users[row-1].push(null);
      }
    }
  }

  return users;
}

//function: cheatAnswer: void -> void
// - cheat the answers: show correct answer for 3 seconds
function cheatAnswer(){
  var users = gatherAnswer();

  $("#crossword").html(generateHTML());
  addBoardIndex();

  $("#three").show();
  setTimeout(() => {
    $("#three").hide();
    $("#two").show();
    setTimeout(() => {
      $("#two").hide();
      $("#one").show();
      setTimeout(()=>{
        $("#one").hide();
        $(".letter").html("<input class='char' type='text' maxlength='1'></input>");

        for(var row = Bounds.top; row < Bounds.top + users.length; row++){
          for(var col = Bounds.left; col < Bounds.left + users[0].length; col++){
            if(users[row-Bounds.top][col-Bounds.left]){
              $(`.row:nth-child(${row-Bounds.top+1}) > .square:nth-child(${col-Bounds.left+1}) > input`).val(users[row-Bounds.top][col-Bounds.left]);
            }
          }
        }
      }, 1000);
    }, 1000);
  }, 1000);
}

//function: checkAnswer: void -> void
// - check the answers: if correct, show letter green, or, show letter red
function checkAnswer(){
  var users = gatherAnswer();

  $("#crossword").html(generateHTML());
  addBoardIndex();

  for(var row = Bounds.top; row < Bounds.top + users.length; row++){
    for(var col = Bounds.left; col < Bounds.left + users[0].length; col++){
      if(board[col-1][row-1]){
        if(users[row-Bounds.top][col-Bounds.left]){
          if(users[row-Bounds.top][col-Bounds.left].toUpperCase() === board[col-1][row-1].toUpperCase()){
            $(`.row:nth-child(${row-Bounds.top+1}) > .square:nth-child(${col-Bounds.left+1})`).addClass('correct');
          }
          else{
            $(`.row:nth-child(${row-Bounds.top+1}) > .square:nth-child(${col-Bounds.left+1})`).addClass('wrong');
          }
        }
        else{
          $(`.row:nth-child(${row-Bounds.top+1}) > .square:nth-child(${col-Bounds.left+1})`).addClass('wrong');
        }
      }
    }
  }
}

//==================================================
// Events

function Shuffle(){
  setBoard();
}

function Cheat(){
  cheatAnswer();
}

function Check(){
  checkAnswer();
}