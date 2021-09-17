//PriceArt, generative art on Cardano! 
//Built by Ty Fiero, inspiration from Daniel Shiffman and Colorful Coding



var pair = "ADA/USD";
//color variables
var colorAttribute;
var startColor, endColor;
// //date variable for date text
// var inputData;
// var dateSelector;
// // // Global data variables
// // var data;
// // var dataPoints = [];
// Data variables
var dO, dH, dL, dC, dDate, dColor, mod1, mod2, NFTnum, timeType, rank;
//background variables
var bgDark;
var bgRed;
var bgPurple;
var bgTrees;
var pg;
var wStart = 1;
//percent shader variables
var emitter;
var img;
var myShader;
var up1;
var up2;
var up3;
var down1;
var down2;
var down3;
//monthly sin variables
var kMax = 10; // between 2-10
var scaleMax = 2; //between 0.6-2
var r1Min;
//other variable declarations
var logo;
var logoLocale = -0.004;
var logoSpeed = 0.004;
var logoTrademark;
var button;
var buttonZoom;
var buttonRefresh;
var buttonAlpha;
var buttonPause;
var logo3D;
var rotateLogo = 1;
var myFont;
//click variables
var clickState;
var clicked;
var spinSpeed;
var clickedMap;
var released;
var clickAlpha;
var clickStroke;
var bigLogo = false;
var transCand = false;
var rKey = false;
var paused = false;
//start variables for bg lines
var start1 = 0;
var start2 = 0;
var start3 = 0;
var start4 = 0;
var start5 = 0;
var inc;
//color variable for text
var textColor;
var textSat;
var textBright;
var dirColor;
var isRecording = false;
var message = false;
var timeToWait;

function preload() {
    // Data

     OHLCdata = loadJSON("data/5.json"),
 

    //font
    myFont = loadFont("https://arweave.net/-hnQ1l6qi8W82XdVBX0-cWatpQcLbN5TZ6-MRKHilRc");
    // //images
    moon = loadImage("https://oksfendlaida6jopynz3kone4hlgazcx4r3xav2spoa5o7f2dzla.arweave.net/cqRSNGsCBg8lz8NztTmk4dZgZFfkd3BXUnuB13y6HlY");
    venus = loadImage("https://si6obhn6jipv2pw3dijxpv5nhp6fdfaar6i4nkrr3tkjefunqjdq.arweave.net/kjzgnb5KH10-2xoTd9etO_xRlACPkcaqMdzUkhaNgkc");
    neptune = loadImage("https://sdbfddngouflnoaw3ulcbllatfpzzwby36cydxswpz7l6gih43ga.arweave.net/kMJRjaZ1Cra4Ft0WIK1gmV-c2DjfhYHeVn5-vxkH5sw");
    jupiter = loadImage("https://jyrfnwtiw3eaki7enu2lljtkigpnixty5ycsqrj7cvpj4isqp66q.arweave.net/TiJW2mi2yAUj5G00taZqQZ7UXnjuBShFPxVeniJQf70");
    planetary = loadImage("https://pqbynmdg4vtrqnj4vnxytbvkf6hxavqvjyagwkygztovbfmrowla.arweave.net/fAOGsGblZxg1PKtviYaqL49wVhVOAGsrBszdUJWRdZY");
    //3d logo
    logo3D = loadModel("assets/ada3d.obj", true);
    logoTrademark = loadImage("https://5yzjyswno5npllnoa4xmgb4xl3zzrfaaci6wrqxkkuhspplr52pa.arweave.net/7jKcSs13WvWtrgcuwweXXvOYlAASPWjC6lUPJ71x7p4");
    //shader preload
    myShader = loadShader("assets/percentshader.vert", "assets/percentshader.frag");
    up1 = loadImage("https://fowyqquowcpmynfhs4uhk45w35rurtnnvhushnwj327tc3rfkqma.arweave.net/K62IQo6wnsw0p5codXO232NIza2p6SO2yd6_MW4lVBg");
    up2 = loadImage("https://axzp6e4deb4qnbygd5cwpo6qgab7nxlbbs7vz4zdm2rxa2o2qhia.arweave.net/BfL_E4MgeQaHBh9FZ7vQMAP23WEMv1zzI2ajcGnagdA");
    up3 = loadImage("https://gtiafqa4c6bwq5xr6bnfaxjslp4rltm2evztua64pzkriorjazma.arweave.net/NNACwBwXg2h28fBaUF0yW_kVzZolczoD3H5VFDopBlg");
    down1 = loadImage("https://qgqbkujck7ljk5wcdshbrwrn5ddtc5mdjdn2aptqkaerwaxkxw2a.arweave.net/gaAVUSJX1pV2whyOGNot6McxdYNI26A-cFAJGwLqvbQ");
    down2 = loadImage("https://a27fi4qrhpuhz4lonzado4ytrhndcwpdwf5iizzueltnwq7ramma.arweave.net/Br5UchE76Hzxbm5AN3MTidoxWeOxeoRnNCLm20PxAxg");
    down3 = loadImage("https://lu3jhlxx4wnjknjoywjxgowwearnkgkk7h5lzxrl25jknijdjrxa.arweave.net/XTaTrvflmpU1LsWTczrWICLVGUr5-rzeK9dSpqEjTG4");
}
// Load meta-data into div
var metaDataNames = ['NFT #', 'Type', 'Date', '% Rank', 'Color', 'Loop Mod', 'Shape Mod'];

