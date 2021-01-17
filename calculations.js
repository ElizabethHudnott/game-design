'use strict';

const WIDTH = 8;
const HEIGHT = 8;
const NUM_SQUARES = WIDTH * HEIGHT;
let numFriendly = 16;
let numEnemy = 16;

function calcMoves(piece) {
	const numOtherPieces = numFriendly - 1 + numEnemy;
	const moveMap = new Array(WIDTH);
	let squaresCanExist = 0;
	let totalMoves = 0;
	let maxMoves = 0;
	let minMoves = 0;
	for (let i = 0; i < WIDTH; i++) {
		moveMap[i] = new Array(HEIGHT);
		for (let j = 0; j < HEIGHT; j++) {
			const numMoves = piece.numMoves(i, j, WIDTH, HEIGHT, NUM_SQUARES, numFriendly - 1, numEnemy, numOtherPieces);
			if (numMoves !== undefined) {
				squaresCanExist++;
				totalMoves += numMoves;
				moveMap[i][j] = numMoves;
				if (numMoves > maxMoves) {
					maxMoves = numMoves;
				}
				if (numMoves > 0 && (minMoves === 0 || numMoves < minMoves)) {
					minMoves = numMoves;
				}
			} else {
				moveMap[i][j] = 0;
			}
		}
	}
	piece.moveMap = moveMap;
	piece.meanMoves = totalMoves / squaresCanExist;
	piece.maxLikelyMoves = maxMoves;
	piece.minMoves = minMoves;
}

function plotData() {
	let maxMoves = 0;
	let minMoves;
	for (let piece of pieces) {
		calcMoves(piece);
		if (piece.maxLikelyMoves > maxMoves) {
			maxMoves = piece.maxLikelyMoves;
		}
		if (minMoves === undefined || piece.minMoves < minMoves) {
			minMoves = piece.minMoves;
		}
	}
	const colorStep = 270 / (maxMoves - Math.min(minMoves, 1));
	for (let piece of pieces) {
		const table = document.getElementById(piece.name + '-moves');
		table.innerHTML = '';
		for (let j = HEIGHT - 1; j >= 0; j--) {
			const row = document.createElement('TR');
			for (let i = 0; i < WIDTH; i++) {
				let numMoves = piece.moveMap[i][j];
				let color;
				if (numMoves > 0) {
					const level = (numMoves - minMoves) * colorStep;
					color = `hsl(${level}, 90%, 55%)`;
				} else if ((i + j) % 2 === 0) {
					color = 'black';
				} else {
					color = 'white';
				}
				const cell = document.createElement('TD');
				cell.classList.add('square');
				cell.style.backgroundColor = color;
				row.append(cell);
			}
			table.append(row);
		}
	}
}

class Pawn {
	constructor() {
		this.name = "pawn";
	}

	numMoves(x, y, width, height, numSquares, numOtherFriendly, numEnemy, numOtherPieces) {
		if (y === 0 || y === height - 1) {
			return undefined;
		}
		let n = 1 -  numOtherPieces / (numSquares - 1);
		if (y === 1) {
			n = n + n * (1 - numOtherPieces / (numSquares - 2));
		}
		return n;
	}
}

class Rook {
	constructor() {
		this.name = 'rook';
	}

	numMoves(x, y, width, height, numSquares, numOtherFriendly, numEnemy, numOtherPieces) {
		let n = 0;
		let emptyProability = 1;
		let numSquaresLeft = numSquares;
		for (let i = x + 1; i < width; i++) {
			numSquaresLeft--;
			n += emptyProability * (1 - numOtherFriendly / numSquaresLeft);
			emptyProability *= 1 - numOtherPieces / numSquaresLeft;
		}
		emptyProability = 1;
		numSquaresLeft = numSquares;
		for (let i = x - 1; i >= 0; i--) {
			numSquaresLeft--;
			n += emptyProability * (1 - numOtherFriendly / numSquaresLeft);
			emptyProability *= 1 - numOtherPieces / numSquaresLeft;
		}
		emptyProability = 1;
		numSquaresLeft = numSquares;
		for (let j = y + 1; j < height; j++) {
			numSquaresLeft--;
			n += emptyProability * (1 - numOtherFriendly / numSquaresLeft);
			emptyProability *= 1 - numOtherPieces / numSquaresLeft;
		}
		emptyProability = 1;
		numSquaresLeft = numSquares;
		for (let j = y - 1; j >= 0; j--) {
			numSquaresLeft--;
			n += emptyProability * (1 - numOtherFriendly / numSquaresLeft);
			emptyProability *= 1 - numOtherPieces / numSquaresLeft;
		}
		return n;
	}
}

let pieces = [new Pawn(), new Rook()];
plotData();
