export default class Agent{
    constructor({rows, cols, sizeX, sizeY}){
        this.rows = rows;
        this.cols = cols;

        this.x = Math.floor(Math.random() * cols);
        this.y = Math.floor(Math.random() * rows);
        this.newX = this.x;
        this.newY = this.y;
        this.w = sizeX;
        this.h = sizeY;

        this.state = 1;
    }
    draw(ctx){
        ctx.fillStyle = "#00f";
        ctx.fillRect(this.x * this.w, this.y * this.h, this.w, this.h);
    }
    move({ grid, steps, doors, agents }){
        // Paint the cell where the agent is on
        grid[this.y][this.x] = 1;

        let minSteps;
        for(let i = -1; i < 2; i++){
            for(let j = -1; j < 2; j++){                
                let newSteps = steps[this.y + i]?.[this.x + j];
                if(newSteps != undefined && (minSteps == undefined || newSteps < minSteps)){
                    // If there's an agent, choose other cell
                    const isCellTaken = agents.some(agent => this.x + j == agent.x && this.y + i == agent.y && (i != 0 || j != 0));
                    if(!isCellTaken){
                        minSteps = newSteps;
                        this.newX = this.x + j;
                        this.newY = this.y + i;
                    }
                }
            }
        }

        // If there's a door, stop moving and don't increase the steps value
        if(this.isOnDoor(doors, this.newX, this.newY)){
            this.x = this.newX;
            this.y = this.newY;
            this.state = 0;
            return;
        }

        // If the minStep is in the same position, increase the value to penalize the point
        if(this.newX == this.x && this.newY == this.y) steps[this.y][this.x] += 2;

        // Move the agent
        this.x = this.newX;
        this.y = this.newY;
    }
    isOnDoor(doors){
        return doors.some(([x, y]) => x == this.newX && y == this.newY);
    }
}