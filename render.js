//call the render function
render();
//have a function to initialize screen values and call the screen renderer
function render(){
    //create a string where the time is initialized
    //We could also use Date.today if it is appropriate
    timeString = '2000-01-01T00:00:00';
    //convert this strng into a date
    let cameraTime = new Date(timeString);
    //Create the snap object where lots of tiles will be drawn on
    //This will act as a Screen
    let screenSnap = Snap('#svg');
    //initialize a latitude
    let latitude = 0;
    //initialize a longitude
    let longitude = 0;
    //initialize the radius of the screen
    let radius = 50;
    //now that the variables have been initialized
    //call the method to render the screen
    renderScreen(latitude, longitude, cameraTime, radius, screenSnap);
}

function renderScreen(latitude, longitude, time, radius, obj){
    //declare an array of the members to be printed later by the snap object
    //in order of depth at the end of the function
    let memberArray = [

    ];
    //declare an array for the sorted members
    sortedMembers = [

    ];

    //initialize values so they can be used outside where their values are calculated
    //such as the sorted array function
    let tileMiddleX = 0,
    tileMiddleY = 0;

    //calculate the pixel scaling to be used later when adding tiles
    //declare the screen height in pixels
    let screenHeight = 1080;
    //declare the screen width in pixels
    let screenWidth = 1920;
    //get the hypotenuse of the screen
    let hypotenuseSquared = (screenHeight**2) + (screenWidth**2);
    let hypotenuse = Math.sqrt(hypotenuseSquared);
    //Now work out the radius of the screen
    let radPixels = hypotenuse/2;
    //finally calculate the pixel scale
    let pixelScale = (radPixels/radius).toFixed(2);
    //initialize the geodesic variable to use it's functions
    var geod = GeographicLib.Geodesic.WGS84, r;

    //now that this has been done loop through the tiles in the varible
    //tiles (formerly movies) which will be declared in a seperate js file.
    //I can loop throught the array of tile Names in the object tileNames.
    for(tName of tileNames){
        //I can the get the tile I want using the tile Name as a lookup
        tile = tiles[tName];

        //declare a tile number which will be used to lookup the correct tile
        let tileName = tile.TileName;
        //use the tileName as a lookup for the spaceTimeLookup for the latitude, Longitude and time.
        coordinates = spaceTimeLookup[tileName];

        //create a for loop to loop through all of the different coordinates/times for the tile
        for( const tilePlacement of coordinates)
        {
            //first check the position to see if the tiles position will be in the screens view
            //get the values on the tile use on the screen
            let tileLat = tilePlacement.Latitude,
            tileLong = tilePlacement.Longitude;
            //Use these to work out the geodesic distance and create a boolean to see if the tile can be displayed.
            let posChecker = false;
            //Declare the tile radius as a variable
            let tileRadius = tile.Radius;
            // Find the distance from the camera (0N, 0E) to
            // The tile (0N, 0.5W)...
            r = geod.Inverse(latitude, longitude, tileLat, tileLong);
            let geodesicDistance = r.s12.toFixed(2);
            let combinedDistance = radius + tileRadius;
            if (combinedDistance > geodesicDistance){
                posChecker =  true;
            }
            //Create a boolean value to see if the tile is visible and initialize it to false
            let timeChecker = false;
            //then check if the time is within the duration to see if the tile will be displayed
            //get the time of the tile in question which is held in the spaceTimeLookup
            let tileTime = new Date(tilePlacement.Time);
            let startTime = Date.parse(tileTime);
            //get the duration of the tile so that we can work out the endtime
            let duration = tile.Duration;
            //using duration calculate the end Time of the tile
            let endTime = tileTime.setDate(tileTime.getDate() + duration);
            //let the time of the screen/camera and parse it so it can be used in an if statement.
            let camTime = Date.parse(time);
            //using an if statement set the boolean value for is the screen is viewable relative to the time
            if (camTime >= startTime && camTime <= endTime){
                timeChecker = true;
            }

            //Get the size of the tiles height and width from the radius of the tile
            //Treat it as a square to make the calculations much simpler
            let tileHypotenuse = tileRadius * 2,
            //Use the pythagorus theorum
            tileHeightSquared = (tileHypotenuse**2)/2,
            tileHeight = Math.sqrt(tileHeightSquared)/2,
            //for a square tile the width and height will be the same
            tileWidth = tileHeight;
            //Get the tileHeight and with as pixel values
            let pixelHeight = tileHeight * pixelScale,
            pixelWidth = tileWidth * pixelScale;
            //Work out the x distance to the tile
            r = geod.Inverse(0,longitude,0,tileLong);
            let xDistance = r.s12.toFixed(7);
            if (tileLong < 0){
              xDistance = 0 - xDistance;
            }
            //Work out the y distance to the tile
            r = geod.Inverse(latitude,0,tileLat,0);
            let yDistance = r.s12.toFixed(7);
            if (tileLat < 0){
              yDistance = 0 - yDistance;
            }
            //Set the middle values fo a HD screen
            let middleX = 960,
            middleY = 540;
            //Calculate the x an y values of the tile
            let tileX = middleX + (xDistance * pixelScale),
            tileY = middleY + (yDistance * pixelScale);

            //Then create an if statement to see if these booleans are true.
            //If the are draw the tile
            //If not do nothing and move to the next tile.
            if(posChecker == true && timeChecker == true){
                //Create the background of the tile using the tile type
                back = iconDict[tile.Type];
                obj.image(back.url,tileX,tileY,pixelWidth,pixelHeight);

                //get the middle x and y values of the tile to be used when drawing members on the tile
                tileMiddleX = tileX + (pixelWidth/2),
                tileMiddleY = tileY + (pixelHeight/2);

                //get the array of members of the tile
                const members = tile.Members;

                //Initialize the sorted members array to empty so that it doesn't print
                //repeated things on different tiles
                sortedMembers = [

                ];
                memberArray = [

                ];
                //loop through the members to print them
                for (const member of members){


                    //add the member to the array at the start
                    memberArray.unshift(member);
                    //Sort the array
                    sortedMembers  = memberArray.sort(function(a, b) {
                        return parseFloat(a.Height) - parseFloat(b.Height);
                    });
                    //could also be presented in the format
                    //memberArray.sort((a,b) => parseFloat(a.Height) - parseFloat(b.Height));

                }
                console.log(sortedMembers);
                for (sortedMember of sortedMembers){
                    //get the type of the member then look for it in the iconDict (Icon Dictionary)
                    type = sortedMember.Type;
                    res = iconDict[type];
                    //get the displacement for the member compared to the tile
                    let xMeters = sortedMember.Position[0];
                    let x = xMeters * pixelScale/2 + tileMiddleX;
                    let yMeters = sortedMember.Position[1];
                    let y = yMeters * pixelScale/2 + tileMiddleY;
                    //print the tile on screen using the snap object we have already declared on line 12
                    //Use the snap obj to add the icon to the screen
                    obj.image(res.url, x, y, res.Width/pixelScale, res.Length/pixelScale);
                    //I can use my previous methods to calculate the distance in x and y to determine where to print the tile.
                }

            }

        }
    }
}
