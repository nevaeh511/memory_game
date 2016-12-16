/*jslint plusplus: true */

//--------------Game objects--------------------

function Card(someId) {
    'use strict';
    this.id = someId;
    this.state = 0;
    this.location = [];
}

function Deck(numCards) {
    'use strict';
    this.deckArray = [];
    this.deckSize = numCards;
    this.shuffleDeck = function () {
        var first, second, i, random;

        for (i = 0; i < this.deckSize; i++) {
            random = Math.floor(Math.random() * this.deckSize);
            first = this.deckArray[i];
            second = this.deckArray[random];
            this.deckArray[random] = first;
            this.deckArray[i] = second;
        }
    };

    this.setDeck = function () {
        var i, card1, card2;
        for (i = 0; i < this.deckSize / 2; i++) {
            card1 = new Card(i);
            card2 = new Card(i);
            this.deckArray.push(card1);
            this.deckArray.push(card2);
        }
    };
    this.getDeck = function () {
        if (this.deckArray.length > 0) {
            return this.deckArray;
        }
    };
}


//function Timer(theLevel) {
//    'use strict';
//    this.time;
//    this.startTime = function () {
//        this.time = new Date
//    };
//    this.resetTime = function () {
//
//    };
//    this.setTime = function () {
//        
//    };
//    this.getTime = function () {
//
//    };
//}


var levelData = [[4, 2, 2, 5], [6, 2, 3, 10], [8, 2, 4, 12], [12, 3, 4, 20], [16, 4, 4, 30], [18, 3, 6, 40], [20, 4, 5, 60], [24, 4, 6, 120], [28, 4, 7, 140], [32, 4, 8, 300]];


function Game() {
    'use strict';

    this.level = 1;
    this.score = 0;
    this.matchedPairs = 0;
    this.rows = 0;
    this.columns = 0;
    this.maxLevel = 10;
    this.deck = null;
    this.timer = null;
    this.board = null;

    this.getLevelStartTime = function () {
        return levelData[this.level - 1][3];
    };

    this.createDeck = function () {
        var cards = levelData[this.level - 1][0];
        this.deck = new Deck(cards);
        this.deck.setDeck();
        this.deck.shuffleDeck();
    };

    this.createBoard = function () {
        var i, j, index, card, rand, len;
        len = this.deck.length - 1;
        this.rows = levelData[this.level - 1][1];
        this.columns = levelData[this.level - 1][2];
        index = 0;
        this.board = [];
        for (i = 0; i < this.rows; i++) {
            this.board.push([]);
            for (j = 0; j < this.columns; j++) {
                card = this.deck.deckArray[index];
                //sets each cards location where it's at on the board
                card.location.push(i);
                card.location.push(j);
                this.board[i].push(card);
                index++;
            }

        }

    };
    this.setUp = function () {
        this.createDeck();
        this.createBoard();
    };
    this.flipCard = function (card) {
        if (card) {
            card.state = 1;
        }
    };

    this.unflipCard = function (card) {
        if (card) {
            card.state = 0;
        }
    };

    this.getCardAtPos = function (row, col) {
        var card = this.board[row][col];
        if (card) {
            return card;
        }
        return null;
    };

    this.getLevelRow = function () {
        return levelData[this.level - 1][1];
    };
    this.getLevelCol = function () {
        return levelData[this.level - 1][2];
    };
    this.getNumberOfCards = function () {
        return levelData[this.level - 1][0];
    };

    this.allPairsMatched = function () {
        if (this.matchedPairs === this.deck.getDeck().length / 2) {
            return true;
        }
        return false;
    };
    this.getScore = function () {
        return this.score;
    };
    this.nextLevel = function () {
        if (this.level <= this.maxLevel) {
            this.level++;
            this.matchedPairs = 0;
        }
    };
    this.isGameOver = function () {
        if ((this.level === this.maxLevel) && this.allPairsMatched()) {
            return true;
        }
        return false;
    };
    this.resetLevel = function () {
        this.matchedPairs = 0;
        this.createBoard();
    };
    this.resetGame = function () {
        this.level = 1;
        this.score = 0;
        this.matchedPairs = 0;
        this.deck = null;
        this.timer = null;
        this.board = [];
    };

    this.isMatch = function (cardOne, cardTwo) {
        if (cardOne && cardTwo) {
            if (cardOne.id === cardTwo.id) {
                this.score++;
                this.matchedPairs++;
                return true;
            }
        }
        return false;
    };

    this.isCardFlipped = function (card) {
        if (card.state === 1) {
            return true;
        }
        return false;
    };
    this.chooseFirstCard = function (row, col) {
        var firstCard = this.board[row][col];
        return firstCard;
    };
    this.chooseSecondCard = function (row, col) {
        var secondCard = this.board[row][col];
        return secondCard;
    };

    this.findotherCard = function (id) {
        var i, j, card;
        for (i = 0; i < this.rows; i++) {
            for (j = 0; j < this.columns; j++) {
                card = this.board[i][j];
                if (id === card.id && card.state === "back") {
                    card.state = "flipped";
                    this.score++;
                    break;
                }
            }
        }
    };

}