var WIDTH   = 1000,
    HEIGHT  = 800;


var scale_x = d3.scale.linear()
            .domain([0, WIDTH])  // Data space
            .range([0, WIDTH]); // Pixel space

var scale_x = d3.scale.linear()
            .domain([0, HEIGHT])  // Data space
            .range([0, HEIGHT]); // Pixel space

var svg = d3.select("svg")
            .attr('width', WIDTH)
            .attr('height', HEIGHT);

dthree.onclick = function(e) {
  console.log("click d3");
  console.log(graph);
  
  //svg based
  document.getElementById("svgGraph").style.display = "initial";
  document.getElementById("canvasGraph").style.display = "none";
              
  renderGraph();
}

// but we need an array for D3.js
function renderGraph() {

  // Object
  window.nodes_obj = window.graph.getNodes();
  window.node_keys = Object.keys(nodes_obj);

    // Tooltip
  // var tip = d3.tip()
  //   .attr('class', 'd3-tip')
  //   .offset([-10, 0])
  //   .html(function(d, i) {
  //     return "<strong>Cloud Nr. </strong> <span style='color:red'>" + i + "</span> <strong>, Color: </strong> <span style='color:green'>" + d.color + "</span>";
  //   });

  // Activate tooltips
  // svg.call(tip);

  // Select elements
  var elements = svg.selectAll("circle");
  // Bind data to elements
  var nodes = elements.data(node_keys);

  // Enter
  nodes.enter().append("circle")
    .attr("cx", function(d) { return (Math.random()*WIDTH)|0 })
    .attr("cy", function(d) { return (Math.random()*HEIGHT)|0 })
    .attr("r", 2)
    .attr("fill", '#A00000')
    .attr("class", "node");

  nodes.exit().remove();
}


function mutilateGraph() {
    while ( graph.nrNodes() ) {
      graph.removeNode(graph.getRandomNode());
      // renderGraph();
      console.log( graph.nrNodes() );
    }
}

//
// function insertCloud() {
//   console.log("Cloud array length: " + cloud_array.length);
//   cloud_array.push(makeCloud());
//   render(cloud_array);
// }
//
//
// function makeCloud() {
//     var r = Math.random()*255|0,
//       g = Math.random()*255|0,
//       b = Math.random()*255|0,
//       a = Math.random();
//
//   return {
//     x: Math.random()*870|0,
//     y: Math.random()*670|0,
//     color: "rgba(" + r + "," + g + "," + b + "," + a + ")"
//   }
// }
//
// // Explain why the colors change...
// function removeCloud() {
//   var idx = (Math.random()*cloud_array.length)|0;
//   cloud_array.splice(idx, 1);
//   render(cloud_array);
//   console.log("Cloud array length: " + cloud_array.length);
//   console.log("Cloud array: " + cloud_array);
// }
