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
    this.loaded = false;
}

Sprite.prototype.Load = function() {
    // Load image
    this.image.src = this.src;

    // Setup default off-screen draw
    this.defaultDraw.width = this.width * this.assetScale;
    this.defaultDraw.height = this.height * this.assetScale;
    var context = this.defaultDraw.getContext("2d");
    //this.Draw(context, this.assetScale);
    context.drawImage(this.image, 0, 0, this.width * this.assetScale, this.height * this.assetScale);

    // Set flag
    this.loaded = true;
};

Sprite.prototype.Move = function (move) {
    // Update float position
    this.xf += move * this.speed;

    // Update integer position
    this.x = Math.floor(this.xf);
};

Sprite.prototype.Draw = function (ctx, scale) {
    // Don't draw if not visible
    if (!this.visible)
        return;

    // If frame is 0 (most common)
    // Then just draw the pre-rendered
    //if (this.loaded && this.frame == 0) {
    //    ctx.drawImage(this.defaultDraw, this.x * scale, this.y * scale);
    //    return;
    //}

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
};