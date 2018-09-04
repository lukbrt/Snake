const INTERVAL_PERIOD = 150, //period in ms
      SIDE_SIZE = 10;

let board = Array(SIDE_SIZE).fill(0).map(x => Array(SIDE_SIZE).fill(0));

let snake = {
    lastDirection: 39, //right
    body: [new Point(0, 0), new Point(1, 0)], //new Array()      , new Point(2, 0), new Point(3, 0), new Point(4, 0)
    head: 0,
    tail: 0,
    intersectSet: new Set()
};

let apple = {
    position: randomizeApplePoint()
};

let gameOver = false;

snake.head = snake.body[snake.body.length - 1];
snake.tail = snake.body[0];
for (let i = 0; i < 4; i++)
{
    board[0][i] = 1;
}

// TEST **********
console.log("snake.head" + snake.head.x + "   " + snake.head.y);
console.log("snake.tail" + snake.tail.x + "   " + snake.tail.y);
console.log("snake.body[0]" + snake.body[0].x + "   " + snake.body[0].y);
//**************** */

function Point(x, y) 
{
    this.x = x;
    this.y = y;
}

window.onload = function()
{
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');

    document.body.addEventListener("keydown", e => {
        let code = e.which;

        if (code >= 37 && code <= 40)
        {
            snake.lastDirection = code;
        }

    });

    draw();

    let iterator = this.setInterval(() => {

        let newPoint = new Point(snake.head.x, snake.head.y),
            removedPoint;

        switch(snake.lastDirection)
        {
            case 39: //right
                ++newPoint.x;
            break;

            case 37: //left
                --newPoint.x;
            break;

            case 38: //up
                --newPoint.y;
            break;

            case 40: //down
                ++newPoint.y
            break;
        }

        if (newPoint.x >= SIDE_SIZE || newPoint.x < 0 || newPoint.y < 0 || 
            newPoint.y >= SIDE_SIZE || checkIntersect())
        {
            this.clearInterval(iterator);
            console.log('........end--->WALL..........');
        }
        // ***test***
            // let test = '';
            // for (let i = 0; i < snake.body.length; i++)
            // {
            //     test += '| (' + snake.body[i].x + ", " + snake.body[i].y + ') | ';
            // }
            // alert(test);
        // 

        //move snake****
        snake.body.push(newPoint); //snake.head
        board[newPoint.y][newPoint.x] = 1;
        snake.head = newPoint;
        removedPoint = snake.body.shift();
        board[removedPoint.y][removedPoint.x] = 0;
        //************ */

        if (isEquivalent(snake.head, apple.position))
        {
            board[apple.position.y][apple.position.x] = 0;
            apple.position = randomizeApplePoint();
            let tail = snake.body[0];
            switch (snake.lastDirection) 
            {
                case 39: //right
                    if (tail.x > 0)
                    {
                        snake.body.unshift(new Point(tail.x - 1, tail.y));
                    }
                    else if (tail.y > 0 && board[tail.y - 1][tail.x] === 0)
                    {
                        snake.body.unshift(new Point(tail.x, tail.y - 1));
                    }
                    else if (tail.y == 0 && board[tail.y + 1][tail.x] === 0)
                    {
                        snake.body.unshift(new Point(tail.x, tail.y + 1));
                    }
                    else
                    {
                        gameOver = true;
                    }
                    break;

                case 37: //left
                    if (tail.x < SIDE_SIZE - 1) 
                    {
                        snake.body.unshift(new Point(tail.x + 1, tail.y));
                    }
                    else if (tail.y > 0 && board[tail.y - 1][tail.x] === 0) 
                    {
                        snake.body.unshift(new Point(tail.x, tail.y - 1));
                    }
                    else if (tail.y == 0 && board[tail.y + 1][tail.x] === 0) 
                    {
                        snake.body.unshift(new Point(tail.x, tail.y + 1));
                    }
                    else 
                    {
                        gameOver = true;
                    }
                    break;

                case 38: //up
                    if (tail.y < SIDE_SIZE - 1) 
                    {
                        snake.body.unshift(new Point(tail.x, tail.y + 1));
                    }
                    else if (tail.x > 0 && board[tail.y][tail.x - 1] === 0) 
                    {
                        snake.body.unshift(new Point(tail.x - 1, tail.y));
                    }
                    else if (tail.x == 0 && board[tail.y][tail.x + 1] === 0) 
                    {
                        snake.body.unshift(new Point(tail.x + 1, tail.y));
                    }
                    else 
                    {
                        gameOver = true;
                    }
                    break;

                case 40: //down
                    if (tail.y > 0) 
                    {
                        snake.body.unshift(new Point(tail.x, tail.y - 1));
                    }
                    else if (tail.x > 0 && board[tail.y][tail.x - 1] === 0) 
                    {
                        snake.body.unshift(new Point(tail.x - 1, tail.y));
                    }
                    else if (tail.x == 0 && board[tail.y][tail.x + 1] === 0) 
                    {
                        snake.body.unshift(new Point(tail.x + 1, tail.y));
                    }
                    else 
                    {
                        gameOver = true;
                    }
                    break;
            }
            
        }
        // if (snake.body.length > 0)
        //     snake.tail = snake.body[0];
        //***************** */

        draw();
    }, INTERVAL_PERIOD);

    function draw()
    {
         let snakePointer;

        context.fillStyle='yellow';
        for (let i = 0; i < SIDE_SIZE; i++)
        {
            for (let j = 0; j < SIDE_SIZE; j++)
            {
                if (j % 2 === 0)
                {
                    if (i % 2 === 0)
                    {
                        context.fillStyle = 'yellow';
                    }
                    else
                    {
                        context.fillStyle = 'green';
                    }
                }
                else
                {
                    if (i % 2 !== 0) 
                    {
                        context.fillStyle = 'yellow';
                    }
                    else 
                    {
                        context.fillStyle = 'green';
                    }
                }
                context.fillRect(i * 50, j * 50, 50, 50);
            
            
            }
        }

        //***draw apple */
        context.fillStyle = 'red';
        context.beginPath();
        context.arc(apple.position.x * 50 + 25, apple.position.y * 50 + 25, 25, 0, Math.PI * 2);
        context.fill();
        
        //************* */

        context.fillStyle = 'black';
        for (let i = 0; i < snake.body.length; i++)
        {
            snakePointer = snake.body[i];
            context.fillRect(snakePointer.x * 50, snakePointer.y * 50, 50, 50);
            console.log("snake length:   " + snake.body.length);
            // console.log(snakePointer.x + "   " + snakePointer.y);
        }
    }
    
}

function isEquivalent(a, b)
{
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);

    if (aProps.length != bProps.length)
        return false;

    for (let i = 0; i < aProps.length; i++)
    {
        let propName = aProps[i];

        if (a[propName] !== b[propName])
            return false;
    }

    return true;
}

function checkIntersect()
{
    for (let i = 0; i < snake.body.length - 1; i++)
    {
        if (isEquivalent(snake.head, snake.body[i]))
        {
            return true;
        }
    }
    return false;
}

// function randomizeApple()
// {
//     let iRandom = randomize(),
//         jRandom = randomize();

//     while (!board[iRandom][jRandom])
//     {
//         iRandom = randomize();
//         jRandom = randomize();
//     }

//     board[iRandom][jRandom] = 1;
// }

function randomizeApplePoint() 
{
    let yRandom = randomize(),
        xRandom = randomize();
    // console.log(xRandom + "    ,  " + yRandom);
    while (board[yRandom][xRandom] !== 0) 
    {
        yRandom = randomize();
        xRandom = randomize();
    }

    board[yRandom][xRandom] = 2;

    return new Point(xRandom, yRandom);
}

function randomize()
{
    return Math.floor(Math.random() * (SIDE_SIZE - 1));
}