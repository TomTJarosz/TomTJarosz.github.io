function addAnn(x, y, message) {
  var margin = 50;
  var svg = d3.selectAll("svg");
  var mlen = message.length;
  var maxW = 50;
  var g = svg.append("g").attr("transform", "translate(" + margin.toString() + "," + margin.toString() + ")");
  var widthMultiplier = 3.9;
  var boxWidth = 10 +(mlen > maxW ? maxW * widthMultiplier : mlen * widthMultiplier);
  g.append("rect").attr("x",x + (boxWidth/2)).attr("y",y-8).attr("width", 16).attr("height", 16).attr("transform", "rotate(45,"+(x + (boxWidth/2)).toString()+","+(y-8).toString()+")").style("fill", "orange");

  g.append("rect").attr("x",x).attr("y",y).attr("width", boxWidth).attr("height", 5 + Math.ceil (mlen/maxW) * 10).style("fill", "orange");
  for (i=1; i<= Math.ceil (mlen/maxW); i++) {
    g.append("text").attr("x", 5 + x).attr("y", y + (10*i)).style("fill", "black").text(message.substring(maxW*(i-1), maxW*i)).style("font-size", "10px");
  }
}