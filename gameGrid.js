/*jslint plusplus: true */

var picture = ["pic00.jpg", "pic01.jpg", "pic02.jpg", "pic03.jpg", "pic04.jpg", "pic05.jpg", "pic06.jpg", "pic07.jpg", "pic08.jpg", "pic09.jpg", "pic10.jpg", "pic11.jpg", "pic12.jpg", "pic13.jpg", "pic14.jpg", "pic15.jpg"];

var backFace = "images/back_face.jpg";
var themePath = ["images/cards/", "images/landscapes/", "images/animals/"];
var game;
var selectedTheme = 0;



var numOfCardClicks = 0,
    theme,
    cardOne,
    cardTwo,
    cellOne;

function getClass(row, col) {
    'use strict';
    var cellClass;
    if (row % 2 === 0) {
        if (col % 2 === 0) {
            cellClass = "class='cellBlack'";
        } else {
            cellClass = "class='cellWhite'";
        }

    } else {
        if (col % 2 === 0) {
            cellClass = "class='cellWhite'";
        } else {
            cellClass = "class='cellBlack'";
        }
    }
    return cellClass;
}

function generateGrid(rows, columns, elementName) {
    'use strict';
    var i, j, html, img, cellClass, tempData, grid, pos, card;
    tempData = "card";
    grid = document.getElementById(elementName);

    html = "<table id='grid-table'>";
    for (i = 0; i < rows; i++) {
        html += "<tr>";
        //inner loop creates each table data cell <columns>
        for (j = 0; j < columns; j++) {
            cellClass = getClass(i, j);
            card = game.getCardAtPos(i, j);
            if (card.state === 0) {
                html += "<td id='" + i + j + "' " + cellClass + "><img src='" + backFace + "'></td>";
            } else {
                html += "<td id='" + i + j + "' " + cellClass + "><img src='" + themePath[selectedTheme] + picture[card.id] + "'></td>";
            }

        }
        html += "</tr> ";
    }
    html += "</table>";
    elementName.innerHTML = html;
    //alert("initial grid complete");
}

function updateScoreBoard() {
    'use strict';
    var score, scoreHtml, levelHtml, timeHtml, displayTime, time;
    scoreHtml = document.getElementById("score");
    levelHtml = document.getElementById("level");
    timeHtml = document.getElementById("time");

    scoreHtml.innerHTML = game.score;
    levelHtml.innerHTML = game.level;


    //alert("Stats board has been created");
}

function checkStateOfGame() {
    'use strict';
    var rows, columns, gridElement, themeElement;


    if (game.allPairsMatched()) {
        alert("Level completed!");
        if (!game.isGameOver()) {
            game.nextLevel();
            rows = game.getLevelRow();
            columns = game.getLevelCol();
            game.setUp();
            gridElement = document.getElementById("grid-container");
            themeElement = document.getElementById("theme");
            generateGrid(rows, columns, gridElement);
            themeElement.addEventListener('change', selectTheme, false);
            
        } else {
            alert("You Finished the Game!");
            game.resetGame();
        }

    }
}

function showCellCoordinates(row, col) {
    'use strict';
    var newDiv, oldDiv, div, html, id;
    div = document.getElementById("grid-container");
    newDiv = document.getElementById("cellPos");
    if (!newDiv) {
        newDiv = document.createElement("DIV");
        newDiv.setAttribute("id", "cellPos");
    }
    html = "ROW: " + row + "  COLUMN: " + col;
    newDiv.innerHTML = html;
    div.appendChild(newDiv);
    //alert("showCellCoordinates was entered.");
    return newDiv;
}

function unFlipCards(a, b) {
    'use strict';
    a.innerHTML = "<img src='" + backFace + "'>";
    b.innerHTML = "<img src='" + backFace + "'>";
    numOfCardClicks = 0; //return cell;
}

function showCell(event) {
    'use strict';
    var cell, cellRow, cellCol, table, currCard, id, cellTwo;
    //cell = this.target;
    cellCol = this.cellIndex;
    cellRow = this.parentNode.rowIndex;

    table = document.getElementById("grid-table");
    cell = table.rows[cellRow].cells[cellCol];

    currCard = game.getCardAtPos(cellRow, cellCol);

    if (!game.isCardFlipped(currCard) && (numOfCardClicks < 2 && numOfCardClicks >= 0)) {
        numOfCardClicks++;
        debugDiv(numOfCardClicks);
        cell.innerHTML = "<img src='" + themePath[selectedTheme] + picture[currCard.id] + "'>";
        if (numOfCardClicks === 1) {
            cellOne = cell;
            cardOne = game.getCardAtPos(cellRow, cellCol);
            game.flipCard(cardOne);
        } else {
            if (numOfCardClicks === 2) {

                cellTwo = cell;
                cardTwo = game.getCardAtPos(cellRow, cellCol);
                game.flipCard(cardTwo);
                if (game.isMatch(cardOne, cardTwo)) {
                    game.flipCard(cardOne);
                    game.flipCard(cardTwo);
                    checkStateOfGame();
                    updateScoreBoard();
                    numOfCardClicks = 0;
                } else {
                    game.unflipCard(cardOne);
                    game.unflipCard(cardTwo);
                    setTimeout(unFlipCards, 500, cellOne, cellTwo);
                }

            }
        }

    }
    showCellCoordinates(cellRow, cellCol);
    //setCardInPlay(cell);
}

