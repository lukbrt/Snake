const intervalPeriod = 150, //period in ms
      SIDE_SIZE = 10;

let board = Array(10).fill(0).map(x => Array(10).fill(0));

let snake = {
    lastDirection: 39, //right
    body: [new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(3, 0), new Point(4, 0)], //new Array()
    head: 0,
    tail: 0
};

let gameOver = false;

snake.head = snake.body[snake.body.length - 1];
snake.tail = snake.body[0];
console.log("snake.head" + snake.head.x + "   " + snake.head.y);
console.log("snake.tail" + snake.tail.x + "   " + snake.tail.y);
console.log("snake.body[0]" + snake.body[0].x + "   " + snake.body[0].y);

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

        let newPoint = new Point(snake.head.x, snake.head.y);

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

        if (newPoint.x >= SIDE_SIZE || newPoint.x < 0 || newPoint.y < 0 || newPoint.y >= SIDE_SIZE)
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
        snake.body.push(newPoint); //snake.head
        snake.head = newPoint;
        snake.body.shift();
        if (snake.body.length > 0)
            snake.tail = snake.body[0];
        //***************** */

        draw();
    }, intervalPeriod);

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