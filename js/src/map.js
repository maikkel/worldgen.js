'use strict';
var settings = require('./settings');
var mkNoise = require('./mkNoise');
var mkMath = require('./mkMath');

var tileTypes = require('./tileTypes');

var tiles;
//var falloff;

var Tile = (function() {});

var Directions = {
    N: 0,
    E: 1,
    S: 2,
    W: 3,
    NE: 4,
    SE: 5,
    SW: 6,
    NW: 7
};

var riverSources;
var oldDirection = Directions.N;
var curDirection = Directions.N;

module.exports = (function() {

    var build = function() {
        var centerX = Math.floor(settings.mapWidth / 2);
        var centerY = Math.floor(settings.mapHeight / 2);
        riverSources = new Array();
        tiles = new Array(settings.mapWidth);
        for (var x = 0; x < settings.mapWidth; x++) {
            tiles[x] = new Array(settings.mapHeight);
            for (var y = 0; y < settings.mapHeight; y++) {
                tiles[x][y] = new Tile();

                var tile = tiles[x][y];

                var h = mkNoise.getNoise(x, y) * 152;

                var distX = (centerX - x) * (settings.mapHeight / settings.mapWidth);
                var distY = centerY - y;

                var dist = Math.sqrt((distX * distX) + (distY * distY)) - 50;


                var falloff = mkMath.clamp((1-(dist / centerY)) * 2, 0, 1);
                //console.log(falloff)

                tile.height = h * falloff;
                tile.x = x;
                tile.y = y;

                if (h < settings.waterLevel) {
                    tile.water = settings.waterLevel - h;
                } else {
                    tile.water = 0;
                }

                if (tile.height > 150 && tile.height < 180 && Math.random() < 0.0005) {
                    tile.type = tileTypes.RIVER_SOURCE;
                    riverSources.push(tile);
                } else {
                    tile.type = tileTypes.GROUND;
                }

            }
        }

        setWater();
        //setRivers();
    };

    var setRivers = function() {

        riverSources.forEach(function(tile) {
            flowRiver(tile);
        });
    };

    var flowRiver = function(tile) {
        //console.log("b");
        var i = 0;
        var lowest = getNextRiverTile(getNeighbours(tile));
        while(lowest.type != tileTypes.RIVER && lowest.height > settings.waterLevel) {
            lowest.water = 1;
            lowest.type = tileTypes.RIVER;
            lowest = getNextRiverTile(getNeighbours(lowest));

            i++;
        }
    };

    var getNextRiverTile = function(tiles) {
        var lowest = tiles[0];
        var i = 0;
        oldDirection = curDirection;
        tiles.forEach(function(tile) {
            if (tile.height < lowest.height) {
                lowest = tile;
                curDirection = i;
            }
            i++;
        });

        return lowest;
    };

    var getNeighbours = function(tile) {
        var r = new Array();

        r.push(getNeighbour(tile, Directions.N));
        r.push(getNeighbour(tile, Directions.E));
        r.push(getNeighbour(tile, Directions.S));
        r.push(getNeighbour(tile, Directions.W));
        r.push(getNeighbour(tile, Directions.NE));
        r.push(getNeighbour(tile, Directions.SE));
        r.push(getNeighbour(tile, Directions.SW));
        r.push(getNeighbour(tile, Directions.NW));

        return r;
    };

    var getNeighbour = function(tile, dir) {
        var x = tile.x;
        var y = tile.y;
        oldDirection = curDirection;

        switch(dir) {
            case Directions.N:
                if (y > 0) {
                    return tiles[x][y-1];
                } else {
                    return null;
                }
                break;
            case Directions.E:
                if (x < settings.mapWidth - 1) {
                    return tiles[x + 1][y];
                } else {
                    return null;
                }
                break;
            case Directions.S:
                if (y < settings.mapHeight - 1) {
                    return tiles[x][y + 1];
                } else {
                    return null;
                }
                break;
            case Directions.W:
                if (x > 0) {
                    return tiles[x-1][y];
                } else {
                    return null;
                }
                break;
            case Directions.NE:
                if (y > 0 && x < settings.mapWidth - 1) {
                    return tiles[x+1][y-1];
                } else {
                    return null;
                }
                break;
            case Directions.SE:
                if (y < settings.mapHeight - 1 && x < settings.mapWidth - 1) {
                    return tiles[x + 1][y + 1];
                } else {
                    return null;
                }
                break;
            case Directions.SW:
                if (y < settings.mapHeight - 1 && x > 0) {
                    return tiles[x - 1][y + 1];
                } else {
                    return null;
                }
                break;
            case Directions.NW:
                if (y > 0 && x > 0) {
                    return tiles[x - 1][y - 1];
                } else {
                    return null;
                }
                break;
        }
    };

    var setWater = function() {
        for (var x = 0; x < settings.mapWidth; x++) {
            for (var y = 0; y < settings.mapHeight; y++) {
                var h = tiles[x][y].height;
                if (h < settings.waterLevel) {
                    tiles[x][y].water = settings.waterLevel - h;
                } else {
                    tiles[x][y].water = 0;
                }
            }
        }
    };

    return {
        getTiles: function() {return tiles},
        build: build,
        setWater: setWater,
    }
}());

