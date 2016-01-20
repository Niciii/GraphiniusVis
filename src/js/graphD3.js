var WIDTH   = 1000,
    HEIGHT  = 800;

var scale_x = d3.scale.linear()
            .domain([0, WIDTH])  // Data space
            .range([0, WIDTH]); // Pixel space

var scale_y = d3.scale.linear()
            .domain([0, HEIGHT])  // Data space
            .range([0, HEIGHT]); // Pixel space

var svg = d3.select("svg")
            .attr('width', WIDTH)
            .attr('height', HEIGHT);

dthree.onclick = function(e) {
  console.log("click d3");
  console.log(graph);
  
  //svg based
  document.getElementById("containerGraph").style.display = "none";
  document.getElementById("svgGraph").style.display = "initial";
          
  initGraph();
  renderGraphD3();
}

function getXCoord(key) {  
  return ~~scale_x(nodes_obj[key].getFeature('coords').x);
}

function getYCoord(key) {
  return ~~scale_y(nodes_obj[key].getFeature('coords').y);
}

// but we need an array for D3.js
function renderGraphD3() {
  // Select elements
  var elements = svg.selectAll("circle");  
  // Bind data to elements
  var nodes = elements.data(node_keys);
  // Enter
  nodes.enter().append("circle")
    .attr("cx", function(key) { return getXCoord(key) })
    .attr("cy", function(key) { return getYCoord(key) })
    .attr("r", 2).attr("id", function(key) { return "node-" + key })
    .attr("fill", '#A00000')
    .attr("class", "node");

  nodes.exit().remove();
}

/*
function mutilateGraph() {
    while ( graph.nrNodes() ) {
      graph.removeNode(graph.getRandomNode());
      // renderGraph();
      console.log( graph.nrNodes() );
    }
}*/

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
