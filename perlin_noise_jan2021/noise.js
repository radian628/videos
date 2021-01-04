import { H } from "../helper.js";
import { V2 } from "../vector2.js";

let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

let noiseSize = 256;

let noiseGenerator = H.noise(5, noiseSize);
let noiseGenerator2 = H.noise(5, noiseSize / 3);
let noiseGenerator3 = H.noise(5, noiseSize / 9);

let point = new V2(691, 337);

function setTransform() {
    ctx.save()
    ctx.scale(6, 6);
    ctx.translate(-point.x + 110, -point.y + 65);
}

function makePerlinNoise() {
    for (let i = 0; c.height > i; i++) {    
        for (let ii = 0; c.width > ii; ii++) {
            ctx.fillStyle = `hsl(0, 0%, ${(noiseGenerator(new V2(ii, i)) * 0.5 + 0.5) * 100}%)`;
            ctx.fillRect(ii, i, 1, 1);
        }   
    }
}
function makeFractalNoise() {
    for (let i = 0; c.height > i; i++) {    
        for (let ii = 0; c.width > ii; ii++) {
            ctx.fillStyle = `hsl(0, 0%, ${( (1/3) * (noiseGenerator(new V2(ii, i)) * 0.8 + 0.5 + noiseGenerator2(new V2(ii, i)) * 0.5 + 0.5 + noiseGenerator3(new V2(ii, i)) * 0.2 + 0.5)) * 100}%)`;
            ctx.fillRect(ii, i, 1, 1);
        }   
    }
}
function makeRandomNoise() {
    for (let i = 0; c.height > i; i++) {    
        for (let ii = 0; c.width > ii; ii++) {
            ctx.fillStyle = `hsl(0, 0%, ${(Math.random()) * 100}%)`;
            ctx.fillRect(ii, i, 1, 1);
        }   
    }
}

function coordinatePlane() {
    ctx.strokeStyle = "#777777";
    for (let i = 0; Math.ceil(c.height / noiseSize) > i; i++) {
        for (let ii = 0; Math.ceil(c.width / noiseSize) > ii; ii++) {
            ctx.strokeRect(ii * noiseSize, i * noiseSize, noiseSize, noiseSize);
        }
    }
}
function intCoords() {
    ctx.fillStyle = "#FF0000";
    for (let i = 0; Math.ceil(c.height / noiseSize) > i; i++) {
        for (let ii = 0; Math.ceil(c.width / noiseSize) > ii; ii++) {
            ctx.fillRect(ii * noiseSize - 3, i * noiseSize - 3, 6, 6);
        }
    }
}

function intCoordVectors() {
    ctx.strokeStyle = "#FF0000";
    for (let i = 0; Math.ceil(c.height / noiseSize) > i; i++) {
        for (let ii = 0; Math.ceil(c.width / noiseSize) > ii; ii++) {
            let offset = V2.fromPolar(H.mulberry32Hash(5 + ii + i * 65536) * Math.PI * 2, noiseSize);
            ctx.beginPath();
            ctx.moveTo(ii * noiseSize, i * noiseSize);
            ctx.lineTo(ii * noiseSize + offset.x, i * noiseSize + offset.y);
            ctx.stroke();
        }
    }
}

function placePoint() {
    ctx.fillStyle = "#88FF88";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
    ctx.fill();
}

//setTransform();

makePerlinNoise();

// coordinatePlane();
// intCoords();
// intCoordVectors();
// placePoint();