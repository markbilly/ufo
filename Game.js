function Game() {
    this.content = document.getElementById("content");
    this.bgCanvas = document.getElementById("cBackground");
    this.bgCanvasCtx = this.bgCanvas.getContext("2d");
    this.fgCanvas = document.getElementById("cForeground");
    this.fgCanvasCtx = this.fgCanvas.getContext("2d");
    this.scale = 1;
    this.width = 320;
    this.height = 180;
    this.left = 0;
    this.top = 0;
    this.score = 10;
    this.paused = false;
    this.pauseScreen = new Pause(this.fgCanvasCtx, this.width, this.height);
    this.gameOver = {
        over: false,
        ready: false,
        display: false,
        move: 0,
        ticks: 0,
        message: "",
        screen: new GameOver(this.fgCanvasCtx, this.width, this.height)
    };
    this.bgImage = new Image();
    this.ufo = new Sprite(121, 65, 80, 24, 0, "Content/ship.png");
    this.sprites =
    [
        new Sprite(250, 20, 40, 40, 0.002, "Content/moon.png"),
        new Sprite(-20, 65, 70, 12, 0.02, "Content/cloud.png"),
        new Sprite(100, 30, 70, 12, 0.02, "Content/cloud.png"),
        new Sprite(220, 50, 70, 12, 0.02, "Content/cloud.png"),
        new Sprite(-80, 130, 80, 43, 2, "Content/house.png"),
        new Sprite(0, 130, 80, 43, 2, "Content/house.png"),
        new Sprite(80, 130, 80, 43, 2, "Content/house.png"),
        new Sprite(160, 130, 80, 43, 2, "Content/house.png"),
        new Sprite(240, 130, 80, 43, 2, "Content/house.png"),
        new Sprite(320, 130, 80, 43, 2, "Content/house.png")
    ];
    this.abductee = new Sprite(this.ufo.x + 35, this.ufo.y + 75, 10, 10, 0.5, "Content/abductee.png");
    this.sedan = new Sprite(-120, 141, 60, 40, 2, "Content/sedan.png");
    this.fbiAlerted = false;
    this.fbiTargetX = 0;
    this.move = 0;
    this.beam = false;
    this.beamPower = 0;
    this.alertLevel = 0;
    this.availableAbductees = 0;
    this.debugMessage = "Right arrow to move. Hold X to abduct.";
    this.ticker = 0;
    this.alert = {
        message: "",
        x: 0,
        y: 0
    };
    this.currentHouse = {
        index: 0,
        residents: 0,
        opacity: 0,
        x: 0,
        y: 0
    };
    this.timer = {
        ms: 0, // ms
        s: 0, // secs
        m: 0, // mins
        string: "00:00.00" // mm:ss.ms
    };
}

Game.prototype.Load = function () {
    // Load background image
    this.bgImage.src = "Content/bg.png";

    // Load sprites
    for (var i = 0; i < this.sprites.length; i++) {
        this.sprites[i].Load();
    }
    
    // Load ufo
    this.ufo.Load();
    
    // Load abductee
    this.abductee.Load();

    // Load sedan
    this.sedan.Load();
};

Game.prototype.SetSize = function () {
    // Find scale factor based on window dimensions
    var scaleFactor = window.innerWidth / this.width;

    // Limit to nearest integer
    scaleFactor = Math.floor(scaleFactor);

    // Limit to a maximum of 3x and min of 1x
    if (scaleFactor < 1) scaleFactor = 1;
    if (scaleFactor > 3) scaleFactor = 3;

    // Set scale factor as game property
    this.scale = scaleFactor;
    
    // Find left and top of game location
    this.left = (window.innerWidth * 0.5) - ((this.width * this.scale) * 0.5);
    this.top = (window.innerHeight * 0.5) - ((this.height * this.scale) * 0.5);

    // Set width and height of canvases
    this.bgCanvas.width = this.width * this.scale;
    this.bgCanvas.height = this.height * this.scale;
    this.bgCanvas.style.left = this.left + "px";
    this.bgCanvas.style.top = this.top + "px";
    this.fgCanvas.width = this.width * this.scale;
    this.fgCanvas.height = this.height * this.scale;
    this.fgCanvas.style.left = this.left + "px";
    this.fgCanvas.style.top = this.top + "px";
};