function setCardInPlay(cell) {
    'use strict';
    var row, col, picPos, currentCard, cellTwo;
    row = cell.parentNode.rowIndex;
    col = cell.cellIndex;
    currentCard = game.getCardAtPos(row, col);
    if (!game.isCardFlipped(currentCard)) {

        if (numOfCardClicks === 1) {
            cellOne = cell;
            cardOne = game.getCardAtPos(row, col);
            cardOne.state = 1;
        } else {
            if (numOfCardClicks === 2) {

                cellTwo = cell;
                cardTwo = game.getCardAtPos(row, col);
                cardTwo.state = 1;
                if (game.isMatch(cardOne, cardTwo)) {
                    game.flipCard(cardOne);
                    game.flipCard(cardTwo);
                } else {
                    game.unflipCard(cardOne);
                    game.unflipCard(cardTwo);
                    setTimeout(unFlipCards, 500);
                }

            }
        }
        updateScoreBoard();
    }

}

function setCardClickEvents() {
    'use strict';
    var row, col, rowCount, columnCount, cell, table, cellId;
    table = document.getElementById("grid-table");
    rowCount = table.rows.length;
    columnCount = table.rows[0].cells.length;

    if (table) {
        for (row = 0; row < rowCount; row++) {
            for (col = 0; col < columnCount; col++) {
                cellId = row.toString() + col.toString();
                cell = document.getElementById(cellId);
                if (numOfCardClicks < 2) {
                    cell.addEventListener('click', showCell, false);
                } else {
                    cell.removeEventListener('click', showCell, false);
                }

            }
        }
    }
    return cell;
}

/*function placeGamePieces() {
    'use strict';
    var i, j, grid, cell, isflipped, card, cols, rows, picPos;
    grid = document.getElementById("grid-table");
    rows = grid.rows.length;
    cols = grid.rows[0].cells.length;

    for (i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {
            isflipped = game.isCardFlipped(i, j);
            card = game.getCardAtPos(i, j);
            picPos = card.id;
            if (isflipped) {
                cell = document.getElementById(ij);
                cell.innerHTML = "<img src='" + theme[0] + picture[picPos] + "'>";
            }
        }
    }
    //alert("Images have been placed");
}*/

//a mock board function to show a state of the game
function mockupBoardState() {
    'use strict';
    //test area delete when done
    var randRow, randCol, len, i, j, card, rows, cols;
    len = game.getNumberOfCards();
    rows = game.getLevelRow();
    cols = game.getLevelCol();
    for (i = 0; i < rows; i++) {
        randCol = Math.floor(Math.random() * cols);
        randRow = Math.floor(Math.random() * rows);
        card = game.getCardAtPos(randRow, randCol);
        card.state = "flipped";
        game.findotherCard(card.id);
    }
    //alert("mockup board compete");
}

function screenAnimation() {
    'use strict';
    var topPos, leftPos, imgWidth, imgHeight, bodyHeight, bodyWidth, imgElement, leftStopPoint, downStopPoint, body, yes, picPos, themeType;
    picPos = 0;
    themeType = 1;
    topPos = -130;
    leftPos = 0;
    imgWidth = 90;
    imgHeight = 125;
    bodyHeight = 800;
    bodyWidth = 1200;

    body = document.getElementById("body");
    imgElement = document.createElement("IMG");
    imgElement.setAttribute("id", "animateCard");
    imgElement.setAttribute("src", "images/landscapes/pic07.jpg");
    body.appendChild(imgElement);


    leftStopPoint = bodyWidth - imgWidth;
    downStopPoint = bodyHeight - imgHeight;

    yes = 0;
    setTimeout(executeMoves, 1000);

    function moveRight() {
        leftPos += imgWidth / 2;
        imgElement.style.left = leftPos + "px";
    }

    function changePicture() {
        imgElement.setAttribute("src", themePath[themeType] + picture[picPos++]);
        if (picPos === 15) {
            picPos = 0;
        }
    }

    function executeMoves() {

        if (leftPos <= leftStopPoint) {
            if (topPos <= downStopPoint && yes === 0) {
                topPos += 4;
                imgElement.style.top = topPos + "px";
                if (topPos >= downStopPoint) {
                    yes = 1;
                    moveRight();
                    changePicture();
                }
                setTimeout(executeMoves, 0);
            } else {
                if (topPos >= -160 && yes === 1) {
                    topPos -= 4;
                    imgElement.style.top = topPos + "px";
                    if (topPos <= -160) {
                        yes = 0;
                        moveRight();
                        changePicture();
                    }
                    setTimeout(executeMoves, 0);
                }
            }
        } else {
            body.removeChild(imgElement);
        }
    } //end executeMoves



} //end screanAnimation

