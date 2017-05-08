'use strict';


var $ = require('jquery');

var settings = require('./settings.js');
var mkTimer = require('./mkTimer.js');
var mkNoise = require('./mkNoise.js');

var map = require('./map.js');
var mapRenderer = require('./mapRenderer.js');

var gui = require('./gui.js');


$( document ).ready(function() {
    init();
});

function init() {
    mkNoise.setSeed(settings.seed);
    mkNoise.setOctaves(settings.noiseOctaves);
    mkNoise.setFrequency(settings.noiseFrequency);
    mkNoise.setFrequencyFactor(settings.noiseFrequencyFactor);
    mkNoise.setAmplitudeFactor(settings.noiseAmplitudeFactor);

    mapRenderer.resize();
    map.build();
    mapRenderer.draw(map);


}
