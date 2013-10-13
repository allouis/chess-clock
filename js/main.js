function _extend(){
    var obj = Array.prototype.splice.call(arguments, 0, 1)[0];
    for(var i = 0, l = arguments.length; i < l; i++) {
        for(var prop in arguments[i]){
            obj[prop] = arguments[i][prop];
        }
    }
    return obj;
}
function start(){
    var userHeight = window.innerHeight / 2;
    var timePadding = (userHeight - 35) / 2;
    console.log(userHeight);
    console.log(timePadding);
    var options = {
        height: userHeight,
        padding: timePadding,
        timeLeft: 600000,
        timeIncrement: 5000
    };
    window.Players = {
        one:new Player(_extend({name:"user-one"}, options)),
        two:new Player(_extend({name:"user-two"}, options))
    };
    document.addEventListener("mousedown", function(){
        console.log("mousedown");
        Players.one.toggle();
        Players.two.toggle();
    });
}

function Player(opts){
    this.el = document.getElementById(opts.name);
    this.timeEl = this.el.querySelector(".time");
    this.el.style.height = opts.height + "px";
    this.timeEl.style.padding = opts.padding + "px 0px";
    this.timeLeft = opts.timeLeft;
    this.timeIncrement = opts.timeIncrement;
    this.active = false;
}

Player.prototype = {

    update: function(){
        if(!this.active) return;
        setTimeout(this.update.bind(this), 1000);
        this.timeLeft -= 1000;
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
        var mins = Math.floor(seconds/60); 
        var finalSeconds = seconds - (mins*60);

        return mins + ":" + (finalSeconds < 10 ? "0"+finalSeconds : finalSeconds);
    }

};

