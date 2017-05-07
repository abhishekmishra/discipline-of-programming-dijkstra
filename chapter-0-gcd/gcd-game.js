var GAME_SIZE = { x: 30, y: 30 };
var PIXELS_PER_UNIT = 20;
var GRID_SIZE = getGridCoords(GAME_SIZE);
var MARGIN_SIZE = { x: 100, y: 100 };
var PEBBLE_SIZE = 8;
var LINE_SPACE = 1;

var TEXT_AREA = 400;
var TEXT_HEADER_COLOR = '#f06';
var TEXT_ANSWER_COLOR = '#00f';

var draw = null;

// get url parameter, suggested method with least dependencies
// see http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/** 
 * Get svg coordinates from game coordinates
 * 
 * the grid is shifted rightwards to allow for some margin.
 */
function getSvgCoords(gameCoords) {
    var gridCoords = getGridCoords(gameCoords);
    return {
        x: gridCoords.x + MARGIN_SIZE.x,
        y: GRID_SIZE.y - gridCoords.y
    }
}

/**
 * Get grid coordinates from game coordinates
 *  
 * the game coordinates are multiplied by pixels per 
 * unit to get the grid coords
 */
function getGridCoords(gameCoords) {
    return {
        x: gameCoords.x * PIXELS_PER_UNIT,
        y: gameCoords.y * PIXELS_PER_UNIT
    }
}

var currentLine = 0;

/**
 * Writes the game text appearing on the right of the game.
 * Each time incrementing current line by line spaces.
 */
function writeGameText() {

    writeText("The GCD Game", { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine }, TEXT_HEADER_COLOR);
    currentLine += LINE_SPACE;

    writeText("On a cardboard with grid points, the only "
        + "\nnumbers written on it are the axis ticks."
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += 3 * LINE_SPACE;

    writeText("The following straight lines are drawn:-"
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += LINE_SPACE;

    writeText("  1. The Vertical Lines with the" +
        "\n equation 'x = constant'."
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += 2 * LINE_SPACE;

    writeText("  2. The Horizontal Lines with the"
        + "\n equation 'y = constant'."
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += 2 * LINE_SPACE;

    writeText("  3. The Diagonal Lines with the"
        + "\n equation 'x + y = constant'."
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += 2 * LINE_SPACE;

    writeText("  4. The Answer Line with the "
        + "equation 'x = y'."
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += 2 * LINE_SPACE;

    writeText(""
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += LINE_SPACE;

    writeText("Rules of the Game"
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine }, TEXT_HEADER_COLOR);
    currentLine += LINE_SPACE;

    writeText("1. For GCD(x, y), place a pebble "
        + "\n (red circle) on (x, y)."
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += 2*LINE_SPACE;

    writeText("2. As long as the pebble is not " +
        " \n on the answer line, we consider " +
        " \n the smallest isoceles right triangle " +
        " \n with its right angle coninciding " +
        " \nwith the pebble and one sharp angle " +
        " \n(either under or to the left of the " +
        " \npuzzle) on one of the axes."
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += 7 * LINE_SPACE;

    writeText("3. The pebble is then moved to " + 
        "\nthe grid point coinciding with the " +
        " \n other sharp angle of the triangle."
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += 3 * LINE_SPACE;

    writeText("4. This move is repeated till the" +
        " \n  pebble has not arrived at the " +
        " \n answer line. at which point the answer" +
        " \n  has been found (the value of x)."
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine });
    currentLine += 5 * LINE_SPACE;
}

/**
 * Write text given grid coordinates and color(optional).
 */
function writeText(str, at, color) {
    if (!color) {
        color = "#000"
    }
    var c = getSvgCoords(at);
    var text = draw.text(str);
    text.move(c.x, c.y).font({ fill: color, family: 'Inconsolata' });
    return text;
}

/**
 * Draws the grid lines (see game text for details)
 */
function drawGridLines() {
    //write the grid ticks
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

/**
 * General function to draw a line from - to game coords
 */
function drawGridLine(from, to, color) {
    if (!color) {
        color = "#000"
    }
    var start = getSvgCoords(from);
    var end = getSvgCoords(to);
    var l = draw.line(start.x, start.y, end.x, end.y).stroke({ width: 1, color: color });
    return l;
}

/**
 * Writes a number at the game coord
 */
function writeNum(num, at) {
    var c = getSvgCoords(at);
    var text = draw.text('' + num);
    text.move(c.x, c.y).font({ fill: '#f06', family: 'Inconsolata' });
}

/**
 * Recursively play the game, till the answer is found.
 */
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

    //find isoceles right triangle to left or downwards of 
    //pebble such that right angle is on pebble, and one sharp
    //angle is on one of the axes.

    if (pair.x > pair.y) {
        drawIsocelesRightTriangle(pair, { x: pair.x, y: 0 }, { x: pair.x - pair.y, y: pair.y });
        playGame({ x: pair.x - pair.y, y: pair.y });
    } else {
        drawIsocelesRightTriangle(pair, { x: 0, y: pair.y }, { x: pair.x, y: pair.y - pair.x });
        playGame({ x: pair.x, y: pair.y - pair.x });
    }

}

/**
 * Places a pebble(red filled circle) at the game coord
 */
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

/**
 * To string for coords
 */
function getCoordsToString(c) {
    return c.x + ',' + c.y;
}

/**
 * Draws an isoceles right triangle with the three vertices, 
 * and optional color
 */
function drawIsocelesRightTriangle(x, y, z, color) {
    var a = getSvgCoords(x);
    var b = getSvgCoords(y);
    var c = getSvgCoords(z);

    if (!color) {
        color = '#eee';
    }

    var polygon = draw.polygon(getCoordsToString(a) + ' ' + getCoordsToString(b) + ' ' + getCoordsToString(c))
        .fill(color).stroke({ width: 1 });
}

/**
 * Start the game using the given x and y
 */
function startGame(x, y) {
    draw = SVG('drawing').size(GRID_SIZE.x + 2 * MARGIN_SIZE.x + TEXT_AREA, GRID_SIZE.y + 2 * MARGIN_SIZE.y);
    drawGridLines();
    currentLine = 0

    var pair = { x: x, y: y };
    writeGameText();

    writeText("Starting game for GCD(" + x + ", " + y + ")"
        , { x: GAME_SIZE.x + 2, y: GAME_SIZE.y - currentLine }, TEXT_HEADER_COLOR);
    currentLine += LINE_SPACE;

    playGame(pair);
}

/**
 * Get x and y from url params and draw the game,
 * or show an error message.
 */
var x = parseInt(getParameterByName('x'));
var y = parseInt(getParameterByName('y'));
if (x && y && x <= GAME_SIZE.x && y <= GAME_SIZE.y) {
    startGame(x, y);
    var vivus = new Vivus(draw.id(), { duration: 20, start: 'autostart', dashGap: 20, forceRender: false });
} else {
    alert('x and y must be provided as url params, and must be less than ' + GAME_SIZE.x);
}
