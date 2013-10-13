function _extend(){
    var obj = Array.prototype.splice.call(arguments, 0, 1)[0];
    for(var i = 0, l = arguments.length; i < l; i++) {
        for(var prop in arguments[i]){
            obj[prop] = arguments[i][prop];
        }
    }
    return obj;
}

function App(){
    this.optionsEl = document.getElementById("options");
    this.showOptions();
    var userHeight = window.innerHeight / 2;
    var timePadding = (userHeight - 35) / 2;
    this.options = {
        options: {
            height: userHeight,
            padding: timePadding,
        }
    };
}

App.prototype = {
    
    showOptions: function(){
        this.optionsEl.style.display = "block";
        var saveBtn = this.optionsEl.querySelector("#save");    
        saveBtn.addEventListener("click", function(){
            this.updateOptions();
            this.optionsEl.style.display = "none";
            this.newGame();
        }.bind(this));
    },

    updateOptions: function(){
        this.options.playerOneName = this.optionsEl.querySelector(".player-one-name").value;
        this.options.playerTwoName = this.optionsEl.querySelector(".player-two-name").value;
        this.options.options.timeLeft = parseInt(this.optionsEl.querySelector(".time-limit").value) * 60000
        this.options.options.timeIncrement = parseInt(this.optionsEl.querySelector(".time-increment").value) * 1000 || 0;
    },

    newGame: function(){
        this.game = new Game(_extend({app:this},this.options));
    },
    
    restart: function(){
        delete this.game;
        this.showOptions();
    }

};

function Game(opts){
    this.options = opts.options;
    this.players = [];
    this.players[0] = new Player(_extend({id:"player-one"}, this.options, {name:opts.playerOneName, game: this}));
    this.players[1] = new Player(_extend({id:"player-two"}, this.options, {name:opts.playerTwoName, game: this}));
    this.startButtons = [];
    this.startButtons[0] = document.getElementById("player-one-start");
    this.startButtons[1] = document.getElementById("player-two-start");
    this.showStartButtons();
    this.app = opts.app;
}

Game.prototype = {
    
    showStartButtons: function(){
        this.startButtons[0].addEventListener("click", this.start.bind(this));
        this.startButtons[1].addEventListener("click", this.start.bind(this));
        this.startButtons[0].style.display = this.startButtons[1].style.display = "block";
    },

    start: function(event){
        event.preventDefault();
        console.dir(event)
        console.log(event.srcElement.nextSibling.nextSibling);
        var i = !!event.srcElement.nextSibling.nextSibling ? 0 : 1;
        this.players[i].start();
        document.addEventListener("touchstart", function(){
            this.players[0].toggle();
            this.players[1].toggle();
        }.bind(this));
        this.startButtons[0].style.display = this.startButtons[1].style.display = "none";
    },

    lost: function(loser){
        
        this.players[0].stop();
        this.players[1].stop(); 
        var i = this.players.indexOf(loser); 
        var name = this.players[i^1].name;
        alert(name + " won the game!");
        this.app.restart();
    }
};

function Player(opts){
    this.el = document.getElementById(opts.id);
    this.game = opts.game;
    this.name = opts.name;
    this.timeEl = this.el.querySelector(".time");
    this.el.style.height = opts.height + "px";
    this.timeEl.style.padding = opts.padding + "px 0px";
    this.timeLeft = opts.timeLeft;
    this.timeIncrement = opts.timeIncrement;
    this.active = false;
    this.render();
}

Player.prototype = {

    update: function(){
        if(!this.active) return;
        setTimeout(this.update.bind(this), 1000);
        this.timeLeft -= 1000;
        if(this.timeLeft < 0) return this.game.lost(this);
        this.render();
    },

    start: function(){
        this.active = true;   
        this.update();
    },

    stop: function(){
        this.active = false;
        this.timeLeft += this.timeIncrement;
        this.render();
    },

    toggle: function(){
        if(this.active) return this.stop();
        this.start();
    },

    render: function(){
        this.timeEl.innerHTML = this.parseTime(this.timeLeft);
    },

    parseTime: function(milliseconds){
        var seconds = Math.floor(milliseconds / 1000);
        var mins = Math.max(0, Math.floor(seconds/60)); 
        var finalSeconds = Math.max(0, seconds - (mins*60));

        return mins + ":" + (finalSeconds < 10 ? "0"+finalSeconds : finalSeconds);
    }

};