function loadMetaData(metaData) {
    var metaDataDiv = document.querySelector('#nft-meta-data');
    var cnv = document.querySelector('canvas');
    if (innerWidth > 1000) {
        metaDataDiv.style.height = `${cnv.style.height.slice(0, -2) - 200}px`;
        metaDataDiv.style.width = '350px';
    } else {
        metaDataDiv.style.height = '600px';
        metaDataDiv.style.width = '90vw';
    }
    metaDataDiv.innerHTML = '';
    var i = 0;
    for (val of Object.entries(metaData)) {
        if (['open', 'close', 'high', 'low'].includes(val[0])) {
            continue;
        } else {
            var text = val[1];
            var p = document.createElement('p');
            p.innerHTML = `<span class="meta-data-key">${metaDataNames[i]}:</span>
            <span class="meta-data-value">${text}</span>`
            metaDataDiv.appendChild(p);
        }
        i++;

    }
}



//FUNCTION SETUP
var cnv;

function setup() {
    cnv = createCanvas(1000, 1000, WEBGL);
    // Scale canvas
    if (window.innerWidth > 1000) {
        document.querySelector('canvas').style.height = `${innerHeight - 150}px`;
        document.querySelector('canvas').style.width = `${innerHeight - 150}px`;

    } else {
        document.querySelector('canvas').style.height = `${innerWidth - 70}px`;
        document.querySelector('canvas').style.width = `${innerWidth - 70}px`;
    }
    cnv.parent(document.querySelector('#canvas-and-metadata'));
    colorMode(HSB, 359, 100, 100, 1);
    textFont(myFont);
    //pauses sketch if runs for more than 5 minutes.
    setTimeout(timeOutPause, 300000);
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
    loadMetaData(OHLCdata);



    // const months = {
    //     '01': 'January',
    //     '02': 'February',
    //     '03': 'March',
    //     '04': 'April',
    //     '05': 'May',
    //     '06': 'June',
    //     '07': 'July',
    //     '08': 'August',
    //     '09': 'September',
    //     '10': 'October',
    //     '11': 'November',
    //     '12': 'December',
    // };
    // // When the dropdown date is selected, it changes the variable timeType
    // document.querySelector("#date-selector").oninput = function () {
    //     var e = document.getElementById("date-selector").value;
    //     parentElement = document.querySelector('#dynamic-selectors');
    //     parentElement.innerHTML = '';
    //     switch (e) {
    //         case 'Year':
    //             // Create year selector
    //             var selectYear = document.createElement('select');

    //             // Create first option
    //             var option = document.createElement('option');
    //             option.text = 'Year:';
    //             option.selected = true;
    //             selectYear.appendChild(option);
    //             parentElement.appendChild(selectYear);

    //             // Create other options
    //             for (year of Object.entries(data['yearly']['adaOHLC'][0])) {
    //                 var option = document.createElement('option');
    //                 option.text = year[0];
    //                 selectYear.appendChild(option);
    //                 parentElement.appendChild(selectYear);
    //             }
    //             // Update data variables
    //             selectYear.oninput = function () {
    //                 var OHLCdata = data['yearly']['adaOHLC'][0][selectYear.value];
    //                 dO = OHLCdata.open;
    //                 dC = OHLCdata.close;
    //                 dL = OHLCdata.low;
    //                 dH = OHLCdata.high;
    //                 dDate = OHLCdata.date;
    //                 dColor = OHLCdata.color;
    //                 mod1 = OHLCdata.mod1;
    //                 mod2 = OHLCdata.mod2;
    //                 rank = OHLCdata['%rank'];
    //                 NFTnum = OHLCdata["NFT#"];
    //                 timeType = OHLCdata.timeType;
    //                 loadMetaData(OHLCdata);
    //             };
    //             break;
    //         case 'Month':
    //             // Create year selector
    //             var selectYear = document.createElement('select');
    //             // Create first option
    //             var option = document.createElement('option');
    //             option.text = 'Year:';
    //             option.selected = true;
    //             selectYear.appendChild(option);;
    //             parentElement.appendChild(selectYear)
    //             // Create other options
    //             for (year of Object.entries(data['yearly']['adaOHLC'][0])) {
    //                 var option = document.createElement('option');
    //                 option.text = year[0];
    //                 selectYear.appendChild(option);
    //                 parentElement.appendChild(selectYear);
    //             }

    //             // Create month selector
    //             selectYear.oninput = function () {
    //                 var selectMonth = document.createElement('select');

    //                 // Clear parrent's inner html
    //                 parentElement.innerHTML = '';
    //                 parentElement.appendChild(selectYear);

    //                 // Create first option
    //                 var option = document.createElement('option');
    //                 option.text = 'Month:';
    //                 option.selected = true;
    //                 selectMonth.appendChild(option);
    //                 parentElement.appendChild(selectMonth);

    //                 // Create other options
    //                 for (month of Object.entries(data['monthly']['adaOHLC'][0])) {

    //                     if (month[0].slice(-4) === selectYear.value) {
    //                         var monthNum = month[0].slice(0, 2);
    //                         var option = document.createElement('option');
    //                         option.text = months[monthNum];
    //                         option.value = monthNum;
    //                         selectMonth.appendChild(option);
    //                         parentElement.appendChild(selectMonth);
    //                     }
    //                 }
    //                 selectMonth.oninput = function () {
    //                     var key = selectMonth.value + '/' + selectYear.value;
    //                     var OHLCdata = data['monthly']['adaOHLC'][0][key];
    //                     dO = OHLCdata.open;
    //                     dC = OHLCdata.close;
    //                     dL = OHLCdata.low;
    //                     dH = OHLCdata.high;
    //                     dDate = OHLCdata.date;
    //                     dColor = OHLCdata.color;
    //                     mod1 = OHLCdata.mod1;
    //                     mod2 = OHLCdata.mod2;
    //                     rank = OHLCdata['%rank'];
    //                     NFTnum = OHLCdata["NFT#"];
    //                     timeType = OHLCdata.timeType;
    //                     loadMetaData(OHLCdata);
    //                 }
    //             };
    //             break;
    //         case 'Week':
    //             // Create year selector
    //             var selectYear = document.createElement('select');
    //             // Create first option
    //             var option = document.createElement('option');
    //             option.text = 'Year:';
    //             option.selected = true;
    //             selectYear.appendChild(option);
    //             parentElement.appendChild(selectYear);
    //             // Create other options
    //             for (year of Object.entries(data['yearly']['adaOHLC'][0])) {
    //                 var option = document.createElement('option');
    //                 option.text = year[0];
    //                 selectYear.appendChild(option);
    //                 parentElement.appendChild(selectYear);
    //             }
    //             // Create week selector
    //             selectYear.oninput = function () {
    //                 var selectWeek = document.createElement('select');
    //                 // Clear parent's inner html
    //                 parentElement.innerHTML = '';
    //                 parentElement.appendChild(selectYear);
    //                 // Create first option
    //                 var option = document.createElement('option');
    //                 option.text = 'Week:';
    //                 option.selected = true;
    //                 selectWeek.appendChild(option);
    //                 parentElement.appendChild(selectWeek);
    //                 // Create other options
    //                 for (week of Object.entries(data['weekly']['adaOHLC'][0])) {
    //                     if (week[0].slice(0, 4) === selectYear.value) {
    //                         var weekNum = week[0].slice(5);
    //                         var option = document.createElement('option');
    //                         option.text = weekNum;
    //                         option.value = weekNum;
    //                         selectWeek.appendChild(option);
    //                         parentElement.appendChild(selectWeek);
    //                     }
    //                 }
    //                 // Update data variables
    //                 selectWeek.oninput = function () {
    //                     var key = selectYear.value + '-' + selectWeek.value;
    //                     var OHLCdata = data['weekly']['adaOHLC'][0][key];
    //                     dO = OHLCdata.open;
    //                     dC = OHLCdata.close;
    //                     dL = OHLCdata.low;
    //                     dH = OHLCdata.high;
    //                     dDate = OHLCdata.date;
    //                     dColor = OHLCdata.color;
    //                     mod1 = OHLCdata.mod1;
    //                     mod2 = OHLCdata.mod2;
    //                     rank = OHLCdata['%rank'];
    //                     NFTnum = OHLCdata["NFT#"];
    //                     timeType = OHLCdata.timeType;
    //                     loadMetaData(OHLCdata);
    //                 }
    //             }
    //             break;
    //         case 'Day':
    //             // Create day selector
    //             var selectDay = document.createElement('input');
    //             selectDay.type = 'date';
    //             selectDay.min = '2017-10-01';
    //             selectDay.max = '2021-08-31';
    //             parentElement.appendChild(selectDay);
    //             // Update data variables
    //             selectDay.oninput = function () {
    //                 var dateElements = selectDay.value.split('-');
    //                 var key = dateElements[1] + '/' + dateElements[2] + '/' + dateElements[0];
    //                 var OHLCdata = data['daily']['adaOHLC'][0][key];
    //                 dO = OHLCdata.open;
    //                 dC = OHLCdata.close;
    //                 dL = OHLCdata.low;
    //                 dH = OHLCdata.high;
    //                 dDate = OHLCdata.date;
    //                 dColor = OHLCdata.color;
    //                 mod1 = OHLCdata.mod1;
    //                 mod2 = OHLCdata.mod2;
    //                 rank = OHLCdata['%rank'];
    //                 NFTnum = OHLCdata["NFT#"];
    //                 timeType = OHLCdata.timeType;
    //                 loadMetaData(OHLCdata);
    //             }
    //             break;
    //         case '4-Hour':
    //             // Create day selector
    //             var selectDay = document.createElement('input');
    //             selectDay.type = 'date';
    //             selectDay.min = '2017-10-01';
    //             selectDay.max = '2021-08-31';
    //             parentElement.appendChild(selectDay);
    //             // Create 4hour selector
    //             selectDay.oninput = function () {
    //                 var select4Hour = document.createElement('select');
    //                 // Clear parrent's inner html
    //                 parentElement.innerHTML = '';
    //                 parentElement.appendChild(selectDay);
    //                 // Create first option
    //                 var option = document.createElement('option');
    //                 option.text = '4-Hour:';
    //                 option.selected = true;
    //                 select4Hour.appendChild(option);
    //                 parentElement.appendChild(select4Hour);
    //                 // Create other options
    //                 for (var i = 0; i < 24; i += 4) {
    //                     var option = document.createElement('option');
    //                     option.text = i;
    //                     select4Hour.appendChild(option);
    //                     parentElement.appendChild(select4Hour);
    //                 }
    //                 // Update data variables
    //                 select4Hour.oninput = function () {
    //                     var dateElements = selectDay.value.split('-');
    //                     var yearPart = dateElements[1] + '/' + dateElements[2] + '/' + dateElements[0];
    //                     var key = yearPart + '-' + select4Hour.value;
    //                     var OHLCdata = data['4hour']['adaOHLC'][0][key];
    //                     dO = OHLCdata.open;
    //                     dC = OHLCdata.close;
    //                     dL = OHLCdata.low;
    //                     dH = OHLCdata.high;
    //                     dDate = OHLCdata.date;
    //                     dColor = OHLCdata.color;
    //                     mod1 = OHLCdata.mod1;
    //                     mod2 = OHLCdata.mod2;
    //                     rank = OHLCdata['%rank'];
    //                     NFTnum = OHLCdata["NFT#"];
    //                     timeType = OHLCdata.timeType;
    //                     loadMetaData(OHLCdata);
    //                 };
    //             };
    //             break;
    //     };
    // };
    // Create buttons inside the settings div
    var parentElement = document.querySelector('#settings');
    if (window.innerWidth > 1000) {
        buttonRecord = createButton("<span class='material-icons'>radio_button_checked</span>");
        buttonRecord.mousePressed(() => {
            isRecording = true;
        });
        buttonRecord.style("font-size", "15px");
        buttonRecord.style("background-color", 100);
        buttonRecord.parent(parentElement);

        button = createButton("<span class='material-icons'>file_download</span>");
        button.mousePressed(saveImage);
        button.style("font-size", "15px");
        button.style("background-color", 100);
        button.parent(parentElement);
    }
    buttonPause = createButton("<span class='material-icons'>pause</span>");
    buttonPause.mousePressed(pause);
    buttonPause.addClass('button-pause');
    buttonPause.style("font-size", "15px");
    buttonPause.style("background-color", 100);
    buttonPause.parent(parentElement);

    buttonZoom = createButton("<span class='material-icons'>zoom_in</span>");
    buttonZoom.mousePressed(logoZoom);
    buttonZoom.style("font-size", "15px");
    buttonZoom.style("background-color", 100);
    buttonZoom.parent(parentElement);

    buttonAlpha = createButton("<span class='material-icons'>view_in_ar</span>");
    buttonAlpha.mousePressed(transparentCandle);
    buttonAlpha.style("font-size", "15px");
    buttonAlpha.style("background-color", 100);
    buttonAlpha.parent(parentElement);

    buttonRefresh = createButton("<span class='material-icons'>wallpaper</span>");
    buttonRefresh.mousePressed(rButton);
    buttonRefresh.style("font-size", "15px");
    buttonRefresh.style("background-color", 100);
    buttonRefresh.parent(parentElement)

    function timeOutPause(){
        paused = true;    
        document.querySelector('.button-pause').innerHTML = '<span class="material-icons">play_arrow</span>';
        }
};

