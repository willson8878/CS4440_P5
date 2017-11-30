var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var format = d3.format(",d");

var valueColors = ['#468269','#00fffe','#0000fe','#ff00fe', '#fffc00', '#ff0000', '#e18231'];

var pack = d3.pack()
    .size([800, 800])
    .padding(1.5);

d3.csv("./data/colleges.csv", function(d) {
  d.value = +d.UndergradPopulation;
  d.local = d.Locale
  if (d.value) return d;
}, function(error, classes) {
  if (error) throw error;

  var root = d3.hierarchy({children: classes})
      .sum(function(d) { return d.value; })
      .sort(function(a, b) { return b.value - a.value; })
      .each(function(d) {
        if (name = d.data.Name) {
          var name, i = name.lastIndexOf(".");
          d.name = name;
          d.package = name.slice(0, i);
          d.class = name.slice(i + 1);
        }
      });

  var node = svg.selectAll(".node")
    .data(pack(root).leaves())
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("circle")
      .attr("id", function(d) { return d.name; })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) {
      	if (d.data.Locale == "Mid-size City") {
      		return valueColors[0];
      	} else if (d.data.Locale == "Remote Town") {
      		return valueColors[1];
      	} else if (d.data.Locale == "Large Suburb") {
      		return valueColors[2];
      	} else if (d.data.Locale == "Distant Town") {
      		return valueColors[3];
      	} else if (d.data.Locale == "Small City") {
      		return valueColors[4];
      	} else if (d.data.Locale == "Fringe Town") {
      		return valueColors[5];
      	} else if (d.data.Locale == "Large City") {
      		return valueColors[6];
      	}
      });

  node.append("clipPath")
      .attr("id", function(d) { return "clip-" + d.name; })
    .append("use")
      .attr("xlink:href", function(d) { return "#" + d.name; });

  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.name.substring(0, d.r / 3); });

  node.append("title")
      .text(function(d) { return d.name + "\n" + format(d.value); });
});
