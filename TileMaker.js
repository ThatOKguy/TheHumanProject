const movies =
    {
      "TileNumber": 0,
      "Type": "GrassLand",
      "Latitude":-90,
      "Longitude":90,
      "Radius":5,
      "Time": 2022,
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
    const memberLookup =
    {
      2022:
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
    var lookupDictionary =
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

    populate(movies);
    function populate(object)
    {
      includesvg(object);
    }

    function includesvg(obj)
    {
      if(posChecker == true && timeChecker == true){
      const header = document.querySelector('header');
      const myArticle = document.createElement('article');
      const svgContainer = document.createElement('svgcontainer');
      svgContainer.class = "parent";
      const time = obj.Time;
      const mem = memberLookup[time];
      const members = mem.Members;
      var boxWidth = 1000;
      var boxHeight = 1000;
      var screensizing = 100;
      let res;
      let type;
      let red = memberLookup[2022];
      res = lookupDictionary[obj.Type];
      var back = Snap('#svg');
      back.image(res.url, 0, 0, boxWidth, boxHeight);
      var depth = 1;
      for (const member of members) {
        if(member.Depth == depth){
            type = member.Type;
            res = lookupDictionary[type];
            let xMeters = member.Position[0];
            let x = xMeters * screensizing + boxWidth/2;
            let yMeters = member.Position[1];
            let y = yMeters * screensizing + boxHeight/2;
            var jsonSnap = Snap('#svg');
            jsonSnap.image(res.url, x, y, res.Width, res.Height);
        }
        else{
          var newdepth = depth;
          for (const newmember of members){
            if(newmember.Depth == newdepth){
              type = newmember.Type;
              res = lookupDictionary[type];
              let xMeters = newmember.Position[0];
              let x = xMeters * 100 + boxWidth/2;
              let yMeters = newmember.Position[1];
              let y = yMeters * 100 + boxHeight/2;
              var jsonSnap = Snap('#svg');
              jsonSnap.image(res.url, x, y, res.Width, res.Height);
            }
          }
        }
        depth = depth + 1;
      }
      header.appendChild(myArticle);
      }
    }
