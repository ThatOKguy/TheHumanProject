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
      populateHeader(object);
      populateMembers(object);
    }
    function populateHeader(obj)
    {
      var tileNumber = obj.TileNumber;

      const section = document.querySelector('section');
      const myH2 = document.createElement('h2');
      myH2.textContent = "TileNumber:" + tileNumber;
      section.appendChild(myH2);

      const para1 = document.createElement('p');
      var tileType = obj.Type;
      var tileTime = obj.Time;
      para1.textContent = "TileType:" + tileType +" // Year:" + tileTime;
      section.appendChild(para1);
    }

    function populateMembers(obj)
    {
      const section = document.querySelector('section');
      const time = obj.Time;
      const mem = memberLookup[time];
      const members = mem.Members;
      for (const member of members) {
        const myArticle = document.createElement('article');
        const myH2 = document.createElement('h2');
        const myPara1 = document.createElement('p');
        const myPara2 = document.createElement('p');
        const myList = document.createElement('ul');

        myH2.textContent = "Type:" + member.Type;
        myPara1.textContent = "Name:" + member.Name;
        myPara2.textContent = 'Position Coordinates:';

        const positions = member.Position;
        for (const position of positions) {
          const listItem = document.createElement('li');
          listItem.textContent = position + "m";
          myList.appendChild(listItem);
        }

        myArticle.appendChild(myH2);
        myArticle.appendChild(myPara1);
        myArticle.appendChild(myPara2);
        myArticle.appendChild(myList);

        section.appendChild(myArticle);
      }
    }

    function includesvg(obj)
    {
      const header = document.querySelector('header');
      const myArticle = document.createElement('article');
      const svgContainer = document.createElement('svgcontainer');
      const sphere = document.getElementById('ball');
      svgContainer.class = "parent";
      const time = obj.Time;
      const mem = memberLookup[time];
      const members = mem.Members;
      var boxWidth = 1000;
      var boxHeight = 1000;
      let res;
      let type;
      res = lookupDictionary[obj.Type];
      var back = Snap('#svg');
      back.image(res.url, 0, 0, boxWidth, boxHeight);
      var depth = 1;
      var id = 0;
      for (const member of members) {
        if(member.Depth == depth){
            type = member.Type;
            res = lookupDictionary[type];
            let xMeters = member.Position[0];
            let x = xMeters * 100 + boxWidth/2;
            let yMeters = member.Position[1];
            let y = yMeters * 100 + boxHeight/2;
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
