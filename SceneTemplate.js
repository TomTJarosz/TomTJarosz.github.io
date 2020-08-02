
  async function init(ds, filters, title, l=10, h=150, s=300, m=50, fs="12px") {
    var s1 = 2 * s / 3;
    var svg = d3.selectAll("svg").attr("width", s).attr("height", 0 - (m/2)).style("font-size", fs).text(title);
    svg.append("text").attr("x", s/2).attr("y")
    var g = svg.append("g").attr("transform", "translate(" + m + "," + m + ")");
    var x = d3.scaleLog().base(10).domain([l,h]).range([0, s1]);
    var y = d3.scaleLog().base(10).domain([l,h]).range([s1, 0]);
    d3.select("svg").append("g").attr("transform", "translate(" + m + "," + m + ")").call(d3.axisLeft(y).tickValues([10, 20, 50, 100]).tickFormat(d3.format("~s")));
    d3.select("svg").append("g").attr("transform", "translate(" + m + "," + s - m + ")").call(d3.axisBottom(x).tickValues([10, 20, 50, 100]).tickFormat(d3.format("~s")));


    d3.csv(ds, function(data) {console.log(data);
      includeData = true;
      filters.forEach((f)=>{includeData = includeData && f(data)});
      if (includeData) {
        X = s1 * Math.log10(data["AverageCityMPG"] / l) / Math.log10(h/l)
        Y = s1 * Math.log10(data["AverageHighwayMPG"] / l) / Math.log10(h/l)
        g.append("circle").attr("cx",function(a) {return X;}).attr("cy", function (a) {return s1 -Y;}).attr("r", function(a) {return +data["EngineCylinders"] + 2;})
      }
    })
  }
