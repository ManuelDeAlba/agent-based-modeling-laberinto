import Agent from "./Agent.js";
import { reshapeArray } from "./utils.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const rows = 30;
const cols = 30;
const sizeX = canvas.width / cols;
const sizeY = canvas.height / rows;

let grid = [];
let steps = [];
let doors = [[0, 1], [cols-1, rows-2], [cols-4, 5]];
let agents = [];

function loadMap(src, width, height){
    return new Promise(resolve => {
        const img = new Image();
        img.src = src;
    
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            const data = ctx.getImageData(0, 0, width, height).data;
            let res = [];
            for(let i = 0; i < data.length; i += 4){
                let r = data[i];
                let g = data[i + 1];
                let b = data[i + 2];

                let avg = (r + g + b) / 3;
                res.push(avg);
            }

            const reshaped = reshapeArray(res, rows, cols);

            resolve(reshaped);
        }
    })
}

function createGrid(){
    return new Array(rows).fill(0).map(e => new Array(cols).fill(0));
}

function calculateSteps(){
    for(let y = 0; y < rows; y++){
        for(let x = 0; x < cols; x++){
            steps[y][x] = Math.min(...doors.map(([xDoor, yDoor]) => {
                if(grid[y][x] == 0) return 255;
                return Math.abs(xDoor - x) + Math.abs(yDoor - y);
            }))
        }
    }
}

function drawGrid(){
    for(let y = 0; y < rows; y++){
        for(let x = 0; x < cols; x++){
            ctx.fillStyle = grid[y][x] == 0 ? "#000" : `hsl(0, 100%, ${100-steps[y][x]*(80/Math.max(...steps.flat(2).filter(num => num < 255)))}%)`;
            if(grid[y][x] == "A") ctx.fillStyle = "#055";

            // if(grid[y][x] == 0) ctx.fillStyle = "#000";
            // if(grid[y][x] == 255) ctx.fillStyle = "#fff";
            ctx.fillRect(x * sizeX, y * sizeY, sizeX, sizeY);
            ctx.strokeRect(x * sizeX, y * sizeY, sizeX, sizeY);
        }
    }
}

function drawDoors(){
    doors.forEach(([x, y]) => {
        ctx.fillStyle = "chocolate";
        ctx.fillRect(x * sizeX, y * sizeY, sizeX, sizeY);
    })
}

function drawSteps(){
    for(let y = 0; y < rows; y++){
        for(let x = 0; x < cols; x++){
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "8px Arial";

            ctx.fillStyle = "#000";
            if(grid[y][x] == 0) ctx.fillStyle = "#fff";
            ctx.fillText(steps[y][x], x * sizeX + sizeX / 2, y * sizeY + sizeY / 2);
        }
    }
}

function drawAgents(){
    agents.forEach(agent => agent.draw(ctx));
}

function moveAgents(){
    agents.forEach(agent => agent.move({ grid, steps, doors, agents }));
}

async function load(){
    grid = await loadMap("/mapa.png", rows, cols);
    steps = createGrid();
    calculateSteps();

    Array.from({length: 10}).forEach(() => {
        agents.push(new Agent({
            rows,
            cols,
            sizeX,
            sizeY,
            grid
        }));
    })    
}

function loop(){
    canvas.width = canvas.width;

    drawGrid();
    drawAgents();
    moveAgents();
    drawDoors();
    drawSteps();
    
    agents = agents.filter(agent => agent.state);
}

setInterval(() => {
    loop();
}, 300)

window.addEventListener('load', load);