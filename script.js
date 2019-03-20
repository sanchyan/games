var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const winningScore = 5;

var showWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x: mouseX,
		y: mouseY
	};
}
function handleMouseClick(evt) {
	if (showWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showWinScreen = false;
	}
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 30;
	setInterval(function() {
		moveEverything();
		drawEverything();
	}, 1000 / framesPerSecond);

	canvas.addEventListener('mousedown', handleMouseClick);

	canvas.addEventListener('mousemove', function(evt) {
		var mousePos = calculateMousePos(evt);
		paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
	});
};

function ballReset() {
	if (player1Score >= winningScore || player2Score >= winningScore) {
		showWinScreen = true;
	}
	ballSpeedX = -ballSpeedX;
	ballX = canvas.width / 2;
	ballY = canvas.width / 2;
}

function computerMovement() {
	let paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
	if (paddle2YCenter < ballY - 35) {
		paddle2Y += 8;
	} else if (paddle2YCenter > ballY + 35) {
		paddle2Y -= 8;
	}
}

function moveEverything() {
	if (showWinScreen) {
		return;
	}
	computerMovement();

	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;

	if (ballX < 0) {
		// ballSpeedX = -ballSpeedX;
		if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
			let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player2Score++; // must be BEFORE ballReset()
			ballReset();
		}
	}
	if (ballX > canvas.width) {
		// ballSpeedX = -ballSpeedX;
		if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
			let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player1Score++;
			ballReset();
		}
	}
	if (ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
	if (ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet() {
	for (let i = 0; i < canvas.height; i += 40) {
		colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
	}
}

function drawEverything() {
	// next line blanks out the screen with black
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	if (showWinScreen) {
		canvasContext.fillStyle = 'white';

		if (player1Score >= winningScore) {
			canvasContext.fillText('You Won', 320, 250);
		} else if (player2Score >= winningScore) {
			canvasContext.fillText('Computer Won', 290, 250);
		}

		canvasContext.fillText('Click to continue', 270, 400);
		return;
	}

	drawNet();
	// this is left player paddle
	colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'Red');

	// this is the computer player
	colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'Red');

	// next line draws the ball
	colorCircle(ballX, ballY, 10, 'yellow');
	//to display player score
	canvasContext.font = '40px PlayfairDisplay';
	canvasContext.fillText(player1Score, 300, 300);
	canvasContext.fillText(player2Score, canvas.width - 300, 300);
}

function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
	canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}
