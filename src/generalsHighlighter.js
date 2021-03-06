// ==UserScript==
// @name         Generals.io GeneralsHighlighter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  toolbox for generals.io
// @author       Steven Hao
// @match        http://generals.io/*
// @grant        none
// ==/UserScript==

// ==================================
// GeneralsHighlighter Plugin

// This highlights squares containing generals, even after they aren't visible on the map anymore

var GeneralsHighlighter = (function() {
    var squares = [];
    function update() {
        var cells = getCells();
        cells.forEach((cell, idx) => {
            if (cell.className.contains('general')) {
                if (!squares.contains(idx)) {
                    squares.push(idx);
                }
            } else if (cell.className.contains('city') ||
                       cell.className.contains('mountain') ||
                       cell.className.contains('obstacle')) {
                if (squares.contains(idx)) {
                    squares.remove(idx);
                    cell.style.cssText = ''; // unhighlight it
                }
            }
        });
    }

    function markCell(cell) {
        cell.style.cssText = 'outline: 3px solid red; background-image: url(/crown.png); background-position: center; background-repeat: no-repeat;';
    }

    var watchIntvl = 0;

    function start() {
        squares = [];
        if (watchIntvl) {
            stop();
        }

        watchIntvl = setInterval(function() {
            try {
                var cells = getCells();
                update();
                squares.map(idx => cells[idx]).forEach(markCell);
            } catch(ex) {
                stop();
            }
        }, 500);
    }

    function stop() {
        clearInterval(watchIntvl);
        watchIntvl = 0;
    }

    var result = {
        name: 'GeneralsHighlighter',
        running: function() {
            return watchIntvl !== 0;
        },
        start: start,
        stop: stop,
    };
    return result;
}());

// add to the plugin manager
(function() {
    var intvl = setInterval(function() {
        if (Generals && Generals.ready()) {
            Generals.addPlugin(GeneralsHighlighter);
            clearInterval(intvl);
        }
    }, 100);
}());