Game.prototype.ProcessClick = function (clickX, clickY) {
    // Game over
    if (this.gameOver.over)
        clickX = -1; // Causes a return and stops input

    // Reset beam state
    this.beam = false;
    
    // Update move based on click location
    // Check for no click
    if (clickX == -1) {
        this.move = 0;
        return;
    }
    
    // Account for canvas size and location
    clickX -= this.left;
    clickY -= this.top;
    clickX = clickX / this.scale;
    clickY = clickY / this.scale;
    
    // Check for click on houses
    if (clickY > (3 / 4) * this.height)
        this.beam = true;
    else {
        // Check clicks for scrolling
        if (clickX > this.width / 2)
            this.move = -1;
        //else
        //    this.move = 1;
    }
};

Game.prototype.ProcessKeys = function (left, right, beam) {
    // Game over
    if (this.gameOver.over) {
        right = false;
        left = false; // Stops input
        beam = false;
    }

    this.move = 0;
    this.beam = false;
    //if (left)
    //    this.move = 1;
    if (right)
        this.move = -1;
    if (beam && !left && !right)
        this.beam = true;
};

Game.prototype.UpdateTimer = function () {
    // Define ticker and timer in this scope
    var ticker = this.ticker;
    var timer = this.timer;

    // Increment ticker
    this.ticker++;
    if (this.ticker > 1000)
        this.ticker = 0;

    // Update timer ms
    if (this.ticker % 6 == 0)
        this.timer.ms++;

    // Update timer seconds
    if (this.ticker % 60 == 0) {
        this.timer.s++;
        this.timer.ms = 0;
    }

    // Update timer minutes
    if (this.timer.s == 60) {
        this.timer.m++;
        this.timer.s = 0;
    }

    // Update timer string
    var msString = this.timer.ms;
    var sString = this.timer.s;
    if (sString < 10)
        sString = "0" + sString;
    var mString = this.timer.m;
    if (mString < 10)
        mString = "0" + mString;
    if (!this.gameOver.over)
        this.timer.string = mString + ":" + sString + "." + msString;
};

Game.prototype.UpdateSpritePositions = function () {
    for (var i = 0; i < this.sprites.length; i++) {
        // Update sprite position
        this.sprites[i].Move(this.move);

        // Correct for sprites leaving screen
        if (this.sprites[i].xf == this.width) {
            // new position
            this.sprites[i].xf = -this.sprites[i].width;
            // reset lights
            this.sprites[i].frame = 0;
        }
        if (this.sprites[i].xf < -this.sprites[i].width) {
            // new position
            this.sprites[i].xf = this.width - this.sprites[i].speed;
            // reset lights
            this.sprites[i].frame = 0;
        }
    }
    // Also need to move sedan
    if (this.sedan.x > -120) {
        // Update sedan position
        this.sedan.Move(this.move);
    }
    // If no energy then crash ship
    if (this.score == 0) {
        // Update x float position
        this.ufo.xf += -2 * this.gameOver.move;

        // Update x integer position
        this.ufo.x = Math.floor(this.ufo.xf);

        // Update y float position
        this.ufo.yf += 2;

        // Update y integer position
        this.ufo.y = Math.floor(this.ufo.yf);
    }
};

