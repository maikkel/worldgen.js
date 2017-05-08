'use strict';
var mkNoise = require('./mkNoise.js');
var settings = require('./settings.js');
var dat = require('dat.gui/build/dat.gui.min.js');
var map = require('./map.js');
var mapRenderer = require('./mapRenderer.js');

module.exports = (function() {
    // GUI Setup
    var gui = new dat.GUI({  });

    // document.getElementById('settings').appendChild(gui.domElement);
    // console.log(settings);

    gui.add(settings, 'mapWidth').min(10).step(1).max(1000).onChange(function() {
        mapRenderer.resize();
        map.build();
        mapRenderer.draw(map);
    });
    gui.add(settings, 'mapHeight').min(10).step(1).max(1000).onChange(function() {
        mapRenderer.resize();
        map.build();
        mapRenderer.draw(map);
    });
    gui.add(settings, 'slowDraw');
    gui.add(settings, 'zoom').min(1).step(1).max(10).onChange(mapRenderer.zoom);
    gui.add(settings, 'waterLevel').min(0).step(1).max(255).onChange(function() {
        map.setWater();
        mapRenderer.draw(map);
    });

    var guiNoise = gui.addFolder('Noise');
    guiNoise.add(settings, 'seed').min(0).step(1).max(65536).onFinishChange(function() {
        mkNoise.setSeed(settings.seed);
        map.build();
        mapRenderer.draw(map);
    });
    guiNoise.add(settings, 'noiseOctaves').min(1).step(1).max(10).onChange(function() {
        mkNoise.setOctaves(settings.noiseOctaves);
        map.build();
        mapRenderer.draw(map);
    });
    guiNoise.add(settings, 'noiseFrequency').min(50).step(1).max(1000).onChange(function() {
        mkNoise.setFrequency(settings.noiseFrequency);
        map.build();
        mapRenderer.draw(map);
    });
    guiNoise.add(settings, 'noiseFrequencyFactor').min(0.3).step(.005).max(0.5).onChange(function() {
        mkNoise.setFrequencyFactor(settings.noiseFrequencyFactor);
        map.build();
        mapRenderer.draw(map);
    });
    guiNoise.add(settings, 'noiseAmplitudeFactor').min(0.4).step(.005).max(0.7).onChange(function() {
        mkNoise.setAmplitudeFactor(settings.noiseAmplitudeFactor);
        map.build();
        mapRenderer.draw(map);
    });
    guiNoise.open();

    var guiRender = gui.addFolder('Render');
    guiRender.add(settings, 'lightStrength').min(0).step(0.1).max(30).onChange(function() {
        mapRenderer.draw(map);
    });
    guiRender.open();
}());