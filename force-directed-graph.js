"use strict";
var Width = 1024, Height = 1024;
var LinkLen = Width/60;

// Bad* vars are there to highlight users with a different group
// among file-sharers (group == 3 in datobj.json)

// Links style
var LinkColor = "#333333";
var LinkWidth = 2;
var BadLinkColor = "#ff0000";
var BadLinkWidth = 6;

// Nodes style
var FileNodeSize = 9;
var UserNodeSize = 12;
var BadUserNodeSize = 16;
var FileNodeColor = "#00aaff";
var UserNodeColor = "#000000";
var BadUserNodeColor = "#ff0000";
var UndefUserNodeColor = "#ff00ff";

var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = Width - margin.left - margin.right,
    height = Height - margin.top - margin.bottom;

var bad_app = function(d) {
    // A specific app: <int> value in the data
    return !(typeof d.app === 'undefined');
};

var app_width = function(d) {
    if (bad_app(d)) { return BadLinkWidth; };
    return LinkWidth;
};
var app_color = function(d) {
    if (bad_app(d)) { return BadLinkColor; };
    return LinkColor;
};

var force = d3.layout.force()
    .size([Width, Height])
    //
    //  Official docs:
    //      https://github.com/d3/d3-force/tree/v3.0.0
    //      https://d3-wiki.readthedocs.io/zh_CN/master/Force-Layout/
    //      https://en.wikipedia.org/wiki/Verlet_integration
    //
    //  Default settings:
    //      size 1×1
    //      linkStrength 1
    //      friction 0.9
    //      distance 20
    //      charge -30
    //      gravity 0.1
    //      theta 0.8
    //
    //  The default nodes and links are the empty array, and when the layout
    //  is started, the internal alpha cooling parameter is set to 0.1
    //
    // A few of the parameters are explained here:
    //   charge:
    //      (Negative) charge determines repulsion
    //      Effect is opposite of gravity (between two nodes)
    //   linkStrength:
    //      pulls two negative charges closer together
    //      0.1 keeps them far apart
    //   friction:
    //      Makes the graph movement stiffer & more resistant to change when disturbed,
    //   gravity:
    //      Global gravity force: pulls everything towards the center
    //         - If set to 1.0, everything becomes one big concentrated blob
    //         - If set to 0.0, blobs of nodes remain detached / outside the canvas
    //      default is 0.1
    // linkDistance:
    // chargeDistance:
    // theta:
    // .charge(-45)
    .charge(-65)
    .linkDistance(LinkLen)
    // .linkStrength(1.0)
    // .friction(0.9)
    // .chargeDistance(Width/2.0)
    .theta(0.3)
    .gravity(0.15)
    ;

// define the div for tooltips
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Add the SVG canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")")
    ;

d3.json("datobj.json", function(error, graph) {
    if (error) {
        alert(error);
        throw error;
    }

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke", function(d) { return app_color(d) })
      .style("stroke-width", function(d) { return app_width(d) })
      .style("fill", function(d) { return app_color(d) })
      ;

  var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", function(d) {
            if (d.group == 1) return UserNodeSize;
            if (d.group == 2) return FileNodeSize;
            if (d.group == 3) return BadUserNodeSize;
            return BadUserNodeSize*2;
    })
    .style("fill", function(d) {
            if (d.group == 1) return UserNodeColor;
            if (d.group == 2) return FileNodeColor;
            if (d.group == 3) return BadUserNodeColor;
            return UndefUserNodeColor;
    })
    .on("mouseover", function(d) {
        div.transition()
            .delay(0)
            .duration(0)
            .style("opacity", 1.0)
        div.html(d.name)
            .style("left", (d3.event.pageX + 14) + "px")
            .style("top", (d3.event.pageY - 30) + "px")
            ;
    })
    .on("mouseout", function(d) {
        div.transition()
            .delay(0)
            .duration(0)
            .style("opacity", 0.0)
        ;
    })

    .call(force.drag)
    ;

    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            ;

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        ;
    });
});