Game.prototype.UpdateBeamEffects = function () {
    // set correct frame
    if (this.beamPower > 0) {
        if (this.beamPower > 0 && this.beamPower < 30)
            this.ufo.frame = 1;
        else if (this.beamPower >= 30 && this.beamPower < 90)
            this.ufo.frame = 2;
        else if (this.beamPower >= 90 && this.beamPower < 120)
            this.ufo.frame = 3;
        else if (this.beamPower >= 120 && this.beamPower < 150)
            this.ufo.frame = 4;
        else if (this.beamPower >= 150 && this.beamPower < 180)
            this.ufo.frame = 5;
        else if (this.beamPower >= 180)
            this.ufo.frame = 6;
        else
            this.ufo.frame = 0;
    }
    // beam clipping
    if (this.beam && !this.moving) {
        // amount of beam
        if (this.ufo.clip[3] < 101) {
            this.ufo.clip[3] += 4;
            this.ufo.height += 4;
        }
        // increase beam power
        if (this.beamPower < 210)
            this.beamPower++;
    }
    else {
        // amount of beam
        if (this.ufo.clip[3] > 24) {
            // only retract beam if powered down
            // or if world is moving
            if (this.beamPower < 60 || this.move) {
                this.ufo.clip[3] -= 8;
                this.ufo.height -= 8;
            }
        } else {
            // beam frame
            this.ufo.frame = 0;
            this.ufo.clip[3] = 24;
            this.ufo.height = 24;
            if (this.move)
                this.beamPower = 0;
        }
        // reduce beam power
        if (this.beamPower > 0)
            this.beamPower--;
    }
    // No beaming if gameover
    if (this.gameOver.over) {
        this.ufo.frame = 0;
        this.ufo.clip = [0, 0, this.ufo.width, 24];
    }

    // Make sure image dimensions don't overshoot
    // So we can draw without crashes
    if (this.ufo.height > 101) this.ufo.height = 101;
    if (this.ufo.clip[3] > 101) this.ufo.clip[3] = 101;
};

Game.prototype.UpdateAbductee = function () {
    // Get which house ufo is over
    var currentHouse = this.currentHouse.index;
    for (var h = 5; h < this.sprites.length; h++) {
        // Check whether each house near ufo
        if (this.ufo.x >= this.sprites[h].x - (this.sprites[h].width * 0.3) &&
            this.ufo.x < this.sprites[h].x + (this.sprites[h].width * 0.4)) {
            // Set it as the current house
            this.currentHouse.index = h;
            break;
        }
    }

    // Generate a random number of residents for the house
    if (this.currentHouse.index != currentHouse) {
        var min = 1;
        var max = 6;
        this.currentHouse.residents = Math.floor(Math.random() * (max - min + 1) + min);
    }

    // only start abducting if
    // 1) over a house
    // 2) beam is on and power > 60
    if (this.beamPower >= 30 && this.currentHouse.index) {
        // current house windows illuminate
        this.sprites[this.currentHouse.index].frame = 1;
        // abductee is visible
        this.abductee.visible = true;
    }

    // move abductee
    if (this.beamPower > 20 && this.currentHouse.index) { // only if beaming and over a house
        if (this.abductee.y >= this.ufo.y + 15) // but only until abductee reaches ufo
            this.abductee.yf -= this.abductee.speed * (this.beamPower / 210);
    } else { // if ufo moving or low power then drop abductee
        if (this.abductee.y < this.ufo.y + 75) // but only drop so far
            this.abductee.yf += this.abductee.speed * 10;
    }
    // update integer position
    this.abductee.y = Math.floor(this.abductee.yf);

    // reset abductee if abducted / up score
    if (this.abductee.y < this.ufo.y + 15) {
        this.abductee.yf = this.ufo.y + 75; // if any abductee reaches the ufo then remove
        if (this.currentHouse.residents > 0) {
            // and increament score
            this.score++;
            // and decrement available abductees
            this.currentHouse.residents--;
        }
    }
    if (this.abductee.y >= this.ufo.y + 75) // invisible if fallen
        this.abductee.visible = false;
    if (this.currentHouse.residents < 1) // invisible if no abductees left
        this.abductee.visible = false;

    // Set house label opacity
    var dist = (Math.abs((this.ufo.x + 50) - (this.sprites[this.currentHouse.index].x + 60)));
    var op = 1 - (dist / 45);
    if (op > 1) op = 1;
    this.currentHouse.opacity = op;
    this.debugMessage = dist.toString();

    // Position house label right
    this.currentHouse.x = this.sprites[this.currentHouse.index].x + 10;
    this.currentHouse.y = this.sprites[this.currentHouse.index].y + 45;
    this.currentHouse.x += this.centred(this.currentHouse.residents.toString(), 80);
};

