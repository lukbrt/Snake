const INTERVAL_PERIOD = 150, //period in ms
      SIDE_SIZE = 10;

let board = Array(SIDE_SIZE).fill(0).map(x => Array(SIDE_SIZE).fill(0));

let snake = {
    // previousDirection: 39,
    lastDirection: 39, //right
    body: [new Point(0, 0), new Point(1, 0)], //new Array()      , new Point(2, 0), new Point(3, 0), new Point(4, 0)
    head: 0,
    tail: 0,
    intersectSet: new Set()
};

let apple = {
    position: randomizeApplePoint()
};
let appleImg = document.createElement('img');
appleImg.src = 'res/apple2.svg';

//****** */
let headImg = document.createElement('img');
headImg.src = 'res/snakeHead.svg';

let tailImg = document.createElement('img');
tailImg.src = 'res/tail.svg';
//****** */

let gameOver = false;
let iterator;
let startButton = document.getElementById('start'),
    counter = document.getElementById('counter');
counter.innerHTML = snake.body.length;
// startButton.style.opacity = 0;

snake.head = snake.body[snake.body.length - 1];
snake.tail = snake.body[0];
for (let i = 0; i < 3; i++)
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
    let canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');

    document.body.addEventListener("keydown", e => {
        let code = e.which;

        if (code >= 37 && code <= 40 && checkChangeDirection(code))
        {
            snake.lastDirection = code;
        }

    });

    draw();

    startButton.addEventListener('click', () => {
        startButton.style.opacity = 0;
        startButton.disabled = true;
        sleep(500).then(() => {
            iterator = setInterval(play, INTERVAL_PERIOD);
        });
    });

    // appendStartButton();

    function play()
    {
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
            clearInterval(iterator);
            gameOver = true;
            console.log('........end--->WALL..........');
            displayEndStmt();
            return;
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
        snake.body.push(newPoint);
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
            counter.innerHTML = snake.body.length;
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
    }

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
                        context.fillStyle = '#78FFAA';
                    }
                    else
                    {
                        context.fillStyle = '#52FF95';
                    }
                }
                else
                {
                    if (i % 2 !== 0) 
                    {
                        context.fillStyle = '#78FFAA';
                    }
                    else 
                    {
                        context.fillStyle = '#52FF95';
                    }
                }
                context.fillRect(i * 50, j * 50, 50, 50);
            
            
            }
        }

        //***draw apple */
        // context.fillStyle = 'red';
        // context.beginPath();
        // context.arc(apple.position.x * 50 + 25, apple.position.y * 50 + 25, 25, 0, Math.PI * 2);
        // context.fill();

        context.drawImage(appleImg, apple.position.x * 50 + 2, apple.position.y * 50 + 2, 46, 46);
        
        //************* */

        // context.fillStyle = '#568cbe'; // 8E09FF
        for (let i = 0; i < snake.body.length; i++)
        {
            snakePointer = snake.body[i];
            if (snakePointer.x === snake.head.x && snakePointer.y === snake.head.y)
            {
                context.save();
                context.translate(snakePointer.x * 50 + 25, snakePointer.y * 50 + 25);
                if (snake.lastDirection == 38) //up
                {
                    context.rotate(Math.PI * 3 / 2);
                }
                else if (snake.lastDirection == 37)
                {
                    context.rotate(Math.PI);
                }
                else if (snake.lastDirection == 40) 
                {
                    context.rotate(Math.PI / 2); //Math.PI * 3 / 2
                }
                context.drawImage(headImg, -25, -25, 50, 50);
                context.restore();
            }
            // else if (snakePointer.x === snake.body[0].x && snakePointer.y === snake.body[0].y) 
            // {
            //     context.save();
            //     context.translate(snakePointer.x * 50 + 25, snakePointer.y * 50 + 25);
            //     if (snake.lastDirection == 38) //up
            //     {
            //         context.rotate(-Math.PI / 2);
            //     }
            //     else if (snake.lastDirection == 37) {
            //         context.rotate(Math.PI);
            //     }
            //     else if (snake.lastDirection == 40) {
            //         context.rotate(Math.PI / 2); //Math.PI * 3 / 2
            //     }
            //     context.drawImage(tailImg, -25, -25, 50, 50);
            //     context.restore();
            // }
            else
            {
                context.fillStyle = '#568cbe';
                context.fillRect(snakePointer.x * 50, snakePointer.y * 50, 50, 50);
                // context.strokeStyle = "#8E38FF";
                // context.lineWidth = 2;
                // context.strokeRect(snakePointer.x * 50, snakePointer.y * 50, 50, 50);
            }
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

function checkChangeDirection(newDirection) 
{
    return (Math.abs(snake.lastDirection - newDirection) !== 2);
}

function sleep(time) 
{
    return new Promise((resolve) => setTimeout(resolve, time));
}

function displayEndStmt()
{
    let stmtEl = document.getElementById('statement');
    startButton.disabled = false;
    startButton.innerHTML = 'RESTART';
    startButton.style.opacity = 1;
    startButton.addEventListener('click', () => {
        startButton.disabled = 'true';
        startButton.style.opacity = 0;
        stmtEl.removeChild(endStmt);
        initialize();
    });

    let endStmt = document.createElement('p'),
        node = document.createTextNode("You lost. Your lenght was: " + counter.innerText);
    
    endStmt.appendChild(node);
    endStmt.classList += 'moveUp';
    stmtEl.insertBefore(endStmt, startButton);

}

function initialize() 
{
    board.forEach(row => row.map(cell => 0));
    snake = {
        lastDirection: 39, //right
        body: [new Point(0, 0), new Point(1, 0)],
        head: 0,
        tail: 0,
        intersectSet: new Set()
    };
    gameOver = false;
    snake.head = snake.body[snake.body.length - 1];
    snake.tail = snake.body[0];
    counter.innerHTML = snake.body.length;
    for (let i = 0; i < 3; i++) 
    {
        board[0][i] = 1;
    }
}