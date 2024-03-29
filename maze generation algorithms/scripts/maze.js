function makeMaze(height, width, complexity, density, removeStragglers) {

    shape = getShape(height, width);
    complexity = getComplexity(shape, complexity);
    density = getDensity(shape, density);
    Z = borderedMaze(shape);

    for (i = 0; i < density; i++) {
        x = getRandom(floorDivide(shape[1], 2)) * 2;
        y = getRandom(floorDivide(shape[0], 2)) * 2;
        Z[y][x] = 1;
        for (j = 0; j < complexity; j++) {
            neighbors = [];
            if (x > 1) {
                neighbors.push([y, x - 2]);
            }
            if (x < shape[1] - 2) {
                neighbors.push([y, x + 2]);
            }
            if (y > 1) {
                neighbors.push([y - 2, x]);
            }
            if (y < shape[0] - 2) {
                neighbors.push([y + 2, x]);
            }
            if (neighbors.length == 1) {
                newY = neighbors[getRandom(neighbors.length - 1)][0];
                newX = neighbors[getRandom(neighbors.length - 1)][1];
                if (Z[newY][newX] == 0) {
                    Z[newY][newX] = 1;
                    Z[newY + floorDivide((y - newY), 2)][newX + floorDivide((x - newX, 2))] = 1;
                    x = newX;
                    y = newY;
                }
            }
        }
    }
    //prevents stragglers from spawning
    if (removeStragglers) {
        for (i = 2; i < Z.length - 2; i++) {
            for (j = 2; j < Z[0].length - 2; j++) {
                if (Z[i + 2][j] == 0 && Z[i - 2][j] == 0 && Z[i][j + 2] == 0 && Z[i][j - 2] == 0) {
                    Z[i][j] = 0;
                }
            }
        }
    }
    return Z;
}

//gets the x and y coordinates of all walls on the map
function mazePoints(maze) {
    points = [];
    for (i = 0; i < maze.length; i++) {
        for (j = 0; j < maze[i].length; j++) {
            if (maze[i][j] == 1) {
                points.push([i, j]);
            }
        }
    }
    return points;
}

//puts players on the map
function mazeSpawns(maze, height, width, max = 20) {
    points = [];
    count = 0;
    while (count < max) {
        i = getRandomL(width - 1, 2);
        j = getRandomL(height - 1, 2);

        //either 0 or 1 for best results
        //1: means that it can be adjacent to one wall
        //0: means that it can be adjacent to zero walls
        sum = maze[i + 2][j] + maze[i - 2][j] + maze[i][j + 2] + maze[i][j - 2];

        if (maze[i][j] == 0) {
            if (sum <= 1) {
                // uncomment these to prevent it from being placed next to diagonals
                // if (maze[i + 2][j + 2] == 0 && maze[i - 2][j - 2] == 0 && maze[i - 2][j + 2] == 0 && maze[i + 2][j - 2] == 0) {
                maze[i][j] = 1;
                points.push([i, j])
                count++;
                //}
            }
        }
    }
    return points;
}

//returns a number in range 0 to highest - 1
function getRandom(highest) {
    return Math.floor((Math.random() * highest) + 0);
}

//returns a number in range lowest to highest - 1
function getRandomL(highest, lowest) {
    random = Math.floor((Math.random() * (highest - lowest)) + lowest);
    if (random % 2 != 0) {
        random++;
    }
    return random;
}

//turns the sizes into odd numbers and creates a shape array
function getShape(height, width) {
    return [floorDivide(height, 2) * 2 + 1, floorDivide(width, 2) * 2 + 1];
}

function getComplexity(shape, complexity) {
    return Math.round(complexity * (5 * (shape[0] + shape[1])));
}

function getDensity(shape, density) {
    return Math.round(density * ((floorDivide(shape[0], 2) * floorDivide(shape[1], 2))));
}


//returns the floor of the quotient
function floorDivide(numerator, denominator) {
    return Math.floor(numerator / denominator);
}

//height is the number of arrays in the arrays
//width is the length of each array in the main array
//returns an array of the specified size with a border of 1s, everything else is 0s
function borderedMaze(shape) {
    height = shape[0];
    width = shape[1];
    (array2D = []).length = height;
    array2D.fill([]);
    for (i = 0; i < height; i++) {
        (arr = []).length = width;
        arr.fill(0)
        if (i % 2 == 0) {
            arr[0] = 1;
            arr[width] = 1;
        }
        array2D[i] = arr;
    }
    //might be better to fill every other one
    for(i = 0; i < array2D[0].length; i++) {
        array2D[0][i] = 1;
        array2D[height - 1][i] = 1;
        i++;
    }
    return array2D;
}