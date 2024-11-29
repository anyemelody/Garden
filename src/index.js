const canvasSketch = require("canvas-sketch");
const palettes = require("nice-color-palettes/1000.json");
const p5 = require("p5");
const dat = require("dat.gui");
import Flower from "./Flower.js";

new p5();

const settings = {
  dimensions: [2048, 2048],
  p5: true,
  animate: true,
  attributes: {
    antialias: true,
  },
};

let flowers = [];
let palette;

//setup gui
const gui = new dat.GUI({ name: 'My GUI' });
let guiProperty = { PetalRadius: 70, PetalNum: 5, PetalSmooth: 0.01, UsePaletteColor: true, Color: [0, 128, 255] };
let colorController;
gui.add(guiProperty, 'PetalRadius', 20, 80)
gui.add(guiProperty, 'PetalNum', 3, 7, 1);
gui.add(guiProperty, 'PetalSmooth', 0.001, 0.02, 0.001);

gui.add(guiProperty, 'UsePaletteColor').onChange(() => {
  if (!guiProperty.UsePaletteColor) {
    colorController = gui.addColor(guiProperty, 'Color', [0, 128, 255]);
  } else {
    gui.remove(colorController);
  }
});


const sketch = () => {
  let text = createP("Click on canvas to bloom a flower");
  text.position(10, 30);
  let link = createA("https://github.com/anyemelody/Garden", "Check out the source on Github", "_blank");
  link.position(10, 70);
  colorMode(RGB, 255);
  //*blendMode is important to have the combination color effect*/
  blendMode(MULTIPLY);
  reset();

  window.mouseClicked = () => {
    if (mouseX < 2048 && mouseY < 2048) {
      flowers.push(new Flower(createVector(mouseX, mouseY), guiProperty.PetalRadius, palette, guiProperty.PetalNum, guiProperty.PetalSmooth, guiProperty.UsePaletteColor, guiProperty.Color));
    }
  };

  return ({ context, width, height }) => {
    push();
    for (let i = 0; i < flowers.length; i++) {
      flowers[i].updateAlpha();
      flowers[i].updatePetal();
      if (flowers[i].dead) {
        flowers.splice(i, 1);
      }
    }
    pop();
  };
};


function reset() {
  background(255);
  palette = random(palettes); //palette is a color array contains 5 colors
  flowers = [];
  //background color
  let bgIndex = round(random(palette.length - 1));
  let bgColor = color(palette[bgIndex]);
  bgColor = bgColor.levels;
  background(bgColor[0], bgColor[1], bgColor[2], 10);
  //reset flower
  flowers.push(new Flower(createVector(width / 2, height / 2), guiProperty.PetalRadius, palette, guiProperty.PetalNum, guiProperty.PetalSmooth, guiProperty.UsePaletteColor, guiProperty.Color));
}

canvasSketch(sketch, settings);
