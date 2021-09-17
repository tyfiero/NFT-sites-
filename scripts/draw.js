var imageSource;
var gifLength = 60 * 5; // <-- Last number controls how many seconds should be recorded when the button is pressed
var frameNum = 0;
// This variable controls which data set is the source
var imageSourceName = 'monthly';
var saveImagesMode = false; // Set to true to start saving

function draw() {
    // Set default for input
    if (frameCount === 1) {
        var dateSelector = document.querySelector('#date-selector');
        dateSelector.value = 'Year';
        var e = new Event('input', {
            value: 'Year'
        });
        dateSelector.dispatchEvent(e);
        var childSelector = document.querySelector('#dynamic-selectors').firstChild;
        childSelector.value = '2019';
        childSelector.dispatchEvent(e);
        // Setup imagemode
        if (saveImagesMode) {
            capturer.start();
            imageSource = Object.entries(data[imageSourceName]['adaOHLC'][0]);
        }
    }
    if (saveImagesMode && frameCount - 1 < imageSource.length) {
        if (frameCount % 300 === 0) {
            capturer.save(`${NFTnum}.png`);
            capturer.stop();
            capturer.start();
        }
        var OHLCdata = imageSource[frameCount - 1][1];
        dO = OHLCdata.open;
        dC = OHLCdata.close;
        dL = OHLCdata.low;
        dH = OHLCdata.high;
        dDate = OHLCdata.date;
        dColor = OHLCdata.color;
        mod1 = OHLCdata.mod1;
        mod2 = OHLCdata.mod2;
        rank = OHLCdata['%rank'];
        NFTnum = OHLCdata["NFT#"];
        timeType = OHLCdata.timeType;
    }
    if (isRecording && frameNum === 1) {
        WEBMCapturer.start();
    }
    if (paused) {
        noLoop();
    } else if (!paused) {
        loop();
    }
    noStroke();
    //--------Delta and percent math for text
    var deltaUp = dC - dO;
    var deltaRoundUp = deltaUp.toFixed(3);
    var deltaDown = dO - dC;
    var deltaRoundDown = deltaDown.toFixed(3);
    var percentUp = ((dC - dO) / dO) * 100;
    var percentRoundUp = percentUp.toFixed(2);
    var percentDown = ((dC - dO) / dO) * 100;
    var percentRoundDown = percentDown.toFixed(2);
    var percentHL = ((dH - dL) / dL) * 100;
    var percentRoundHL = percentHL.toFixed(2);
    //ratio of H/L % vs O/C % for doji math and to see if the O/C text needs formatting
    var ratioPercent;
    //direction variable to determine red or green candle
    var direction = dC - dO;
    if (direction > 0) {
        ratioPercent = (percentRoundUp / percentRoundHL);
    } else {
        ratioPercent = (percentRoundDown / percentRoundHL) * -1;
    }
    //This keeps ratioPercent always positive to avoid weird scenarios
    if (ratioPercent < 0) {
        ratioPercent = ratioPercent * -1;
    }

    //Color variable assigning from metadata
    if (dColor === 'rainbow') {
        startColor = 0;
        endColor = 359;
    } else if (dColor === 'blue') {
        startColor = 180;
        endColor = 280;
    } else if (dColor === 'green') {
        startColor = 80;
        endColor = 169;
    } else {
        startColor = 281;
        if (startColor = 359) {
            startColor = 0;
        }
        endColor = 49;
    }
    //Make color variable change over time
    colorAttribute = map(sin(frameCount * 0.01), -1, 1, startColor, endColor);
    //Text color
    textColor = 215;
    textSat = 80;
    textBright = 100;
    //dynamic backgrounds
    if (timeType === "4-Hour") {
        push();
        if (!rKey) {
            push();
            translate(0, 0, -200);
            scale(1.4);
            texture(neptune);
            plane(width, height);
            pop();
        }
        //display lines function from lines.js
        displayLines.lines();
        //draw simulated volume bars
        push();
        translate(-70, 600, -150);
        rotateX(30);
        var boxStart = frameCount / 200;
        var boxOff = 0;
        var barSize;
        var boxHMax;
        if (mod2 === 1) {
            barSize = 100;
            boxHMax = 300;
        } else if (mod2 === 2) {
            barSize = 50;
            boxHMax = 500;
        } else {
            barSize = 20;
            boxHMax = 800;
        }
        for (var x = -width / 2; x <= (width / 2) + 150; x += barSize) {
            push();
            var colH = map(cos(x * (frameCount / 30000)), -1, 1, -100, 100);
            colorAttribute = map(colH, -100, 100, startColor, endColor);
            var boxH = map(noise(boxOff + boxStart, boxOff + boxStart), 0, 1, 0, boxHMax);
            fill(colorAttribute, 100, 100, 0.3);
            stroke(0);
            translate(x, -50, -boxH / 2);
            box((barSize - barSize / 5), 25, boxH);
            pop();
            boxOff += 0.08;
        }
        pop();
    } else if (timeType === "Day") {
        if (!rKey) {
            push();
            translate(0, 0, -100);
            scale(1.15);
            texture(venus);
            plane(width, height);
            pop();
        }
        push();
        noiseDetail(1);
        translate(0, 0, -90);
        strokeWeight(0.5);
        stroke(0);
        //draw circular bg visuals
        beginShape();
        for (var i = 0; i < 360; i += 3) {
            push();
            rotate(4);
            var size = 100;
            var rad = 300;
            var x = rad * cos(i);
            var y = rad * sin(i);
            var xOff = map(cos(i), -1, 1, 0, 3);
            var yOff = map(sin(i), -1, 1, 0, 3);
            if (mod1 === "A") {
                size = 200;
            } else if (mod1 === "B") {
                xOff = map(cos(i), -1, 1, 0, 300);
                size = 150;
            } else if (mod1 === "C") {
                x = rad * sin(2 * i);
                size = 200;
            } else {
                y = rad * tan(i);
                size = 300;
            }
            var h = map(noise(xOff + wStart, yOff + wStart), 0, 1, -100, 300);
            colorAttribute = map(h, -100, 100, startColor, endColor);
            fill(colorAttribute, 100, 100, 0.8);
            translate(x, y);
            rotate(i);
            if (mod2 === 1) {
                rect(0, 0, h, size / 3);
            } else if (mod2 === 2) {
                triangle(0, 0, h, size, h, h / 4);
            } else {
                arc(h, 0, size, h, PI, TWO_PI);
            }
            pop();
        }
        wStart += 0.01;
        pop();
    } else if (timeType === "Week") {
        textColor = 215;
        textSat = 80;
        textBright = 100;
        if (!rKey) {
            push();
            translate(0, 0, -100);
            scale(1.15);
            texture(planetary);
            plane(width, height);
            pop();
        }
        push();
        if (mod1 === "A") {
            speed = 1;
            r1Min = map(sin(frameCount * 0.011), -1, 1, 50, 90);
        } else if (mod1 === "B") {
            speed = 2;
            r1Min = map(sin(frameCount * 0.028), -1, 1, 50, 300);
        } else if (mod1 === "C") {
            speed = 4;
            r1Min = map(tan(frameCount * 0.008), -1, 1, 50, 500);
        } else {
            speed = 8;
            r1Min = map(tan(frameCount * 0.009), -1, 1, 50, 120);
        }
        pop();
        push();
        translate(0, 0, -90);
        scale(2);
        //display week lines from lines.js
        displayWeekLines.perLines();
        pop();
    } else if (timeType === "Month") {
        if (!rKey) {
            push();
            translate(0, 0, -200);
            scale(1.3);
            texture(jupiter);
            plane(width, height);
        }
        pop();
        push();
        monthBG.monthBGDisplay();
        pop();
        //YEAR
    } else {
        if (!rKey) {
            push();
            translate(0, 0, -1400);
            scale(3.15);
            texture(moon);
            plane(width, height);
            pop();
        }
        push();
        noiseDetail(1);
        if (mod1 === "A") {
            translate(0, 950, -660);
            rotateX(60);
            rotateY(49.8);
            scale(1.01, 1.3);
        } else if (mod1 === "B") {
            translate(-400, 400, -660);
            rotateX(500.1);
            rotateY(10.1);
        } else if (mod1 === "C") {
            translate(0, 920, -1060);
            rotateX(500.04);
            rotateY(50);
            scale(1.01, 1.5);
        } else {
            scale(0.8);
            translate(0, 950, -1060);
            rotateX(500.1);
            rotateY(50);
        }
        stroke(0);
        strokeWeight(0.01);
        directionalLight([255], createVector(0, 0, -1));
        directionalLight([255], createVector(0, 110, -1));
        scale(2.1);
        var w = 21;
        var start = frameCount / 60;
        var xoffCube = 0;
        for (var x = -350; x <= width / 2; x += w) {
            var yoffCube = 0;
            for (var y = -50; y <= 500; y += (w)) {
                if (mod1 === "A") {
                    rotateZ(0.1);
                    rotateY(0.0009);
                } else if (mod1 === "B") {
                    rotateY(0.0031);
                } else if (mod1 === "C") {
                    rotateY(0.079);
                } else {
                    rotateY(1);
                }
                var h = map(noise(xoffCube + start, yoffCube + start), 0, 1, -100, 130);
                colorAttribute = map(x, -width / 2, width / 2, startColor, endColor);
                var s = map(y, -height / 2, height / 2, 500, 0);
                var b = map(h, -100, 100, 0, 500);
                push();
                fill(colorAttribute, s, b, 0.8);
                translate(x, y, -h / 2);
                if (mod2 === 1) {
                    box(w, h, h);
                } else if (mod2 === 2) {
                    cylinder(h, w, 5, 5);

                } else {
                    sphere(h, 6, 6);
                }
                pop();
                yoffCube += 0.2;
            }
            xoffCube += 0.008;
        }
        pop();
    }

    //logo rotation 
    spinSpeed = 0.009;
    clickedMap = map(mouseX, 0, 1000, 0.0001, 0.008);
    push();
    clicked = frameCount * clickedMap;
    released = frameCount * 0.003;
    pop();
    logoRotate = 0;
    //picks the high and low values of data
    var yMin = Math.min(...[dH, dO, dC, dL]);
    var yMax = Math.max(...[dH, dO, dC, dL]);

    //map data to canvas height
    var yH = map(dH, yMin, yMax, 450, -450);
    var yO = map(dO, yMin, yMax, 450, -450);
    var yC = map(dC, yMin, yMax, 450, -450);
    var yL = map(dL, yMin, yMax, 450, -450);

    if (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0) {
        //mouse click rotate candle
        if (!mouseIsPressed) {
            clickState = released;
            click = 0;
            camera(
                0,
                0,
                height / 2 / tan(PI / 6),
                0,
                0,
                0,
                0,
                1,
                0
            );
        } else {
            clickState = clicked;
            var cameraX = map(mouseX, 0, 1000, 500, -500);
            var cameraY = map(mouseY, 0, 1000, -500, 500);

            camera(
                0.08 * cameraX,
                0.08 * cameraY,
                height / 2 / tan(PI / 6),
                0,
                0,
                0,
                0,
                1,
                0
            );
        }

    } else {
        clickState = released;
        click = 0;
    }
    //Lines/labels
    stroke(255);
    strokeWeight(3);
    textSize(20);

    push();
    textSize(50);
    stroke(0, 100, 0);
    //symbol text
    fill(215, 100, 100);
    text(`${pair}`, -490, -450);

    fill(textColor, textSat, textBright);
    if (timeType === '4-Hour') {
        textSize(42);
    }
    push();
    stroke(0);
    strokeWeight(10);
    fill(200, 40, 100);
    text(`${dDate}`, -480, 480);
    pop();
    pop();
    //UP 3D candle draw
    if (direction > 0 && ratioPercent > 0.01) {
        push();
        textSize(25);
        fill(100, 0, 100);
        line(300, yC, 400, yC);
        fill(100, 100, 100);

        if (ratioPercent < 0.059) {
            text(`Close`, 356, yC - 8);
            text(`$${dC}`, 300, yC + 25);

            fill(100, 0, 100);
            text(` / `, 336, yC - 8);
            fill(100, 0, 70);

            text(`Open `, 280, yC - 8);
            text(`$${dO}`, 300, yC + 50);
            fill(100, 100, 100);

        } else {
            text(`$${dC}`, 310, yC + 25);
            text(`Close`, 325, yC - 8);

            line(300, yO, 400, yO);
            text(`$${dO}`, 310, yO + 25);
            text(`Open`, 322, yO - 8);
        }
        //high+low text
        line(410, yH, 500, yH);
        text(`$${dH}`, 400, yH + 25);
        text(`High`, 430, yH - 8);

        line(410, yL, 500, yL);
        text(`$${dL}`, 400, yL + 25);
        text(`Low`, 435, yL - 8);
        //reset stroke weight for candles
        strokeWeight(2);
        if (!transCand) {
            if (rank === "top 20-10%") {
                shader(myShader);
                myShader.setUniform("uPercentTexture", up1);
            } else if (rank === "top 10-2%") {
                shader(myShader);
                myShader.setUniform("uPercentTexture", up2);
            } else if (rank === "top 2%") {
                shader(myShader);
                myShader.setUniform("uPercentTexture", up3);
            } else {
                //color/light
                directionalLight(100, 0, 100, -200, 0, 0);
                pointLight(100, 0, 100, 100, 20, 100);
                pointLight(100, 0, 100, -100, 250, 100);
                var lightMapX = map(mouseX, 0, 1000, -500, 500);
                var lightMapY = map(mouseY, 0, 1000, -500, 500);
                pointLight(100, 0, 50, lightMapX, lightMapY, 80);
            }
        }
        //text, % & delta
        fill(100, 100, 100);
        textSize(35);
        text(`+${percentRoundUp}%`, -480, 435);
        textSize(25);
        text(`+$${deltaRoundUp}`, -477, 400);
        rotateY(clickState);

        ambientMaterial(125, 100, 100);
        stroke(0, 0, 0);
        //candle body
        push();
        if (transCand) {
            noFill();
            stroke(100, 100, 100);
            strokeWeight(0.5);
        }
        ambientLight(100, 0, 20);
        //moves candle to the middle of open/close
        translate(0, (yC + yO) / 2, 0);
        box(100, yC - yO, 100);
        pop();
        //---------wick-------------
        push();
        if (transCand) {
            noFill();
            stroke(100, 100, 100);
            strokeWeight(0.7);
        }
        ambientLight(100, 0, 30);
        translate(0, (yH + yL) / 2, 0); //moves wick to the middle of hi/low
        box(20, yH - yL, 20);
        pop();
        pop();
    }

    //DOWN 3D candle draw
    if (direction < 0 && ratioPercent > 0.01) {
        push();
        textSize(25);
        if (ratioPercent < 0.059 && timeType !== 'Year') {
            fill(100, 0, 100);
            line(300, yO, 400, yO);
            text(` / `, 336, yO - 8);
            fill(0, 100, 100);
            text(`Close`, 356, yO - 8);
            text(`$${dC}`, 300, yO + 50);
            fill(100, 0, 70);
            text(`Open `, 280, yO - 8);
            text(`$${dO}`, 300, yO + 25);
            fill(0, 100, 100);
        } else {
            fill(100, 0, 100);
            line(300, yC, 400, yC);
            line(300, yO, 400, yO);
            fill(0, 100, 100);
            text(`$${dC}`, 310, yC + 25);
            text(`Close`, 325, yC - 8);
            text(`$${dO}`, 310, yO + 25);
            text(`Open`, 322, yO - 8);
            fill(0, 100, 100);
        }
        //high +low text
        line(410, yH, 500, yH);
        text(`$${dH}`, 400, yH + 25);
        text(`High`, 430, yH - 8);
        line(410, yL, 500, yL);
        text(`$${dL}`, 400, yL + 25);
        text(`Low`, 435, yL - 8);
        strokeWeight(2);
        //DRAW PERCENT CONDITIONAL
        if (!transCand) {
            if (rank === "bottom 20-10%") {
                shader(myShader);
                myShader.setUniform("uPercentTexture", down1);
            } else if (rank === "bottom 10-2%") {
                shader(myShader);
                myShader.setUniform("uPercentTexture", down2);
            } else if (rank === "bottom 2%") {
                shader(myShader);
                myShader.setUniform("uPercentTexture", down3);
            } else {
                //-------color/light---------
                directionalLight(0, 0, 100, -200, 0, 0);
                pointLight(0, 0, 100, 100, 20, 100);
                pointLight(0, 0, 100, -100, 250, 100);
                lightMapX = map(mouseX, 0, 1000, -500, 500);
                lightMapY = map(mouseY, 0, 1000, -500, 500);
                pointLight(0, 0, 50, lightMapX, lightMapY, 80);
                ambientMaterial(0, 100, 100);
            }
        }
        fill(0, 100, 100);
        stroke(0, 0, 0);
        textSize(35);
        text(`${percentRoundDown}%`, -480, 435);
        textSize(25);
        text(`-$${deltaRoundDown}`, -477, 400);
        rotateY(clickState);

        //candle body
        push();
        if (transCand) {
            noFill();
            stroke(0, 100, 100);
            strokeWeight(0.7);
        }
        ambientLight(0, 0, 20);
        translate(0, (yC + yO) / 2, 0);
        box(100, yC - yO, 100);
        pop();
        //wick
        push();
        if (transCand) {
            noFill();
            stroke(0, 100, 100);
            strokeWeight(0.5);
        }
        ambientLight(0, 0, 30);
        translate(0, (yH + yL) / 2, 0);
        box(20, yH - yL, 20);
        pop();
        pop();
    }
    //DOJI 3D candle draw
    if (direction === 0 || ratioPercent <= 0.01) {
        push();
        strokeWeight(3);
        textSize(25);
        fill(100, 0, 100);
        line(300, yC, 400, yC);
        fill(220, 100, 100);
        text(`Open `, 280, yC - 8);
        text(`$${dO}`, 300, yC + 25);
        fill(200, 0, 100);
        text(` / `, 336, yC - 8);
        fill(200, 100, 100);
        text(`$${dC}`, 300, yC + 50);
        text(`Close`, 356, yC - 8);
        //high +low text
        line(410, yH, 500, yH);
        text(`$${dH}`, 400, yH + 25);
        text(`High`, 430, yH - 8);
        line(410, yL, 500, yL);
        text(`$${dL}`, 400, yL + 25);
        text(`Low`, 435, yL - 8);
        strokeWeight(2);
        // DOJI TEXT
        fill(200, 30, 100);
        textSize(30);
        text(`Doji!`, -360, 420);
        //color/light
        directionalLight(200, 0, 100, -200, 0, 0);
        pointLight(200, 0, 100, 100, 20, 100);
        pointLight(200, 0, 100, -100, 250, 100);
        fill(200, 100, 100);
        textSize(35);
        text(`+${percentRoundUp}%`, -480, 435);
        textSize(25);
        text(`+$${deltaRoundUp}`, -477, 400);
        rotateY(clickState);

        ambientMaterial(200, 100, 100);
        stroke(0, 0, 0);
        //candle body
        push();
        if (transCand) {
            noFill();
            stroke(200, 100, 100);
            strokeWeight(0.5);
        }
        ambientLight(100, 0, 100);
        translate(0, (yC + yO) / 2, 0);
        box(100, yC - yO, 100);
        pop();
        //wick
        push();
        if (transCand) {
            noFill();
            stroke(200, 100, 100);
            strokeWeight(0.7);
        }
        ambientLight(100, 0, 30);
        translate(0, (yH + yL) / 2, 0); //moves wick to the middle of hi/low
        box(20, yH - yL, 20);
        pop();
        pop();
    }
    //3D logo load
    if (1 > 0) {
        push();
        noStroke();
        translate(-300, -400, 0);
        scale(0.25);
        texture(logoTrademark);
        plane(50, 50);
        pop();
        push();
        translate(-380, -330, 10);
        noStroke();
        if (logoLocale > 0.6 || logoLocale < -0.1) {
            logoSpeed = logoSpeed * -1;
        }
        logoLocale = logoLocale + logoSpeed;
        if (!rKey) {
            rotateY(logoLocale);
        }
        var locX = mouseX - width / 2;
        var locY = mouseY - height / 2;
        lights();
        pointLight(220, 0, 100, locX, locY, 0);
        pointLight(220, 0, 100, locX, locY, 200);
        specularMaterial(220, 100, 70);
        shininess(100);
        //logoZoom
        if (mouseIsPressed) {
            if (mouseButton === CENTER || bigLogo) {
                translate(332 + (mouseX / 10), 285 + (mouseY / 10), 100);
                scale(4);
                var spinMap = map(mouseX, 0, 1000, -0.2, 0.2);
                var spinMapY = map(mouseY, 0, 1000, -0.2, 0.2);
                rotateY(spinMap);
                rotateX(-spinMapY);
                logoLocale = 0;
            }
        } else if (bigLogo) {
            translate(332 + (mouseX / 10), 285 + (mouseY / 10), 100);
            scale(4);
             spinMap = map(mouseX, 0, 1000, -0.2, 0.2);
             spinMapY = map(mouseY, 0, 1000, -0.2, 0.2);
            rotateY(spinMap);
            rotateX(-spinMapY);
            logoLocale = 0;
        } else {}
        fill(220, 100, 70);
        model(logo3D);
        pop();
        rotateLogo = rotateLogo - 0.01;
    }
    if (saveImagesMode) {
        if (frameCount - 1 < imageSource.length) {

            capturer.capture(canvas);
        } else if (frameCount - 1 === imageSource.length) {
            capturer.stop();
            capturer.save();
        }
    }
    if (isRecording) {
        if (frameNum < gifLength) {
            WEBMCapturer.capture(canvas);
            frameNum++;
            push();
            fill(255);
            textSize(80);
            translate(0, 0, 100);
            text(`Recording... ${frameNum} / ${gifLength}`, -width / 2 + 100, -height / 2 + 100, 400, 300);
            pop();

        } else if (frameNum === gifLength) {
            WEBMCapturer.save();
            WEBMCapturer.stop();
            isRecording = false;
            message = true;
            timeToWait = frameCount;
        }
    }
    if(message){
        var timeToWaitNum = timeToWait + 200;
        if(frameCount <= timeToWaitNum){
            gifMessage();
        }else{
            message = false;
        }
    }
}
