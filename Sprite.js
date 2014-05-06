function Sprite(x, y, width, height, speed, src) {
    this.image = new Image();
    this.src = src;
    this.assetScale = 3;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.xf = x;
    this.yf = y;
    this.clip = [0, 0, this.width, this.height]; // x, y, w, h clip for drawing
    this.frame = 0; // current frame to draw
    this.speed = speed;
    this.acceleration = 0.2;
    this.visible = true;
    this.defaultDraw = document.createElement("canvas");
    // Optimisation properties
    this.lastX = this.x;
    this.lastY = this.y;
    this.lastWidth = this.width;
    this.lastHeight = this.height;
    this.lastFrame = this.frame;
}

Sprite.prototype.Load = function () {
    // Load image
    this.image.src = this.src;
};

Sprite.prototype.Move = function (move) {
    // Update float position
    this.xf += move * this.speed;

    // Update integer position
    this.x = Math.floor(this.xf);
};

Sprite.prototype.UpdateLasts = function () {
    this.lastX = this.x;
    this.lastY = this.y;
    this.lastWidth = this.width;
    this.lastHeight = this.height;
    this.lastFrame = this.frame;
};

Sprite.prototype.ShouldClear = function () {
    // Return true if changed
    if (this.lastX != this.x ||
        this.lastY != this.y ||
        this.lastWidth != this.width ||
        this.lastHeight != this.height ||
        this.lastFrame != this.frame)
        return true;
};

Sprite.prototype.Clear = function (ctx, scale) {
    // Clear the canvas area sprite occupies
    ctx.clearRect(this.lastX * scale, this.lastY * scale, this.lastWidth * scale, this.lastHeight * scale);
};

Sprite.prototype.Draw = function (ctx, scale) {
    // Don't draw if not visible
    if (!this.visible)
        return;

    // Take frame into account
    var offsetX = this.frame * this.width;

    // Draw sprite at current coords
    ctx.drawImage(
        this.image,
        (this.clip[0] + offsetX) * this.assetScale,
        this.clip[1] * this.assetScale,
        this.clip[2] * this.assetScale,
        this.clip[3] * this.assetScale,
        this.x * scale,
        this.y * scale,
        this.width * scale,
        this.height * scale
    );

    // Update last values
    this.UpdateLasts();
};