Game.prototype.UpdateAlert = function () {
    // return all house lights to normal
    if (!this.beam && this.beamPower < 60) {
        for (var h2 = 5; h2 < this.sprites.length; h2++)
            if (this.sprites[h2].frame < 4) // but not if on full alert (frame 4)
                this.sprites[h2].frame = 0;
        this.alertLevel = 0;
        this.alert.message = "";
    }
    // put neighbour on alert
    // only if your over a house and beaming and ufo not moving
    if (this.currentHouse.index && !this.move && this.beamPower > 20) {
        // find proximity to house (little offset to account for image wonkiness)
        var proximity = this.ufo.x - this.sprites[this.currentHouse.index].x - 8;
        // calculate probability of moving to next alert level
        var alertLikelyhood = (this.beamPower / (210 * 0.5)) * ((this.alertLevel + 1) / (3 + 1)) * (Math.abs(proximity) / 12);
        alertLikelyhood = alertLikelyhood * 10;
        if (alertLikelyhood > 1)
            alertLikelyhood = 1;
        if (alertLikelyhood < 0.25)
            alertLikelyhood = 0.25;

        // DO THIS CHECK ONLY EVERY 2 SECONDS
        // if rand < likelyhood (which has max of 1) then increase alert level
        if (this.ticker % 120 == 0 && this.beam) { // only increase if beam on
            if (this.alertLevel < 3) { // 3 is max alert
                if (Math.random() < alertLikelyhood)
                    this.alertLevel++;
            } else { // after three we just display a new message every second
                this.alertLevel++;
            }
        }
        // END OF CHECK

        if (this.alertLevel > 0) {
            if (proximity >= 0) {
                // work out what index of right neighbour is
                var rightIndex = this.currentHouse.index + 1;
                if (this.currentHouse.index == this.sprites.length - 1)
                    rightIndex = 5; // index of first house
                if (this.alertLevel < 4) // first 4 levels need different frames
                    this.sprites[rightIndex].frame = this.alertLevel + 1; // alert right-hand neighbour
                // set alert message x and y
                this.alert.x = this.sprites[rightIndex].x;
                this.alert.y = this.sprites[rightIndex].y;
            } else {
                // work out what index of right neighbour is
                var leftIndex = this.currentHouse.index - 1;
                if (this.currentHouse.index == 5) // index of first house
                    leftIndex = this.sprites.length - 1;
                if (this.alertLevel < 4) // first 4 levels need different frames 
                    this.sprites[leftIndex].frame = this.alertLevel + 1; // alert left-hand neighbour
                // set alert message x and y
                this.alert.x = this.sprites[leftIndex].x;
                this.alert.y = this.sprites[leftIndex].y;
            }
            // set alert message string
            switch (this.alertLevel) {
                case 1:
                    this.alert.message = "?"; break;
                case 2:
                    this.alert.message = "?!"; break;
                case 3:
                    this.alert.message = "*dial tone*"; break;
                default:
                    this.alert.message = "";
            }
            this.alert.y -= 3;
            this.alert.x += 10;
            this.alert.x += this.centred(this.alert.message, 80);
        }
    }
};

Game.prototype.UpdateFBI = function () {
    // Basically if alert level reaches 3 then call FBI
    if (!this.fbiAlerted && this.alertLevel >= 3) {
        this.fbiAlerted = true;
        this.fbiTargetX = this.sprites[this.currentHouse.index].x;
    }

    // If the FBI have been alerted then move the sedan
    if (this.fbiAlerted && !this.gameOver.over) {
        // Update float position
        this.sedan.xf += this.sedan.speed * 1.5;
        // Update integer position
        this.sedan.x = Math.floor(this.sedan.xf);
    }

    // Sedan stops if it reaches the house
    if (this.sedan.x > this.fbiTargetX) {
        // Stop
        this.fbiAlerted = false;
        // Game over if FBI are too close
        // TODO: FBI park up and get out the car before
        //       this check is done. Distance can be changed
        //       to be when FBI are off screen, then.
        // i.e. Player has the time it takes for FBI to arrive,
        // park up and get out the car to be far enough away that
        // the house (and therefore FBI) are offscreen. If they
        // don't make it then game over. So will need another state
        // like .fbiParkedup and only do the distance/game over check
        // once we are in this state.
        if (this.ufo.x - this.sedan.x < this.ufo.width) {
            this.gameOver.ticks = this.ticker;
            this.alert.message = "";
            this.gameOver.over = true;
            this.gameOver.message = "You were spotted by the FBI";
        }
    }

    // Un-alerted if sedan goes off-screen
    if (this.fbiAlerted && this.sedan.x <= -60)
        this.fbiAlerted = false;

    // If game over then end game
    if (this.gameOver.over)
        this.fbiAlerted = false;

    // Move the target x
    this.fbiTargetX += this.move * this.sedan.speed;
};

