let song;
let fft;
let position;
let velocity;
let acceleration;
let maxDiameter = 200; // Maximum diameter of the circle

function preload() {
    song = loadSound("https://github.com/Ronik22/Audio-Visualizer/blob/main/THE%20CIRCULAR%20WAVEFORM%202.mp3?raw=true");
}

function setup() {
    createCanvas(400, 400);
    fft = new p5.FFT();
    song.connect(fft);
    position = createVector(width / 2, height / 2);
    velocity = createVector();
    acceleration = createVector();
}

function draw() {
    background(0);

    if (getAudioContext().state !== 'running') {
        fill(255);
        text('Click to play the audio', 10, 20);
        return;
    }

    let spectrum = fft.analyze();
    let spectralCentroid = fft.getCentroid();

    noFill();
    stroke(0, 255, 0); // Green color for spectrum

    let len = spectrum.length / 2; // We'll only use half of the spectrum
    let step = TWO_PI / len;

    beginShape();
    for (let i = 0; i < len; i++) {
        let angle = step * i;
        let rad = map(spectrum[i], 0, 255, 40, maxDiameter); // Map the spectrum values
        let x = position.x + rad * cos(angle);
        let y = position.y + rad * sin(angle);
        vertex(x, y);
    }
    endShape(CLOSE);

    // Display the spectral centroid
    let nyquist = 22050;
    let mean_freq_index = spectralCentroid / (nyquist / spectrum.length);
    let centroidplot = map(log(mean_freq_index), 0, log(spectrum.length), 40, maxDiameter);
    fill(255, 0, 0); // Red color for centroid
    ellipse(position.x, position.y, centroidplot * 2);

    fill(255);
    text('Centroid: ' + round(spectralCentroid) + ' Hz', 10, height - 20);
}

function mousePressed() {
    if (song.isPlaying()) {
        song.stop();
    } else {
        userStartAudio(); // Required to start the audio context on browsers
        song.play();
    }
}

function mouseMoved() {
    // Map mouseY to control the maximum diameter of the circle
    maxDiameter = map(mouseY, 0, height, 50, 400);
}
