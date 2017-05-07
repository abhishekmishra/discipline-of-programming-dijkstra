var GAME_SIZE = { x: 30, y: 30 };
var PIXELS_PER_UNIT = 20;
var GRID_SIZE = getGridCoords(GAME_SIZE);
var MARGIN_SIZE = { x: 100, y: 100 };
var PEBBLE_SIZE = 8;
var LINE_SPACE = 1;

var TEXT_AREA = 500;
var TEXT_HEADER_COLOR = '#f06';
var TEXT_ANSWER_COLOR = '#00f';

var draw = null;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

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

var currentLine = 0;

function writeGameText() {

    writeText("The GCD Game", { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine }, TEXT_HEADER_COLOR);
    currentLine += LINE_SPACE;

    writeText("On a cardboard with grid points, the only numbers written on it are the axis ticks."
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += LINE_SPACE;

    writeText("The following straight lines are drawn:-"
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += LINE_SPACE;

    writeText("  1. The Vertical Lines with the equation 'x = constant'."
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += LINE_SPACE;

    writeText("  2. The Horizontal Lines with the equation 'y = constant'."
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += LINE_SPACE;

    writeText("  3. The Diagonal Lines with the equation 'x + y = constant'."
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += LINE_SPACE;

    writeText("  4. The Answer Line with the equation 'x = y'."
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += LINE_SPACE;

    writeText(""
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += LINE_SPACE;

    writeText("Rules of the Game"
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine }, TEXT_HEADER_COLOR);
    currentLine += LINE_SPACE;

    writeText("1. For GCD(x, y), place a pebble (red circle) on (x, y)."
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += LINE_SPACE;

    writeText("2. As long as the pebble is not on the answer line, we consider the smallest" +
        " \nequilateral rectangular triangle with its right angle coninciding with the pebble" +
        " \nand one sharp angle (either under or to the left of the puzzle) on one of the axes."
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += 3 * LINE_SPACE;

    writeText("3. The pebble is then moved to the grid point coinciding with the other sharp" +
        " \n angle of the triangle."
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += 2 * LINE_SPACE;

    writeText("4. This move is repeated till the pebble has not arrived at the answer line." +
        " \n at which point the answer has been found (the value of x or y)."
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += 3 * LINE_SPACE;
}

function writeText(str, at, color) {
    if (!color) {
        color = "#000"
    }
    var c = getSvgCoords(at);
    var text = draw.text(str);
    text.move(c.x, c.y).font({ fill: color, family: 'Inconsolata' });
    return text;
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

function playGame(pair) {
    //alert(getCoordsToString(pair));
    //place pebble
    placePebble(pair);

    //if pebble is on answer line, stop
    if (pair.x == pair.y) {
        writeText("The GCD is " + pair.x
            , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine }, TEXT_ANSWER_COLOR);
        currentLine += LINE_SPACE; return;
    }

    //find equilateral right triangle to left or downwards of 
    //pebble such that right angle is on pebble, and one sharp
    //angle is on one of the axes.

    if (pair.x > pair.y) {
        drawEquilateralRightTriangle(pair, { x: pair.x, y: 0 }, { x: pair.x - pair.y, y: pair.y });
        playGame({ x: pair.x - pair.y, y: pair.y });
    } else {
        drawEquilateralRightTriangle(pair, { x: 0, y: pair.y }, { x: pair.x, y: pair.y - pair.x });
        playGame({ x: pair.x, y: pair.y - pair.x });
    }

}

function placePebble(at, color) {
    if (!color) {
        color = '#f06';
    }
    var center = getSvgCoords(at);
    var c = draw.circle(PEBBLE_SIZE).fill(color)
        .move(center.x - PEBBLE_SIZE / 2, center.y - PEBBLE_SIZE / 2);

    writeText("The pebble is at " + getCoordsToString(at)
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += LINE_SPACE;
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

function startGame(x, y) {
    draw = SVG('drawing').size(GRID_SIZE.x + 2 * MARGIN_SIZE.x + TEXT_AREA, GRID_SIZE.y + 2 * MARGIN_SIZE.y);
    drawGridLines();
    currentLine = 0

    writeText("Starting game for GCD(" + x + ", " + y + ")"
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine }, TEXT_HEADER_COLOR);
    currentLine += LINE_SPACE;

    var pair = { x: x, y: y };
    writeGameText();

    playGame(pair);
}

var x = parseInt(getParameterByName('x'));
var y = parseInt(getParameterByName('y'));
if (x && y && x <= GAME_SIZE.x && y <= GAME_SIZE.y) {
    startGame(x, y);
    var vivus = new Vivus(draw.id(), { duration: 200, start: 'autostart', dashGap: 20, forceRender: false });
} else {
    alert('x and y must be provided as url params, and must be less than ' + GAME_SIZE.x);
}
