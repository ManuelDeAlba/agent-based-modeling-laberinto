const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const rows = 15;
const cols = 15;
const sizeX = canvas.width / cols;
const sizeY = canvas.height / rows;

let grid = [];
let steps = [];
let doors = [[0, 1], [cols-1, rows-2], [cols-4, 4]];

function createGrid(){
    return new Array(rows).fill(0).map(e => new Array(cols).fill(0));
}

function calculateSteps(){
    for(let y = 0; y < rows; y++){
        for(let x = 0; x < cols; x++){
            steps[y][x] = Math.min(...doors.map(([xDoor, yDoor]) => {
                return Math.abs(xDoor - x) + Math.abs(yDoor - y);
            }))
        }
    }
}

function drawGrid(){
    for(let y = 0; y < rows; y++){
        for(let x = 0; x < cols; x++){
            ctx.fillStyle = grid[y][x] == 0 ? `hsl(${0}, 100%, ${100-steps[y][x]*(80/13)}%)` : "#000";
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
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "12px Arial";
            ctx.fillText(steps[y][x], x * sizeX + sizeX / 2, y * sizeY + sizeY / 2);
        }
    }
}

function load(){
    grid = createGrid();
    steps = createGrid();
    calculateSteps();
    console.log(steps);
    loop();
}

function loop(){
    canvas.width = canvas.width;

    drawGrid();
    drawDoors();
    drawSteps();

    requestAnimationFrame(loop);
}

window.addEventListener('load', load);