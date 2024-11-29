class Flower {
    constructor(center, petalRadius, palette, petalNum, petalSmooth, UsePaletteColor, Color) {
        this.palette = palette;
        this.flowerColor;
        this.innerColor;
        this.alphaNoise = random();
        this.noiseSeed = random(1000);
        this.noiseAlphaDelta = random(0.01,0.02);//grandient color, less num more smoothier  

        this.center = center;
        this.noiseX = 0;
        this.noiseY = 0;
        this.noiseZ = random(1);
        this.noiseZDelta = petalSmooth; //**(0.008-0.02) control the petal size noise, greater num more noise**

        this.Rot = random(TWO_PI);
        this.RotSpeed = 0.005; //control the speed of rotation
        this.startAngle = random(TWO_PI);

        this.petalNum = petalNum;//floor(random(4, 6))
        this.petalRadiusBase = petalRadius;
        this.petalRadiusMin = 3; //each petal min radius
        this.petalRadiusMax = 16; //each petal max radius
        this.dead = false;
        this.UsePaletteColor = UsePaletteColor;
        this.FillColor = Color;

        this.setColor();
    }

    setColor() {
        if (this.UsePaletteColor) {
            let paletteIndex = round(random(this.palette.length - 1));
            let flowerColor = color(this.palette[paletteIndex]);
            let innerColorIndex = round(random(1, this.palette.length - 1));
            innerColorIndex = (innerColorIndex + paletteIndex) % this.palette.length;
            let innerColor = color(this.palette[innerColorIndex]);
            this.flowerColor = flowerColor.levels;
            this.innerColor = innerColor.levels;
        } else {
            this.flowerColor = this.FillColor;

        }
    }

    updateAlpha() {
        this.alphaNoise += this.noiseAlphaDelta;
        let alphaNoise = noise(this.alphaNoise);
        let strokeW = map(alphaNoise, 0, 1, 10, 1);
        let StrokeAlpha = map(alphaNoise, 0, 1, 1, this.petalRadiusBase * 0.4);

        stroke(this.flowerColor[0], this.flowerColor[1], this.flowerColor[2], StrokeAlpha);
        strokeWeight(strokeW);
        noFill();
    }

    updatePetal() {
        push();
        beginShape();
        translate(this.center.x, this.center.y);
        rotate(this.Rot);
        this.Rot += this.RotSpeed;

        for (let i = this.startAngle; i < (TWO_PI + this.startAngle); i += 0.001) {
            let x = cos(i * this.petalNum) * cos(i);
            let y = cos(i * this.petalNum) * sin(i);
            this.noiseX = map(x, -1, 1, 0, 1);
            this.noiseY = map(y, -1, 1, 0, 1);
            let radius = map(noise(this.noiseX, this.noiseY, this.noiseZ), 0, 1, this.petalRadiusMin * this.petalRadiusBase, this.petalRadiusMax * this.petalRadiusBase);
            vertex(x * radius, y * radius);
        }
        this.noiseZ += this.noiseZDelta;
        if (this.petalRadiusBase > 6) {
            this.petalRadiusBase *= 0.998;
        } else {
            this.petalRadiusBase = 0;
            this.dead = true;
        }
        endShape();
        pop();
    }
}

export default Flower;  