function saveImage() {
    save(`${dDate} ADAUSD.png`);
}

function logoZoom() {
    if (!bigLogo) {
        bigLogo = true;
    } else {
        bigLogo = false;
    }
}

function transparentCandle() {
    if (!transCand) {
        transCand = true;
    } else {
        transCand = false;
    }
}

function keyPressed() {
    if (key === 'r' && !rKey) {
        rKey = true;
    } else {
        rKey = false;
    }
}

function rButton() {
    if (!rKey) {
        rKey = true;
    } else {
        rKey = false;
    }
}

function checkLoop() {
    if (this.checked()) {
        loop();
    } else {
        noLoop();
    }
}

function gifMessage() {
    push();
    colorAttribute = map(sin(frameCount * 0.01), -1, 1, startColor, endColor);
    fill(colorAttribute, 100, 100);
    translate(0, 0, 100);
    textSize(40);
    text("Please be patient, gif export\ncan take a few minutes after \nrecording to download.", -420, -180);
    pop();
}

function pause() {
    if (!paused) {
        paused = true;
        document.querySelector('.button-pause').innerHTML = '<span class="material-icons">play_arrow</span>';
        noLoop();

    } else {
        paused = false;
        document.querySelector('.button-pause').innerHTML = '<span class="material-icons">pause</span>';
        loop();
    }
}