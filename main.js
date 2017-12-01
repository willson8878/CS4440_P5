var svg = d3.select('svg');

width = +svg.attr("width"),
height = +svg.attr("height");


var format = d3.format(",d");

var valueColors = ['#468269','#00fffe','#0000fe','#ff00fe', '#fffc00', '#ff0000', '#e18231'];

var pack = d3.pack()
.size([750, 750])
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
        .attr("transform", function(d) { return "translate(" + d.x + "," + (d.y+65) + ")"; });

              
    node.append("circle")
        .attr("id", function(d) { return d.name+'_cir'; })
        .attr("r", function(d) { return d.r; })
        .style('opacity', 1)
        .style("fill", function(d) {
            if (d.data.Locale == "Large City") {
                return '#5F0500';
            } else if (d.data.Locale == "Mid-size City") {
                return '#731900';
            } else if (d.data.Locale == "Small City") {
                return '#913700';
            } else if (d.data.Locale == "Large Suburb") {
                return '#B95F00';
            } else if (d.data.Locale == "Mid-size Suburb") {
                return '#CD7300';
            } else if (d.data.Locale == "Small Suburb") {
                return '#E18700';
            } else if (d.data.Locale == "Fringe Town") {
                return '#F59B00';
            } else if (d.data.Locale == "Remote Town") {
                return '#FFB914';
            }else if (d.data.Locale == "Distant Town") {
                return '#FFCD28';
            } else if (d.data.Locale == "Fringe Rural") {
                return '#FFE13C';
            }else if (d.data.Locale == "Remote Rural") {
                return '#FFF550';
            }else if (d.data.Locale == "Distant Rural") {
                return '#FFFFA0';
            }
        });

  
    node.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.name; })
        .append("use")
        .attr("xlink:href", function(d) { return "#" + d.name; });
  
    // node.append("text")
    //     .attr("dy", ".3em")
    //     .style("text-anchor", "middle")
    //     .text(function(d) { return d.name.substring(0, d.r / 3); });
  
    node.append("title")
        .text(function(d) { return d.name + "\n" + format(d.value); });

    node.on('mouseover', function(d){ // Add hover start event binding
        
            // Select the hovered g.dot
            var hovered = d3.select(this);

            hovered.select('circle')
            .style('stroke-width', 3)
            .style('stroke', '#58D68D');

            var id = this.firstChild.getAttribute('id')
            id = id.slice(0, (id.length-4));

            

            svg.selectAll('circle').style('opacity', 0.05);

            console.log(document.getElementById(id+"_dot"));

            document.getElementById(id+"_dot").setAttribute('r', 6);
            document.getElementById(id+"_dot").setAttribute('stroke-width', 2);
            document.getElementById(id+"_dot").setAttribute('stroke', '#58D68D');
            

            document.getElementById(id+"_dot").style.opacity = 1;
            document.getElementById(id+"_cir").style.opacity = 1;

            d3.select(this).style('opacity', 1);

        })
        .on('mouseout', function(d){ 
            var hovered = d3.select(this);

            var id = this.firstChild.getAttribute('id')
            id = id.slice(0, (id.length-4));

            document.getElementById(id+"_dot").setAttribute('r', 3);
            document.getElementById(id+"_dot").setAttribute('stroke', null);

            d3.selectAll('circle').style('opacity', 1);
            // document.getElementById(id+"_dot").r = 3;
            hovered.select('circle')
            .style('stroke-width', 0)
            .style('stroke', 'none');

        })

    

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
    var dots = chartG.selectAll('.node')
                        .data(data);

    var dotsEnter = dots.enter()
                        .append('g')
                        .attr('class', 'node')
                        .on('mouseover', function(d){ // Add hover start event binding
                            // Select the hovered g.dot
                            var hovered = d3.select(this);


                            // Show the text, otherwise hidden
                            hovered.select('text')
                                .style('visibility', 'visible');
                            // Add stroke to circle to highlight it
                            hovered.select('circle')
                                .attr('r', 6)
                                .style('stroke-width', 2)
                                .style('stroke', '#58D68D');

                                var id = this.firstChild.getAttribute('id')
                                id = id.slice(0, (id.length-4));
                                        
                                svg.selectAll('circle').style('opacity', 0.05);

                                document.getElementById(id+"_cir").setAttribute('stroke-width', 3);
                                document.getElementById(id+"_cir").setAttribute('stroke', '#58D68D');



                    
                                document.getElementById(id+"_dot").style.opacity = 1;
                                document.getElementById(id+"_cir").style.opacity = 1;
                    
                        })
                        .on('mouseout', function(d){ 

                            d3.selectAll('.node').style('opacity', 1);
                            // Select the hovered g.dot
                            var hovered = d3.select(this);
                            // Remove the highlighting we did in mouseover
                            hovered.select('text')
                                .style('visibility', 'hidden');
                            hovered.select('circle')
                                .attr('r', 3)
                                .style('stroke-width', 0)
                                .style('stroke', 'none');

                            document.getElementById(id+"_cir").setAttribute('stroke', null);
                                
                        });
    // Append a circle to the ENTER selection
    dotsEnter.append('circle')
            .attr('r', 3)
            .attr("id", function(d) { return d.Name+'_dot'; });

    // Append a text to the ENTER selection
    dotsEnter.append('text')
            .attr('y', -10)
            .text(function(d) {
                return d.Name;
            })
            .style('visibility', 'hidden')
            .style('fill', 'black');


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
        .style("fill", function(d) {
            if (d.Locale == "Large City") {
                return '#5F0500';
            } else if (d.Locale == "Mid-size City") {
                return '#731900';
            } else if (d.Locale == "Small City") {
                return '#913700';
            } else if (d.Locale == "Large Suburb") {
                return '#B95F00';
            } else if (d.Locale == "Mid-size Suburb") {
                return '#CD7300';
            } else if (d.Locale == "Small Suburb") {
                return '#E18700';
            } else if (d.Locale == "Fringe Town") {
                return '#F59B00';
            } else if (d.Locale == "Remote Town") {
                return '#FFB914';
            }else if (d.Locale == "Distant Town") {
                return '#FFCD28';
            } else if (d.Locale == "Fringe Rural") {
                return '#FFE13C';
            }else if (d.Locale == "Remote Rural") {
                return '#FFF550';
            }else if (d.Locale == "Distant Rural") {
                return '#FFFFA0';
            }
        });
        
        
}

