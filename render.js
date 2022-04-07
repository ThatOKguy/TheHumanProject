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
    let memberArray = [];
    let sortedMembers = [

    ];
    //used to create a deepcopy to avoid later call by reference errors
    let deepcopy = null;
    //used in loops to determine which values should be input into which position in the depth part of the function
    let id = 0;

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
        //get the array of members of the tile
        const members = tile.Members
    
        //declare a tile number which will be used to lookup the correct tile
        let tileName = tile.TileName;
        //use the tileName as a lookup for the spaceTimeLookup for the latitude, Longitude and time.
        coordinates = spaceTimeLookup[tileName];
        
        //create a for loop to loop through all of the different coordinates/times for the tile
        for(const tilePlacement of coordinates)
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
            r = geod.Inverse(latitude,longitude,latitude,tileLong);
            let xDistance = r.s12.toFixed(7);
            if (tileLong < longitude){
                xDistance = 0 - xDistance;
            }
            else{
                xDistance = 0 + xDistance;
            }
            //Work out the y distance to the tile
            r = geod.Inverse(latitude,longitude,tileLat,longitude);
            let yDistance = r.s12.toFixed(7);
            if (tileLat < latitude){
                yDistance = 0 - yDistance;
              }
              else{
                  yDistance = 0 + yDistance;
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
                //loop through the members to print them
                for (const member of members){
                    //get the displacement for the member compared to the tile
                    let xMeters = member.Position[0];
                    let x = xMeters * pixelScale/2 + tileMiddleX;
                    let yMeters = member.Position[1];
                    let y = yMeters * pixelScale/2 + tileMiddleY;

                    //create a deepcopy to remove call by reference errors
                    deepcopy = JSON.parse(JSON.stringify(member));
                    //set the positions as intended avoidind those call by reference errors from previous arrays
                    deepcopy.Position[0] = x;
                    deepcopy.Position[1] = y;
                    //add the member to the array at the end
                    memberArray[id] = deepcopy;
                    id++;
                }
            }
        }
    }
    //copy the member array into a new array to be sorted
    sortedMembers = memberArray;
    //Sort the array
    sortedMembers = sortedMembers.sort(function(a, b) {
        return parseFloat(a.Height) - parseFloat(b.Height);
    });
    
    //could also be presented in the format
    //sortedMembers.sort((a,b) => parseFloat(a.Height) - parseFloat(b.Height));

    //loop through the sorted members and print them to the screen
    for (sortedMember of sortedMembers){
        //get the type of the member then look for it in the iconDict (Icon Dictionary)
        type = sortedMember.Type;
        res = iconDict[type];
        
        xCoord = sortedMember.Position[0];
        yCoord = sortedMember.Position[1];

        //print the tile on screen using the snap object we have already declared on line 12
        //Use the snap obj to add the icon to the screen
        obj.image(res.url, xCoord, yCoord, res.Width/pixelScale, res.Length/pixelScale);
        //I can use my previous methods to calculate the distance in x and y to determine where to print the tile.
        id++;
    }     
}    