
  async function init(dataSource, filters, title, collectOn="", lowRange=10, highRange=150, size=300, margin=50, fontSize="12px") {
    var s1 = 2 * size / 3;
    var svg = d3.selectAll("svg").attr("width", size).attr("height", size);
    svg.append("text").attr("x", size / 2).attr("y", margin / 2).style("font-size", fontSize).text(title);
    var g = svg.append("g").attr("transform", "translate(" + margin.toString() + "," + margin.toString() + ")");
    var x = d3.scaleLog().base(10).domain([lowRange,highRange]).range([0, s1]);
    var y = d3.scaleLog().base(10).domain([lowRange,highRange]).range([s1, 0]);
    d3.select("svg").append("g").attr("transform", "translate(" + margin.toString() + "," + margin.toString() + ")").call(d3.axisLeft(y).tickValues([10, 20, 50, 100]).tickFormat(d3.format("~s")));
    d3.select("svg").append("g").attr("transform", "translate(" + margin.toString() + "," + (size - margin).toString() + ")").call(d3.axisBottom(x).tickValues([10, 20, 50, 100]).tickFormat(d3.format("~s")));
    var collectMap = {};
    d3.csv(dataSource, function(data) {console.log(data);
      var includeData = true;
      filters.forEach((f)=>{includeData = includeData && f(data)});
      if (includeData) {
        if (collectOn != "") {
          var key = data[collectOn];
          var collection = key in collectMap ? collectMap[key] : [];
          collection.push(data);
          collectMap[key] = collection;
        } else {
          X = s1 * Math.log10(data["AverageCityMPG"] / lowRange) / Math.log10(highRange/lowRange)
          Y = s1 * Math.log10(data["AverageHighwayMPG"] / lowRange) / Math.log10(highRange/lowRange)
          g.append("circle").attr("cx",function(a) {return X;}).attr("cy", function (a) {return s1 -Y;}).attr("r", function(a) {return +data["EngineCylinders"] + 2;})
        }
      }
    })
    if (collectOn != "") {
      var numKeys = collectMap.length;
      var i = 0;
      for (key in collectMap) {
        var collection = collectMap[key];
        var meanCityMPG = 0;
        var len = collection.length;
        _.pluck(collection, "AverageCityMPG").forEach((v)=>{meanCityMPG = meanCityMPG + v;})
        meanCityMPG = meanCityMPG / len;
        var meanHighwayMPG = 0;
        _.pluck(collection, "AverageHighwayMPG").forEach((v)=>{meanHighwayMPG = meanHighwayMPG + v;})
        meanHighwayMPG = meanHighwayMPG / len;
        var meanNumCyls = 0;
        _.pluck(collection, "EngineCylinders").forEach((v)=>{meanNumCyls = meanNumCyls + v;})
        meanNumCyls = meanNumCyls / len;

        X = s1 * Math.log10(meanCityMPG / lowRange) / Math.log10(highRange/lowRange);
        Y = s1 * Math.log10(meanHighwayMPG / lowRange) / Math.log10(highRange/lowRange);
        g.append("circle").attr("cx",function(a) {return X;}).attr("cy", function (a) {return s1 -Y;}).attr("r", function(a) {return +meanNumCyls + 2;}).style("fill",function() {return "hsl(" + (360 * i / numKeys).toString() + ", 100%, 50%)";});
        svg.append("circle").attr("cx",s1).attr("cy",i * 15).attr("r", 2).style("fill", function() {return "hsl(" + (360 * i / numKeys).toString() + ", 100%, 50%)";});
        svg.append("text").attr("x", s1 + 15).attr("y", i * 15).text(key).style("font-size", "12px").attr("alignment-baseline", "middle");
        i = i + 1;
      }
    }
  }
