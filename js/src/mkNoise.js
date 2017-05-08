module.exports = (function () {
    var n = noise;
    var noiseFunc = n.perlin2; //noise.simplex2 or noise.perlin2
    var octaves = 4;
    var frequency = 100;
    var frequencyFactor = .3;
    var amplitudeFactor = .5;


    var noiseVal;
    var curfrequency;
    var curAmplitude;

    function getNoise(x, y) {
        noiseVal = 0;
        curfrequency = frequency;
        curAmplitude = 1;
        for (var o = 0; o < octaves; o++) {
            noiseVal += (curAmplitude * noiseFunc(x / curfrequency, y / curfrequency));
            noiseVal = noiseVal / (1 + curAmplitude / 2);
            curfrequency *= frequencyFactor;
            curAmplitude *= amplitudeFactor;
        }
        noiseVal = Math.abs(noiseVal);
        noiseVal += ((amplitudeFactor * 0.7) * noiseFunc(x / (frequency / 3), y / (frequency / 3)));

        //console.log(noiseVal);
        return (noiseVal * -1) + 1;
    }

    return {
        setSeed: function(val) { n.seed(val); },
        setOctaves: function(val) { octaves = val; },
        setFrequency: function(val) { frequency = val; },
        setFrequencyFactor: function(val) { frequencyFactor = val; },
        setAmplitudeFactor: function(val) { amplitudeFactor = val; },
        noiseFunc: noiseFunc,
        getNoise: getNoise
    }
})();