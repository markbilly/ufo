function Pause(ctx, width, height) {
    // Set the canvas
    this.ctx = ctx;
    this.width = width;
    this.height = height;
}

Pause.prototype.Draw = function (scale) {
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
        "Paused",
        centred("Paused", this.width) * scale,
        75 * scale
    );

    // Returns x value for centred string
    function centred(string, width) {
        var splitString = string.split("");
        var length = splitString.length;
        return (width - (length * 8)) / 2;
    }
};

Pause.prototype.Clear = function (scale) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width * scale, this.height * scale);
}