Game.prototype.UpdateEnergyLevel = function () {
    // Decrement score (energy) every 3 secs
    if (!this.gameOver.over && this.ticker % (3 * 60) == 0)
        this.score--;

    // End game if score is zero
    if (this.score == 0 && !this.gameOver.over) {
        this.gameOver.move = this.move;
        this.gameOver.ticks = this.ticker;
        this.alert.message = "";
        this.gameOver.over = true;
        this.gameOver.message = "You crashed. The whole town spotted you";
    }

    // Wait a few seconds to display the game over screen
    if (this.gameOver.over && this.ticker - this.gameOver.ticks == 60 * 2)
        this.gameOver.ready = true;
};

Game.prototype.Update = function () {
    // Check for paused
    if (this.paused)
        return;

    // Timer stuff
    this.UpdateTimer();

    // Move sprites
    this.UpdateSpritePositions();

    // UFO beam
    this.UpdateBeamEffects();

    // Abductees
    this.UpdateAbductee();

    // Alert level
    this.UpdateAlert();

    // FBI
    this.UpdateFBI();

    // Energy
    this.UpdateEnergyLevel();
};

Game.prototype.Draw = function () {
    // Text setup
    this.bgCanvasCtx.font = "" + 8 * this.scale + "px pixel";
    this.bgCanvasCtx.fillStyle = "white";

    // Draw background
    this.bgCanvasCtx.drawImage(this.bgImage, 0, 0, this.width * this.scale, this.height * this.scale);

    // Draw sprites - clouds, etc
    for (var i = 0; i < 4; i++)
        this.sprites[i].Draw(this.bgCanvasCtx, this.scale);

    // Draw ufo
    this.ufo.Draw(this.bgCanvasCtx, this.scale);

    // Draw abductee
    this.abductee.Draw(this.bgCanvasCtx, this.scale);
    
    // Draw sprites - houses
    for (var i = 4; i < this.sprites.length; i++)
        this.sprites[i].Draw(this.bgCanvasCtx, this.scale);
    
    // Draw sedan
    this.sedan.Draw(this.bgCanvasCtx, this.scale);

    // Draw alert message
    this.bgCanvasCtx.fillText
    (
        this.alert.message,
        this.alert.x * this.scale,
        this.alert.y * this.scale
    );

    // Draw house label
    this.bgCanvasCtx.globalAlpha = this.currentHouse.opacity;
    if (this.currentHouse.residents > 0) {
        this.bgCanvasCtx.fillText
        (
            this.currentHouse.residents,
            this.currentHouse.x * this.scale,
            this.currentHouse.y * this.scale
        );
    }
    this.bgCanvasCtx.globalAlpha = 1;
    
    // Draw energy
    this.bgCanvasCtx.fillText
    (
        "Energy:" + this.score + "",
        2 * this.scale,
        10 * this.scale
    );

    // Draw timer
    this.bgCanvasCtx.fillText
    (
        this.timer.string,
        260 * this.scale,
        10 * this.scale
    );

    // FOREGROUND STUFF

    // Pause screen
    this.pauseScreen.Clear(this.scale);
    if (this.paused)
        this.pauseScreen.Draw(this.scale);

    // GameOver screen
    if (this.gameOver.ready)
        this.gameOver.screen.Draw(this.gameOver.message, this.scale, this.timer.string);

    var message = document.getElementById("Message");
    message.innerHTML = this.debugMessage;
};

//////////////////
//   Helpers    //
//////////////////

// Returns x value for centred string
Game.prototype.centred = function (string, width) {
    var splitString = string.split("");
    var length = splitString.length;
    return (width - (length * 8)) / 2;
};