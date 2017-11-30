// Global function called when select element is changed

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


var svg = d3.select('svg');

var data;

// Create a group element for appending chart elements
var chartG = svg.append('g');

var xAxisG = chartG.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(50, 550)');

var yAxisG = chartG.append('g')
                    .attr('class', 'y axis')
                    .attr('transform', 'translate(50, 50)');

var transitionScale = d3.transition()
                        .duration(600)
                        .ease(d3.easeLinear);

d3.csv('./05_final_project/colleges.csv', 
    function(error, dataset) {
        if(error) {
            console.error('Error while loading ./letter_freq.csv dataset.');
            console.error(error);
            return;
        } 

    data = dataset;
    // x-axis
    xScale = d3.scaleLinear().range([0, 800]);
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
            .style('visibility', 'hidden');;

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
        });
                    

}




