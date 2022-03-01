const movie =
{
    "TileNumber": 0,
    "Type": "GrassLand",
    "Latitude":-0.0001,
    "Longitude":0.0001,
    "Radius":5,
    "Time": "2000-01-01T00:00:00",
    "Duration":10,
    "Members":
    [
        {
          "Type":"House",
          "Name":"House1",
          "Height":2.25,
          "Width":2.0,
          "Depth":2,
          "Position":
          [
           -3,
            1.25
          ]
        },
        {
          "Type":"Person",
          "Name":"Jeromy",
          "Height":1.8,
          "Width":0.3,
          "Depth":1,
          "Position":
          [
            3.76,
            -1.87
          ]
        },
        {
          "Type":"Bird",
          "Name":"Stevie",
          "Height":0.2,
          "Width":0.35,
          "Depth":3,
          "Position":
          [
            0,
            0
          ]
        }
    ]
};
const memLookup =
{
    "2000-01-01T00:00:00":
    {
        "Members":
        [
          {
            "Type":"House",
            "Name":"House1",
            "Height":2.25,
            "Width":2.0,
            "Depth":2,
            "Position":
            [
              -5,
              -5
            ]
          },
          {
            "Type":"Person",
            "Name":"Jeromy",
            "Height":1.8,
            "Width":0.3,
            "Depth":1,
            "Position":
            [
              -2.76,
              -4.87
            ]
          },
          {
            "Type":"Bird",
            "Name":"Stevie",
            "Height":0.2,
            "Width":0.35,
            "Depth":3,
            "Position":
            [
              0,
              0
            ]
          }
        ]
    }
};
    var lookupDict =
    {
    "Fox":
    {
      "url":"SVG/Fox.svg",
      "Height":100,
      "Width":150
    },
    "Bird":
    {
      "url":"SVG/Bird.svg",
      "Height":100,
      "Width":150
    },
    "Person":
    {
      "url":"SVG/Person.svg",
      "Height":250,
      "Width":150
    },
    "House":
    {
      "url":"SVG/House.svg",
      "Height":200,
      "Width":250
    },
    "GrassLand":
    {
      "url":"SVG/Green.svg",
      "Height":200,
      "Width":150
    }
};
var geod = GeographicLib.Geodesic.WGS84, r;
let tileLat = movie.Latitude,
tileLong = movie.Longitude,
tileRadius = movie.Radius,
cameraLatitude = 0,
cameraLongitude = 0,
cameraRadius = 50;
let hypPixels = getScreenHypotenuse(1080,1920);
let radPixels = hypPixels/2;
let pixelScale = (radPixels/cameraRadius).toFixed(2);
setSize();
console.log(pixelScale);
let posChecker = checkPosition();
let timeChecker = checkTime();
getElapsedTime();
let x = calcXDistance();
let y = calcYDistance();
console.log(x);
console.log(y);

if(posChecker == true && timeChecker == true){
  setPosition(x, y);
}

function getScreenHypotenuse(height, width){
  let hypotenuseSquared = (height**2) + (width**2);
  console.log(hypotenuseSquared);
  let hypotenuse = Math.sqrt(hypotenuseSquared)
  console.log(hypotenuse);
  return hypotenuse;
}

function checkTime(){
    timeString = '2000-01-01T00:00:00';
    let cameraTime = new Date(timeString)
    memLookup[timeString];
    let camTime = Date.parse(cameraTime);
    var numberOfDaysToAdd = movie.Duration;
    let tileTime = new Date(movie.Time);
    let startTime = Date.parse(tileTime);
    let endDate = tileTime.setDate(tileTime.getDate() + numberOfDaysToAdd);
    if (camTime >= startTime && camTime <= endDate){
        return true;
    }
    return false;
}

function getElapsedTime() {
    // To test a function and get back its return
    let tileTime = new Date(movie.Time),
    nStartTime = Date.parse(tileTime),
    timeString = '2000-01-01T00:00:00',
    cameraTime = new Date(timeString),
    nEndTime = Date.parse(cameraTime),
    elapsedTime = nEndTime-nStartTime;
    console.log(`Elapsed time: ${ String(elapsedTime) } milliseconds`)
}

function checkPosition(){
    console.log(tileLat);
    console.log(tileLong);
    var geod = GeographicLib.Geodesic.WGS84, r;

    // Find the distance from the camera (0N, 0E) to
    // The tile (0N, 0.5W)...
    r = geod.Inverse(cameraLatitude, cameraLongitude, tileLat, tileLong);
    let geodesicDistance = r.s12.toFixed(2);
    console.log("The geodetic distance between the two points distance is " + geodesicDistance + " m.");
    let combinedDistance = cameraRadius + tileRadius;
    console.log("The distance between the camera center and the tile is " + combinedDistance + " m.");
    // This prints "The distance is 19959679.267 m."
    if (combinedDistance > geodesicDistance){
        return true;
    }
    // Find the point 20000 km SW of Perth, Australia (32.06S, 115.74E)...
    r = geod.Direct(-32.06, 115.74, 225, 20000e3);
    console.log("The position is (" + r.lat2.toFixed(8) + ", " + r.lon2.toFixed(8) + ").");
    // This prints "The position is (32.11195529, -63.95925278)."
    return false;
}

function calcXDistance(){
  console.log("This is the tile longitude: " + tileLong);
  console.log("This is the camera Longitude: " + cameraLongitude);
  r = geod.Inverse(0,cameraLongitude,0,tileLong);
  let xDistance = r.s12.toFixed(7);
  console.log("This is the geodesic distance for x: " + xDistance);
  if (tileLong < 0){
    xDistance = 0 - xDistance;
  }
  return xDistance;
}
function calcYDistance(){
  console.log("This is the tile latitude: " + tileLat);
  console.log("This is the camera latitude: " + cameraLatitude);
  r = geod.Inverse(cameraLatitude,0,tileLat,0);
  let yDistance = r.s12.toFixed(7);
  console.log("This is the geodesic distance for y: " + yDistance);
  if (tileLat < 0){
    yDistance = 0 - yDistance;
  }
  return yDistance;
}

function setPosition(x, y){
  let xPos = parseInt(x);
  let yPos = parseInt(y);
  let XPosition = xPos * pixelScale;
  let YPosition = yPos * pixelScale;
  let tile = document.getElementById("svg");
  tile.style.position = "relative";
  tile.style.left = XPosition;
  tile.style.top = YPosition;
}

function setSize(){
  let sideSquared = (tileRadius ** 2)/2;
  let squareSide = Math.sqrt(sideSquared);
  pixelSize = squareSide * pixelScale;
  let tile = document.getElementById("svg");
  tile.style.width = pixelSize;
  tile.style.height = pixelSize;
}