svg.select('#University of Central Florida_cir').style('fill', 'green');
////////////////////// Dot  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////  Brush  ///////////////////////////////////////////////////////////////////////////////////

function brushstart(cell) {
    // cell is the SplomCell object

    // Check if this g element is different than the previous brush
    if(brushCell !== this) {

        // Clear the old brush
        brush.move(d3.select(brushCell), null);


        // Save the state of this g element as having an active brush
        brushCell = this;
    }
}

function brushmove(cell) {
    // cell is the SplomCell object

    // Get the extent or bounding box of the brush event, this is a 2x2 array
    var e = d3.event.selection;
    if(e) {

        // Select all .dot circles, and add the "hidden" class if the data for that circle
        // lies outside of the brush-filter applied for this SplomCells x and y attributes
        svg.selectAll(".node")
            .classed("hidden", function(d){
                return e[0][0] > xScale(d[cell.x]) || xScale(d[cell.x]) > e[1][0]
                    || e[0][1] > yScale(d[cell.y]) || yScale(d[cell.y]) > e[1][1];
            });
    }
}

function brushend() {
    // If there is no longer an extent or bounding box then the brush has been removed
    if(!d3.event.selection) {
        // Bring back all hidden .dot elements
        svg.selectAll('.hidden').classed('hidden', false);

        // Return the state of the active brushCell to be undefined
        brushCell = undefined;
    }
}