function selectTheme(event) {
    'use strict';
    var select, index, option, message;
    select = event.target;
    index = select.selectedIndex;

    switch (index) {
    case 1:
        selectedTheme = 0;
        break;
    case 2:
        selectedTheme = 1;
        break;
    case 3:
        selectedTheme = 2;
        break;
    default:
        break;
    }
    if (index !== 0) {
        message = "Selectd: " + select.value;
        debugDiv(message);
    } else {
        debugDiv("");
    }


}

function outputUserName(event) {
    'use strict';
    var nameDiv = document.getElementById("name");
    var textbox = event.target;
    var text = textbox.value;
    var message = "Hello! " + text;

    nameDiv.innerHTML = message;
}

function debugDiv(update) {
    'use strict';
    var debug = document.getElementById("debug");
    debug.innerHTML = update;
}

function startGame() {
    'use strict';
    debugDiv("Start button pressed!");
    
    theme.removeEventListener('change', selectTheme, false);
    if (numOfCardClicks < 2) {
        setCardClickEvents();
    }

    //set event when score changes. checks if all cards have been matched

}

function resetGame() {
    'use strict';
    debugDiv("Reset button pressed!");
    var result = confirm("Reset pressed. Are you sure?");
    if (result) {
        game.resetGame();
        init();
    }
}

/*function getAjaxRequestObject() {
    'use strict';
    var ajax2 = null;
    if (window.XMLHttpRequest) {
        ajax2 = new XMLHttpRequest();
    } else {
        ajax2 = new ActiveXObject('MSXML2.XMLHTTP.3.0');
    }
    return ajax2;
}*/
/*function modelToJson() {
    'use strict';
    var json = JSON.stringify(game);
    var divOut = document.getElementById("jsonOutput");
    divOut.innerHTML = json;
    //return json;
}*/
/*function jsonToModel() {
    'use strict';
    var json, html, jsonStr, jsonObject, row, col, element;
    json = getAjaxRequestObject();
    html = "";
    json.open('GET', 'json_game_data.json', false);
    json.send(null);
    jsonStr = json.responseText;
    jsonObject = JSON.parse(jsonStr);
    
    game.level = jsonObject.level;
    game.score = jsonObject.score;
    game.matchedPairs = jsonObject.matchedPairs;
    game.maxLevel = jsonObject.maxLevel;
    game.rows = jsonObject.rows;
    game.timer = jsonObject.timer;
    game.columns = jsonObject.columns;
    game.board = jsonObject.board;
    game.deck = jsonObject.deck;
    
    element = document.getElementById("grid-container");
    row = jsonObject.rows;
    col = jsonObject.columns;
    generateGrid(row, col, element);
    updateScoreBoard();
    startGame();
    modelToJson();
    return game;
}*/

function setup() {
    'use strict';

}

function init() {
    'use strict';
    var rows, cols, element, table, start, reset, gridElement,
        textbox, nameDiv, userInfo, removeLS;

    gridElement = document.getElementById("grid-container");
    start = document.getElementById("start");
    reset = document.getElementById("reset");
    theme = document.getElementById("theme");
    textbox = document.getElementById("input");
    nameDiv = document.getElementById("name");
    removeLS = document.getElementById("removeLS_btn");
    //var save = document.getElementById("save-btn");
    //var load = document.getElementById("load-btn");
    //retreive local storage data and display it
    userInfo = window.localStorage.getItem("cs2550timestamp");
    if (userInfo !== 'undefined') {
        nameDiv.innerHTML = userInfo;
    }

    textbox.value = "";
    theme.selectedIndex = selectedTheme;

    game = new Game();
    //game.level = 5;
    rows = game.getLevelRow();
    cols = game.getLevelCol();
    game.setUp();
    generateGrid(rows, cols, gridElement);
    table = document.getElementById("grid-table");
    updateScoreBoard();
    //screenAnimation();

    //remove local storage when button is pressed
    removeLS.addEventListener('click', function () {
        window.localStorage.clear();
        nameDiv.innerHTML = window.localStorage.getItem("cs2550timestamp");
    }, false);

    textbox.addEventListener('input', outputUserName, false);
    theme.addEventListener('change', selectTheme, false);
    start.addEventListener('click', startGame, false);
    reset.addEventListener('click', resetGame, false);
    //save.addEventListener('click', modelToJson, false);
    //load.addEventListener('click', jsonToModel, false);
}

window.addEventListener('load', init, false);