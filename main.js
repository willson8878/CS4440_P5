var svg = d3.select('svg');

width = +svg.attr("width"),
height = +svg.attr("height");

var colors = ['#5F0500', '#731900', '#913700', '#B95F00', '#CD7300','#E18700', '#F59B00', '#FFB914', '#FFCD28','#FFE13C', '#FFF550','#FFFFA0'];
var format = d3.format(",d");


var pack = d3.pack()
.size([750, 750])
.padding(1.5);

var bubble = {width:750, height:750, padding:65};

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
                    .attr('transform', 'translate(150, 550)');

var yAxisG = chartG.append('g')
                    .attr('class', 'y axis')
                    .attr('transform', 'translate(1050, 50)');

var transitionScale = d3.transition()
                        .duration(600)
                        .ease(d3.easeLinear);

/////////////////////////////////////////// Dot  ////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////   Bubble   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





d3.csv('./data/colleges.csv', 
function(error, classes) {
    if(error) {
        console.error('Error while loading ./colleges.csv dataset.');
        console.error(error);
        return;
    } 

    svg.selectAll('rect')
        .data(colors)
        .enter().append('rect')
        .attr('y', function(d,i){
            return  150 + i* 22;
        })
        .attr('x', 900)
        .attr('height', 20)
        .attr('width', 20)
        .style('fill', function(d, i){
            return colors[i];
        })

    svg.selectAll('text')
        .data(colors)
        .enter()
        .append('text')
        .attr('y', function(d,i){
            return  160 + i* 22;
        })
        .attr('x', 960)
        .text(function(d,i){
            if (colors[i] === '#5F0500') return "Large City";
            if (colors[i] === '#731900') return "Mid-size City";
            if (colors[i] === '#913700') return "Small City";
            if (colors[i] === '#B95F00') return "Large Suburb";
            if (colors[i] === '#CD7300') return "Mid-size Suburb";
            if (colors[i] === '#E18700') return "Small Suburb";
            if (colors[i] === '#F59B00') return "Fringe Town";
            if (colors[i] === '#FFB914') return "Remote Town";
            if (colors[i] === '#FFCD28') return "Distant Town";
            if (colors[i] === '#FFE13C') return "Fringe Rural";
            if (colors[i] === '#FFF550') return "Remote Rural";
            if (colors[i] === '#FFFFA0') return "Distant Rural";

        })

    // label for graph
    svg.selectAll(".label")
        .data(['A','B'])
        .enter().append("g")
        .attr("class", "label")
        .append("text")
        .attr('y', '50')
        .attr('x', function(d,i){
            return 300 + (i * 460);
        })
        .text(function(d,i){
            if (i == 0) return 'Private Universities';
            if (i == 1) return 'Public Universities'; 
        })
        .style("font-size",  '25px')

        


    d3.select("#Highest_Degree").on('click', function(){

        simulation
        .force("forceX", d3.forceX(function(d){
            if (d['Highest Degree'] === "3") return 205;
            return 500;
        }).strength(.5))
        .force("forceY", d3.forceY(bubble.height/2 + bubble.padding + 20).strength(.25))
        .force("charge", d3.forceManyBody())
        .alphaTarget(.1)
        .restart();

        // clear label
        svg.selectAll(".label").remove();
        // label for graph
        svg.selectAll(".label")    
            .data(['A','B'])
            .enter().append("g")
            .attr("class", "label")
            .append("text")
            .attr('x', function(d,i){
                if (i == 0) return '150';
                if (i == 1) return '800'; 
            })
            .attr('y', function(d,i){
                if (i == 0) return '200';
                if (i == 1) return '40'; 
            })
            .text(function(d,i){
                if (i == 0) return '3 Highest Degree';
                if (i == 1) return '4 Highest Degree'; 
            })
            .style("font-size",  '25px')
    })

    d3.select("#Control").on('click', function(){
        simulation
        .force("forceX", d3.forceX(function(d){
            if (d.Control === "Private") return 225;
            return 500;
        }).strength(.5))
        .force("forceY", d3.forceY(bubble.height/2 + bubble.padding + 40).strength(.25))
        .force("charge", d3.forceManyBody())
        .alphaTarget(.1)
        .restart();

        // clear label
        svg.selectAll(".label").remove();
        // lable for graph
        svg.selectAll(".label")
            .data(['A','B'])
            .enter().append("g")
            .attr("class", "label")
            .append("text")
            .attr('y', '50')
            .attr('x', function(d,i){
                return 300 + (i * 460);
            })
            .text(function(d,i){
                if (i == 0) return 'Private Universities';
                if (i == 1) return 'Public Universities'; 
            })
            .style("font-size",  '25px')



    })

    d3.select("#Region").on('click', function(){
        simulation
        .force("forceX", d3.forceX(function(d){
            if (d.Region === "Far West") return 225;
            if (d.Region === "Great Lakes") return 450;
            if (d.Region === "Great Plains") return 675;
            if (d.Region === "Mid-Atlantic") return 225;
            if (d.Region === "New England") return 450;
            if (d.Region === "Outlying Areas") return 675;
            if (d.Region === "Rocky Mountains") return 225;
            if (d.Region === "Southeast") return 450;
            if (d.Region === "Southwest") return 700;
        }).strength(.6))
        .force("forceY", d3.forceY(function(d){
            if (d.Region === "Far West") return 225;
            if (d.Region === "Great Lakes") return 225;
            if (d.Region === "Great Plains") return 225;
            if (d.Region === "Mid-Atlantic") return 450;
            if (d.Region === "New England") return 450;
            if (d.Region === "Outlying Areas") return 450;
            if (d.Region === "Rocky Mountains") return 675;
            if (d.Region === "Southeast") return 675;
            if (d.Region === "Southwest") return 675;
        }).strength(.6))
        .force("charge", d3.forceManyBody())
        .alphaTarget(.1)
        .restart();

        // clear label
        svg.selectAll(".label").remove();

        // lable for graph --initial
        svg.selectAll(".label")
        .data(['A','B','A','B','A','B','A','B','B'])
        .enter().append("g")
        .attr("class", "label")
        .append("text")
        .attr('x', function(d,i){
            if (i == 0) return '150';
            if (i == 1) return '450'; 
            if (i == 2) return '750';
            if (i == 3) return '150'; 
            if (i == 4) return '450';
            if (i == 5) return '750'; 
            if (i == 6) return '150';
            if (i == 7) return '450'; 
            if (i == 8) return '770'; 
        })
        .attr('y', function(d,i){
            if (i == 0) return '300';
            if (i == 1) return '330'; 
            if (i == 2) return '330';
            if (i == 3) return '650'; 
            if (i == 4) return '565';
            if (i == 5) return '550'; 
            if (i == 6) return '875';
            if (i == 7) return '955'; 
            if (i == 8) return '890'; 
        })
        .text(function(d,i){
            if (i == 0) return 'Far West';
            if (i == 1) return 'Great Lakes'; 
            if (i == 2) return 'Great Plains';
            if (i == 3) return 'Mid-Atlantic'; 
            if (i == 4) return 'New England';
            if (i == 5) return 'Outlying Areas'; 
            if (i == 6) return 'Rocky Mountains';
            if (i == 7) return 'Southeast'; 
            if (i == 8) return 'Southwest'; 
        })
        .style("font-size",  '25px')
    })



    var radius = d3.scaleSqrt()
                    .domain(d3.extent(classes, function(d){return +d.UndergradPopulation}))
                    .range([5,30]);

    var forceX = d3.forceX(function(d){
                            if (d.Control === "Private") return 225;
                            return 500;
                        }).strength(.5);
    var forceY = d3.forceY(bubble.height/2 + bubble.padding + 20).strength(.25);


    var simulation = d3.forceSimulation(classes)
                        .force("forceX", forceX)
                        .force("forceY", forceY)
                        .force("collide", d3.forceCollide(function(d){
                            return radius(d.UndergradPopulation)
                        }))
                        .force("charge", d3.forceManyBody());

    var node = svg.selectAll(".node")
                  .data(classes)
                  .enter().append("g")
                  .attr("class", "node")
                  .append("circle")
                  .attr("id", function(d) { return d.Name+'_cir'; })
                  .attr("r", function(d){return radius(d.UndergradPopulation)})
                  .style('opacity', 1)
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
                    })
                    .attr("transform", "translate(0,0 )");

                

              

    
    simulation.nodes(classes)
            .on('tick', function(d) {
                node.attr('cx', function(d){return d.x;})
                    .attr('cy', function(d){return d.y;})
            });
  
    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.Name.substring(0, d.r / 3); });
  
    node.append("title")
        .text(function(d) { return d.Name + "\n" + "Undergrad Population: " +format(d.UndergradPopulation); });

    node.on('mouseover', function(d){ // Add hover start event binding
        
            // Select the hovered g.dot
            var hovered = d3.select(this);

            hovered.style('stroke-width', 3)
                    .style('stroke', '#58D68D');

            var id = this.id
            id = id.slice(0, (id.length-4));

            svg.selectAll('circle').style('opacity', 0.1);

            document.getElementById(id+"_dot").setAttribute('r', 6);
            document.getElementById(id+"_dot").setAttribute('stroke-width', 2);
            document.getElementById(id+"_dot").setAttribute('stroke', '#58D68D');
            

            document.getElementById(id+"_dot").style.opacity = 1;
            document.getElementById(id+"_cir").style.opacity = 1;

            d3.select(this).style('opacity', 1);

        })
        .on('mouseout', function(d){ 
            var hovered = d3.select(this);

            var id = this.id
            id = id.slice(0, (id.length-4));

            document.getElementById(id+"_dot").setAttribute('r', 3);
            document.getElementById(id+"_dot").setAttribute('stroke', null);

            d3.selectAll('circle').style('opacity', 1);
            // document.getElementById(id+"_dot").r = 3;
            hovered.style('stroke-width', 0)
                    .style('stroke', 'none');

        })

    

