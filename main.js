var svg = d3.select('svg');


width = +svg.attr("width"),
height = +svg.attr("height");

var format = d3.format(",d");

var valueColors = ['#468269','#00fffe','#0000fe','#ff00fe', '#fffc00', '#ff0000', '#e18231'];

var pack = d3.pack()
.size([800, 800])
.padding(1.5);

///////////////////////////////////////   Bubble   ////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// Dot  ////////////////////////////////////////////////////////////////////////////////////////////////////////

var xDomain;
var yDomain;

function onCategoryChanged() {
    var select = d3.select('#xSelect').node();
    // Get current value of select element
    xDomain= select.options[select.selectedIndex].value
    // Update chart
    var select1 = d3.select('#ySelect').node();
    // Get current value of select element, save to global chartScales
    yDomain = select1.options[select1.selectedIndex].value
    // Update chart
    
    updateChart(xDomain, yDomain);
}

var data;

var chartG = svg.append('g');

var xAxisG = chartG.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(50, 550)');

var yAxisG = chartG.append('g')
                    .attr('class', 'y axis')
                    .attr('transform', 'translate(950, 50)');

var transitionScale = d3.transition()
                        .duration(600)
                        .ease(d3.easeLinear);

/////////////////////////////////////////// Dot  ////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////   Bubble   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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





/////////////////////////   Bubble   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Dot  ////////////////////////////////////////////////////////////////////////////////

    data = classes;
    // x-axis
    xScale = d3.scaleLinear().range([900, 1400]);
    yScale = d3.scaleLinear().range([500, 0]);

    updateChart('Admission Rate','Admission Rate');
        
});

function updateChart(x, y){

    xScale.domain(d3.extent(data, function(d){
        return +d[x];
    })).nice();
    yScale.domain(d3.extent(data, function(d){
        return +d[y];
    })).nice();


        // Update the axes here first
    xAxisG.transition()
        .duration(750) // Add transition
        .call(d3.axisBottom(xScale));
    yAxisG.transition()
        .duration(750) // Add transition
        .call(d3.axisLeft(yScale));

    // Create and position scatterplot circles
    // User Enter, Update
    var dots = chartG.selectAll('.dot')
                        .data(data);

    var dotsEnter = dots.enter()
                        .append('g')
                        .attr('class', 'dot')
                        .on('mouseover', function(d){ // Add hover start event binding
                            // Select the hovered g.dot
                            var hovered = d3.select(this);
                            // Show the text, otherwise hidden
                            hovered.select('text')
                                .style('visibility', 'visible');
                            // Add stroke to circle to highlight it
                            hovered.select('circle')
                                .style('stroke-width', 2)
                                .style('stroke', '#333');
                        })
                        .on('mouseout', function(d){ // Add hover end event binding
                            // Select the hovered g.dot
                            var hovered = d3.select(this);
                            // Remove the highlighting we did in mouseover
                            hovered.select('text')
                                .style('visibility', 'hidden');
                            hovered.select('circle')
                                .style('stroke-width', 0)
                                .style('stroke', 'none');
                        });
    // Append a circle to the ENTER selection
    dotsEnter.append('circle')
            .attr('r', 2);

    // Append a text to the ENTER selection
    dotsEnter.append('text')
            .attr('y', -10)
            .text(function(d) {
                return d.Name;
            })
            .style('visibility', 'hidden')
            .style('fill', 'black');

            console.log(x);

    // ENTER + UPDATE selections - bindings that happen on all updateChart calls
    dots.merge(dotsEnter)
        .transition() // Add transition - this will interpolate the translate() on any changes
        .duration(750)
        .attr('transform', function(d) {
            // Transform the group based on x and y property
            var tx = xScale(d[x]);
            var ty = yScale(d[y]);
            return 'translate('+[tx+50, ty+50]+')';
        })
        .style('fill', function(d){
            if(d.Region == 'Far West') return '#00D7D7';
            if(d.Region == 'Great Lakes') return '#00AFAF';
            if(d.Region == 'Great Plains') return '#0080FF';
            if(d.Region == 'Mid-Atlantic') return '#2B00FF';
            if(d.Region == 'New England') return '#0000AF';
            if(d.Region == 'Outlying Areas') return '#8000FF';
            if(d.Region == 'Rocky Mountains') return '#FF00FF';
            if(d.Region == 'Southeast') return '#5D8896';
            if(d.Region == 'Southwest') return '#ACC4E6';
        });
}
////////////////////// Dot  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////




