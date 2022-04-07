//sample tile definition of a person entering there house
const tiles = 
{
//I have included an array of 2 tiles so that in the guide the person following will know how arrays work
//and it should be much less of a step to add a third tile than to change it to an array and add a second
    "Housing1":{
        //Each tile has a unique iterable number index starting at 0
        //This will be used to search the array
        "TileName":"Housing1",
        //This will be used to represent the landscape, (e.g. mountainous or sea)
        //I will decide the values using the wwf terrestrial ecoregions of the world to determine the area types
        "Type": "GrassLand",
        //Radius of the tile
        "Radius":5,
        //Duration the tile will be displayed. Currently in days.
        "Duration":10,
        //Array of members located on the tile.
        "Members":
        [
            {
                //Type is used in the lookup table to get the icon of the member
                "Type":"House",
                //Name may be used as a unique identifier if it is needed in future to 
                //determine between different tile members of the same type
                "Name":"House1",
                //Length of the icon
                "Length":2.25,
                //Width of the icon
                "Width":2.0,
                //Correlates to the real life height of the member
                //The higher depth gets displayed first
                "Height":2.3,
                "Position":
                [
                    //x position in meters
                    -2,
                    //y position in meters
                    1.25
                ]
            },
            {
                //same as the first member
                "Type":"Person",
                "Name":"Jeromy",
                "Length":1.8,
                "Width":0.3,
                "Height":3.8,
                "Position":
                [
                  2.5,
                  -1.87
                ]
            },
            {
                //same as the first member
                "Type":"Bird",
                "Name":"Stevie",
                "Length":0.2,
                "Width":0.35,
                "Height":0.3,
                "Position":
                [
                    0,
                    0
                ]
            }
        ]
    },
    "Hunting1":{
        //a second tile dscribing a fox chasing a bird
        "TileName": "Hunting1",
        "Type": "GrassLand",
        "Radius":5,
        "Duration":15,
        "Members":
        [
            {
                "Type":"Bird",
                "Name":"Stevie",
                "Length":0.2,
                "Width":0.35,
                "Height":3,
                "Position":
                [
                    0,
                    0
                ]
            },
            {
                "Type":"Fox",
                "Name":"Fox",
                "Length":1.8,
                "Width":0.3,
                "Height":1,
                "Position":
                [
                  2.76,
                  -1.87
                ]
            }
        ]
    }
};