/////////////////////////   Bubble   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Dot  ////////////////////////////////////////////////////////////////////////////////

    data = classes;
    // x-axis
    xScale = d3.scaleLinear().range([900, 1400]);
    yScale = d3.scaleLinear().range([500, 0]);

    updateChart('Admission Rate','ACT Median');
        
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
                                        
                                svg.selectAll('circle').style('opacity', 0.1);

                                document.getElementById(id+"_cir").setAttribute('stroke-width', 3);
                                document.getElementById(id+"_cir").setAttribute('stroke', '#58D68D');

                    
                                document.getElementById(id+"_dot").style.opacity = 1;
                                document.getElementById(id+"_cir").style.opacity = 1;
                    
                        })
                        .on('mouseout', function(d){ 

                            d3.selectAll('circle').style('opacity', 1);
                            // Select the hovered g.dot
                            var hovered = d3.select(this);
                            // Remove the highlighting we did in mouseover
                            hovered.select('text')
                                .style('visibility', 'hidden');
                            hovered.select('circle')
                                .attr('r', 3)
                                .style('stroke-width', 0)
                                .style('stroke', 'none');

                            var id = this.firstChild.getAttribute('id')
                            id = id.slice(0, (id.length-4));

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
            return 'translate('+[tx+150, ty+50]+')';
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


