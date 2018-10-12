import * as Util from "./engine/util.js";
import * as Keyboard from "./engine/keyboard.js";

import Camera from "./entities/camera.js";
import Terrain from "./entities/terrain.js";

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2', { antialias: false });

const aspectRatio = 16/9;

import * as tilesheet from "../assets/img/tilesheet.png";

const scene = [];

let camera;

function draw() {
  gl.clearColor(0.2, 0.2, 0.2, 1.0); // Clear background with dark grey color
  gl.clearDepth(1.0); // Clear the depth buffer
  gl.enable(gl.DEPTH_TEST); // Enable depth testing, insures correct ordering
  gl.depthFunc(gl.LEQUAL); // Near obscures far

  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw each individual element
  scene.forEach(t=>t.draw(canvas, gl, camera));
}

function update() {
  scene.forEach(e=>e.update())
  draw();

  window.requestAnimationFrame(update);
}

function init() {
  Keyboard.init();

  const isWebGL2 = !!gl;
  if(!isWebGL2) {
    document.querySelector('body').style.backgroundColor = 'red';
    console.error("Unable to create webgl2 context");
    return;
  }

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  Util.resize(gl, canvas, aspectRatio);
  window.addEventListener("resize", e=>Util.resize(gl, canvas, aspectRatio));

  camera = new Camera(40, aspectRatio);
  scene.push(camera);
  Util.loadImage(tilesheet).then((img) => scene.push(new Terrain(gl, img, 40, 20)));

  update();
}

init();
