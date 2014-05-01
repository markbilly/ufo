var clickX = -1;
var clickY = 0;
var touch = false;
var left = false;
var right = false;
var beam = false;
var paused = false;

window.onload = function () {
    // Put up the loading message
    var messageDiv = document.getElementById("Message");
    messageDiv.innerHTML = "Loading...";

    // Create an instance of the game
    var game = new Game();

    // Load content
    game.Load();

    window.setTimeout(function () {
        // Remove loading message
        messageDiv.innerHTML = "Loaded";

        // Set the size of the game
        game.SetSize();

        // World stuff
        Update(game);
        Draw(game);
    }, 1000);
};

////////////////
// Game loops //
////////////////

function Update(game) {
    // Call loop function
    loop();

    function loop() {
        // Process clicks
        if (touch)
            game.ProcessClick(clickX, clickY);
        else
            game.ProcessKeys(left, right, beam);

        // Update the game
        game.paused = paused;
        game.Update();

        // Callback itself to loop
        requestAnimationFrame(loop);
    }
}

function Draw(game) {
    // Call loop function
    loop();

    function loop() {
        // Draw the game
        game.Draw();

        // Callback itself to loop
        requestAnimationFrame(loop);
    }
}

////////////////
//   Input    //
////////////////
// Work out the event name
if ("ontouchstart" in document)
    SetupTouchEvents();
else
    SetupKeyboardEvents();

function SetupTouchEvents() {
    touch = true;
    // Do events
    document.addEventListener("touchstart", function (e) {
        clickX = e.changedTouches[0].pageX;
        clickY = e.changedTouches[0].pageY;
    }, true);

    document.addEventListener("touchend", function () {
        clickX = -1;
    }, true);
}

function SetupKeyboardEvents() {
    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 37) // left key
            left = true;
        if (e.keyCode == 39) // right key
            right = true;
        if (e.keyCode == 88) // x key
            beam = true;
        if (e.keyCode == 80) // p key
            paused = !paused;
    }, true);

    document.addEventListener("keyup", function (e) {
        if (e.keyCode == 37)
            left = false;
        if (e.keyCode == 39)
            right = false;
        if (e.keyCode == 88)
            beam = false;
    }, true);
}