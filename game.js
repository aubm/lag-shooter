var LATENCY = 1; // in ms

var INITIAL_SCORE = {
    totalShoots: 0,
    totalHits: 0
};

var GAME = {
    board: document.getElementById("game-board"),
    hits: document.getElementById("hits"),
    score: Object.assign({}, INITIAL_SCORE),
    generateNewTarget: function generateNewTarget() {
        var self = this;
        var target = document.createElement("div");
        
        var screenSize = self.getScreenSize();
        target.style.top = self.generateRandomNumber(1, screenSize.height) + "px";
        target.style.left = self.generateRandomNumber(1, screenSize.width) + "px";
        
        return target;
    },
    insertTargetIntoGameBoard: function insertTargetIntoGameBoard(target) {
        var self = this;
        self.board.appendChild(target);
    },
    scheduleTargetRemoval: function scheduleTargetRemoval(target, numberOfSeconds) {
        var self = this;
        window.setTimeout(function () {
            if (self.isATargetOfBoard(target)) { // target may already has been removed by a click
                self.removeTargetFromGameBoard(target);
            }
        }, numberOfSeconds * 1000);
    },
    removeTargetFromGameBoard: function removeTargetFromGameBoard(target) {
        var self = this;
        self.board.removeChild(target);
    },
    isATargetOfBoard: function isATargetOfBoard(element) {
        var self = this;
        return element.parentNode === self.board;
        
    },
    generateRandomNumber: function generateRandomNumber(min, max) {
        return Math.floor((Math.random() * max) + min);
    },
    getScreenSize: function getScreenSize() {
        // TODO: use board dimensions
        var body = document.body,
            html = document.documentElement;
        
        var height = Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);
        
        var width = Math.max(body.scrollWidth, body.offsetWidth,
            html.clientWidth, html.scrollWidth, html.offsetWidth);
        
        return {
            width: width,
            height: height
        };
    },
    newShoot: function (aTargetWasDestroyed) {
        var self = this;
        self.score.totalShoots += 1;
        if (aTargetWasDestroyed) {
            self.score.totalHits += 1;
        }
    },
    refreshHits: function refreshHits() {
        var self = this;
        self.hits.innerText = self.computeHitPercentage();
    },
    computeHitPercentage: function computeHitPercentage() {
        var self = this;
        if (self.score.totalShoots === 0) {
            return 0;
        }
        return Math.round((self.score.totalHits / self.score.totalShoots) * 100);
    },
    resetScore: function resetScore() {
        var self = this;
        self.score = Object.assign({}, INITIAL_SCORE);
    }
};

/////////// GAME /////////////

window.setInterval(function () {
    var target = GAME.generateNewTarget();
    GAME.insertTargetIntoGameBoard(target);
    
    GAME.scheduleTargetRemoval(target, 8)
}, 1400);

document.addEventListener("click", function (event) {
    window.setTimeout(function () {
        var hit = false;
        
        var element = document.elementFromPoint(event.clientX, event.clientY);
        if (GAME.isATargetOfBoard(element)) {
            GAME.removeTargetFromGameBoard(element);
            hit = true;
        }
        
        GAME.newShoot(hit);
        GAME.refreshHits();
    }, function () {
        return LATENCY;
    }());
});

document.getElementById("latency-selector").addEventListener("change", function (event) {
    var newLatency = parseInt(event.target.value);
    LATENCY = newLatency;
    GAME.resetScore();
    GAME.refreshHits();
});
