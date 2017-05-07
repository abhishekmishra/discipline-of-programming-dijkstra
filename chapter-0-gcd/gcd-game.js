var GAME_SIZE = { x: 30, y: 30 };
var PIXELS_PER_UNIT = 20;
var GRID_SIZE = getGridCoords(GAME_SIZE);
var MARGIN_SIZE = { x: 100, y: 100 };
var PEBBLE_SIZE = 8;

var TEXT_AREA = 300;

var draw = SVG('drawing').size(GRID_SIZE.x + 2 * MARGIN_SIZE.x + TEXT_AREA, GRID_SIZE.y + 2 * MARGIN_SIZE.y);

drawGridLines();

function getSvgCoords(gameCoords) {
    var gridCoords = getGridCoords(gameCoords);
    return {
        x: gridCoords.x + MARGIN_SIZE.x,
        y: GRID_SIZE.y - gridCoords.y
    }
}

function getGridCoords(gameCoords) {
    return {
        x: gameCoords.x * PIXELS_PER_UNIT,
        y: gameCoords.y * PIXELS_PER_UNIT
    }
}

function drawGridLines() {
    //the y-axis
    //var yAxis = drawGridLine({ x: 0, y: 0 }, { x: 0, y: gridSize.y });
    for (var i = 1; i <= GAME_SIZE.x; i++) {
        writeNum(i, { x: -1, y: i });
        writeNum(i, { x: i - 0.5, y: 0 });
    }

    //the x-constant lines
    for (var i = 0; i <= GAME_SIZE.x; i++) {
        var from = { x: i, y: 0 };
        var to = { x: i, y: GAME_SIZE.y };
        drawGridLine(from, to);
    }

    //the x-axis
    //var xAxis = drawGridLine({ x: 0, y: 0 }, { x: gridSize.x, y: 0 });

    //the y-constant lines
    for (var i = 0; i <= GAME_SIZE.y; i++) {
        var from = { x: 0, y: i };
        var to = { x: GAME_SIZE.x, y: i };
        drawGridLine(from, to);
    }

    //the diagonals
    //x+y = constant lines
    for (var i = 0; i < GAME_SIZE.x; i++) {
        var from = { x: i, y: 0 };
        var to = { x: 0, y: i };
        drawGridLine(from, to, '#00f');
    }

    for (var i = GAME_SIZE.x; i > 0; i--) {
        var from = { x: GAME_SIZE.x - i, y: GAME_SIZE.y };
        var to = { x: GAME_SIZE.x, y: GAME_SIZE.y - i };
        drawGridLine(from, to, '#00f');
    }

    //the answer line
    drawGridLine({ x: 0, y: 0 }, { x: GAME_SIZE.x, y: GAME_SIZE.y }, "#0f0");
}

function drawGridLine(from, to, color) {
    if (!color) {
        color = "#000"
    }
    var start = getSvgCoords(from);
    var end = getSvgCoords(to);
    var l = draw.line(start.x, start.y, end.x, end.y).stroke({ width: 1, color: color });
    return l;
}

function writeNum(num, at) {
    var c = getSvgCoords(at);
    var text = draw.text('' + num);
    text.move(c.x, c.y).font({ fill: '#f06', family: 'Inconsolata' });
}

function playGame(x, y) {
    var pair = { x: x, y: y };

    //place pebble
    placePebble(pair);

    //if pebble is on answer line, stop
    if (pair.x == pair.y) {
        //alert(getCoordsToString(pair));
        return;
    }

    //find equilateral right triangle to left or downwards of 
    //pebble such that right angle is on pebble, and one sharp
    //angle is on one of the axes.

    if (pair.x > pair.y) {
        drawEquilateralRightTriangle(pair, { x: pair.x, y: 0 }, { x: pair.x - pair.y, y: pair.y });
        playGame(pair.x - pair.y, pair.y);
    } else {
        drawEquilateralRightTriangle(pair, { x: 0, y: pair.y }, { x: pair.x, y: pair.y - pair.x });
        playGame(pair.x, pair.y - pair.x);
    }

}

function placePebble(at, color) {
    if (!color) {
        color = '#f06';
    }
    var center = getSvgCoords(at);
    var c = draw.circle(PEBBLE_SIZE).fill(color)
        .move(center.x - PEBBLE_SIZE / 2, center.y - PEBBLE_SIZE / 2);
}

function getCoordsToString(c) {
    return c.x + ',' + c.y;
}

function drawEquilateralRightTriangle(x, y, z, color) {
    var a = getSvgCoords(x);
    var b = getSvgCoords(y);
    var c = getSvgCoords(z);

    if (!color) {
        color = '#eee';
    }

    var polygon = draw.polygon(getCoordsToString(a) + ' ' + getCoordsToString(b) + ' ' + getCoordsToString(c))
        .fill(color).stroke({ width: 1 });
}

playGame(28, 7);