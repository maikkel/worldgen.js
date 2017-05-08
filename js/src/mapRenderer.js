'use strict';



module.exports = (function() {
    var $ = require('jquery');
    var settings = require('./settings');
    var mkNoise = require('./mkNoise');
    var mkMath = require('./mkMath');

    var tileTypes = require('./tileTypes');

    var ctx;

    //var display = $("#display").get(0);


    var resize = function() {
        display.width = settings.mapWidth;
        display.height = settings.mapHeight;

        zoom();

        ctx = display.getContext('2d');
    };

    var zoom = function() {
        $(display).css('width', (settings.mapWidth * settings.zoom) + 'px');
        $(display).css('height', (settings.mapHeight * settings.zoom) + 'px');
    };

    var draw = async function(map) {
        var tiles = map.getTiles();
        var id, x, y;
        if (!settings.slowDraw) {
            id = ctx.createImageData(settings.mapWidth, settings.mapHeight);

            var i = 0;
            for (y = 0; y < settings.mapHeight; y++) {
                for (x = 0; x < settings.mapWidth; x++) {
                    this.drawTile(id, tiles[x][y], i);
                    addLight(tiles, id, x, y, i);
                    i++;
                }
            }
            ctx.putImageData(id, 0, 0);
        } else {
            for (y = 0; y < settings.mapHeight; y++) {
                id = ctx.createImageData(settings.mapWidth, 1);
                for (x = 0; x < settings.mapWidth; x++) {
                    this.drawTile(id, tiles[x][y], x);
                    addLight(tiles, id, x, y, x);
                }
                ctx.putImageData(id, 0, y);
                await this.sleep(4);
            }
        }
        //mkTimer.stop();
    };

    var addLight = function(tiles, id, x, y, i) {
        var hE, hS;
        var tile = tiles[x][y];
        var h = tile.height;

        if (tile.water <= 0) {
            if (x == settings.mapWidth - 1) {
                hE = tile.height;
            } else {
                hE = tiles[x+1][y].height;
            }
            if (y == settings.mapHeight - 1) {
                hS = tile.height;
            } else {
                hS = tiles[x][y+1].height;
            }

            var diffE = (h - hE) * -1;
            var diffS = (h - hS) * -1;

            var diff = diffE + diffS;
            //console.log(diff)

            id.data[i*4] += settings.lightStrength * diff;
            id.data[i*4 + 1] += settings.lightStrength * diff;
            id.data[i*4 + 2] += settings.lightStrength * diff;

        }


    };

    var drawTile = function(id, tile, i) {
        if (tile.height >= 255 || tile.height < 0) {
            id.data[i*4] = 255;
            id.data[i*4 + 1] = 0;
            id.data[i*4 + 2] = 255;
        } else if (tile.height > settings.waterLevel && tile.height < settings.waterLevel + 3 ) {
            id.data[i*4] = 205;
            id.data[i*4 + 1] = 185;
            id.data[i*4 + 2] = 83;
        } else if (tile.water < 1 && tile.water > 0 ) {
            id.data[i*4] = 135;
            id.data[i*4 + 1] = 200;
            id.data[i*4 + 2] = 133;
        } else if (tile.water < 2 && tile.water > 0 ) {
            id.data[i*4] = 50;
            id.data[i*4 + 1] = 100;
            id.data[i*4 + 2] = 255;
        } else if (tile.water > 0) {
            id.data[i*4] = 0;
            id.data[i*4 + 1] = 0;
            id.data[i*4 + 2] = 128 - mkMath.clamp(Math.floor(tile.water * .75), 0, 50);
        } else if (tile.height > 175) {
            id.data[i*4] = tile.height + 30;
            id.data[i*4 + 1] = tile.height + 30;
            id.data[i*4 + 2] = tile.height + 30;
        } else if (tile.height > 165) {
            id.data[i*4] = tile.height - 30;
            id.data[i*4 + 1] = tile.height - 30;
            id.data[i*4 + 2] = tile.height - 50;
        } else if (tile.height > 136) {
            id.data[i*4] = 0;
            id.data[i*4 + 1] = tile.height - 55;
            id.data[i*4 + 2] = 0;
        } else {
            id.data[i*4] = 0;
            id.data[i*4 + 1] = tile.height;
            id.data[i*4 + 2] = 0;
        }

        id.data[i*4 + 3] = 255;
        //console.log(i);
    };

    var sleep = function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    return {
        resize: resize,
        zoom: zoom,
        draw: draw,
        drawTile: drawTile,
        sleep: sleep,
    }

}());