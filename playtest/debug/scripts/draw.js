function game(canvas, ctx, walls) {

    //calculated options, related to canvas size
    //wall options
    brickSize = Math.round(canvas.width / mazeSize * 2);
    walls.forEach(wall => { //this function moves the bricks over slightly to make them looks better on the canvas
        wall[0] *= Math.round(brickSize / 2);
        wall[1] *= Math.round(brickSize / 2);

        wall[0] -= Math.round(brickSize / 2);
        wall[1] -= shiftDownModifier * Math.round(brickSize / 2);
    });

    //player options
    playerRadius = brickSize;
    playerPosition = [canvas.width / 2, canvas.height - brickSize * 2]
    player2Position = [canvas.width / 2, brickSize * 2]
    currentPlayerX = playerPosition[0];
    currentPlayerY = playerPosition[1];

    //bullet options
    bulletRadius = brickSize / 4
    speed = 2 * brickSize / 10 + mazeSize / 300;
    bulletCoordinates = [playerPosition[0], playerPosition[1]]

    lineSpeed = speed; //these will be disabled
    //this is the main function of the game, draws and clears and calls other functions every frame
    function draw() {
        frames++
        log(frames);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawBricks();
        if (bullet) {
            checkKill() //checks if player is hit
            drawBullet();

            //gets bullet position, and next one
            var x = bulletCoordinates[0];
            var y = bulletCoordinates[1];
            var dx = Math.cos(angle) * speedMultiplier * speed;
            var dy = Math.sin(angle) * speedMultiplier * speed;

            if (checkCollision(x, y, dx, dy, walls)) { //if that bullet could intersect with any bricks
                /*
                 * should we change this to make it account for speed, and not stop on the frame it hits?
                 */
                var collisionInfo = getBlockBulletIntersection(x, y, dx, dy, walls); //finds the intersection
                bulletCoordinates = collisionInfo[0]; //gets point of collision with block
                lastCollision[0] = bulletCoordinates[0]; //last collision point, so it can't hit the same wall again
                lastCollision[1] = bulletCoordinates[1];
                getBounce(collisionInfo[1]); //changes angle depending on what side it hit
            } else {
                bulletCoordinates[0] += dx; //moves the calculated distance
                bulletCoordinates[1] += dy;
            }

        }
        if (turns > 0 && !lStopped && !bullet) { //first player can't shoot so no line
            prevX = currentPlayerX;
            prevY = currentPlayerY;
            drawLine();
        }

        

        //sets the angle and bounce information corresponding which side is bounced off of 
        function getBounce(sideNumber) {
            //*****0
            //**1|---|
            //***|---|3
            //*****2
            if (sideNumber % 2 == 0) {
                horizontalCollision()
            } else {
                verticalCollision();
            }
        }

        //bouncing off a horizontal side (side 1 or 3)
        function horizontalCollision() {
            bounce();
            angle = -angle;
        }

        //bouncing off of a vertical side (side 0 or 2)
        function verticalCollision() {
            bounce();
            angle = Math.PI - angle;

        }

        //updates proper variables on bounce
        function bounce() {
            lastBounce = [-brickSize * 2, -brickSize * 2]
            bounceCount++;
            if (bounceCount > maxBounceCount) {
                bullet = false;
                bulletCoordinates[0] = currentPlayerX,
                    bulletCoordinates[1] = currentPlayerY;
                bounceCount = 0;
            }

        }

        //draws the bullet at its coordinates
        function drawBullet() {
            ctx.beginPath();
            ctx.arc(bulletCoordinates[0], bulletCoordinates[1], bulletRadius, 0, Math.PI * 2)
            //set to bullet colour for it to have an effect
            if (turn) {
                ctx.fillStyle = bullet2Color;
            } else {
                ctx.fillStyle = bulletColor;
            }

            ctx.fill();
            ctx.closePath();
        }

        //draws a line that shows the path of the bullet (currently, the line does not bounce)
        function drawLine() {
            //this can be changed to remove speed iteration, and just iterate through all blocks and find the closest intersection
            for (i = 0; i < mazeSize * 10; i++) {
                lineX = prevX + (Math.cos(lineAngle) * lineSpeed)
                lineY = prevY + (Math.sin(lineAngle) * lineSpeed)
                prevX = lineX;
                prevY = lineY;
                if (lineCollisions(lineX, lineY, walls)) {
                    if (disableLineBounce) {
                        //check all possible intersections of this line with all lines comprising of all blocks and choose the closest one
                        //get the equation of the line
                        //find the next intersection of that line with a block
                        //draw a line from there to the block
                        //get the equation of the new line, repeat until it has bounced the same number of time as the ball can
                        break;
                    }
                }
            }
            ctx.beginPath();
            ctx.moveTo(currentPlayerX, currentPlayerY);
            ctx.lineTo(lineX, lineY);
            ctx.strokeStyle = lineColour;
            ctx.stroke();
            ctx.closePath();
        }

        //draws the players, and the surrounding lines that show where they can move
        function drawPlayer() {
            ctx.beginPath();
            ctx.arc(playerPosition[0], playerPosition[1], playerRadius, 0, Math.PI * 2)
            ctx.fillStyle = playerColor;
            ctx.fill();
            ctx.closePath();

            if (turn && !bullet && count < maxCount) {
                //these can probably be changed to a loop
                ctx.beginPath();
                ctx.arc(playerPosition[0], playerPosition[1], speed * moveMultiplier * speedMultiplier, 0, Math.PI * 2)
                ctx.lineWidth = brickSize / 5;
                ctx.strokeStyle = "green";
                ctx.stroke();
                ctx.closePath();
                if (count + 1 < maxCount) {
                    ctx.beginPath();
                    ctx.arc(playerPosition[0], playerPosition[1], speed * 2 * moveMultiplier * speedMultiplier, 0, Math.PI * 2)
                    ctx.lineWidth = brickSize / 5;
                    ctx.strokeStyle = "yellow";
                    ctx.stroke();
                    ctx.closePath();
                }
                if (count + 2 < maxCount) {
                    ctx.beginPath();
                    ctx.arc(playerPosition[0], playerPosition[1], speed * 3 * moveMultiplier * speedMultiplier, 0, Math.PI * 2)
                    ctx.lineWidth = brickSize / 5;
                    ctx.strokeStyle = "red";
                    ctx.stroke();
                    ctx.closePath();
                }
            } else if (!bullet && count < maxCount) {
                ctx.beginPath();
                ctx.arc(player2Position[0], player2Position[1], speed * moveMultiplier * speedMultiplier, 0, Math.PI * 2)
                ctx.lineWidth = brickSize / 5;
                ctx.strokeStyle = "green";
                ctx.stroke();
                ctx.beginPath();
                if (count + 1 < maxCount) {
                    ctx.beginPath();
                    ctx.arc(player2Position[0], player2Position[1], speed * 2 * moveMultiplier * speedMultiplier, 0, Math.PI * 2)
                    ctx.lineWidth = brickSize / 5;
                    ctx.strokeStyle = "yellow";
                    ctx.stroke();
                    ctx.closePath();
                }
                if (count + 2 < maxCount) {
                    ctx.beginPath();
                    ctx.arc(player2Position[0], player2Position[1], speed * 3 * moveMultiplier * speedMultiplier, 0, Math.PI * 2)
                    ctx.lineWidth = brickSize / 5;
                    ctx.strokeStyle = "red";
                    ctx.stroke();
                    ctx.closePath();
                }
            }

            ctx.beginPath();
            ctx.arc(player2Position[0], player2Position[1], playerRadius, 0, Math.PI * 2)
            ctx.fillStyle = player2Color;
            ctx.fill();
            ctx.closePath();
        }

        //draws all the bricks on screen
        function drawBricks() {
            for (var i = 0; i < walls.length; i++) {
                var brickX = walls[i][0];
                var brickY = walls[i][1];

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickSize, brickSize);
                ctx.fillStyle = brickColour;
                ctx.fill();
                ctx.closePath();


            }
        }
    }

    setInterval(draw, interval)
}