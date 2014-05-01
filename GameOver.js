function GameOver(ctx, width, height) {
    // Set the canvas
    this.ctx = ctx;
    this.width = width;
    this.height = height;
}

GameOver.prototype.Draw = function (string, scale, score) {
    // Clear
    this.Clear(scale);

    // Calculate where text should start
    var leftTxt = (this.width - (string.split("").length * 8)) / 2;

    // Draw black background
    this.ctx.globalAlpha = 0.8;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width * scale, this.height * scale);

    // Draw text
    this.ctx.globalAlpha = 1.0;
    this.ctx.font = "" + 8 * scale + "px pixel";
    this.ctx.fillStyle = "white";
    this.ctx.fillText
    (
        string,
        leftTxt * scale,
        75 * scale
    );
    this.ctx.fillText
    (
        "You survived on Earth for " + score,
        centred("You survived on Earth for " + score, this.width) * scale,
        107 * scale
    );

    // Returns x value for centred string
    function centred(string, width) {
        var splitString = string.split("");
        var length = splitString.length;
        return (width - (length * 8)) / 2;
    }
};

GameOver.prototype.Clear = function (scale) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width * scale, this.height * scale);
}