sigmaJS.onclick = function(e) {
  console.log("click sigma");
  
  //canvas based
  //document.getElementById("svgGraph").style.display = "none";
  //document.getElementById("canvasGraph").style.display = "initial";
  
  sigma.parsers.json('json/data.json', {
    container: 'canvasGraph',
    settings: {
      defaultNodeColor: '#ec5148'
    }
  });
  
  /*// these are just some preliminary settings 
    var g = {
        nodes: [],
        edges: []
    };

   // Create new Sigma instance in graph-container div (use your div name here) 
   s = new sigma({
   graph: g,
   container: 'canvasGraph',
   renderer: {
    container: document.getElementById('canvasGraph'),
    type: 'canvas'
   },
   settings: {
    minNodeSize: 8,
    maxNodeSize: 16
   }
   });

   // first you load a json with (important!) s parameter to refer to the sigma instance   

   sigma.parsers.json(
        'json/data.json',
        s,
        function() {
            // this below adds x, y attributes as well as size = degree of the node 
            var i,
                    nodes = s.graph.nodes(),
                    len = nodes.length;

            for (i = 0; i < len; i++) {
                nodes[i].x = Math.random();
                nodes[i].y = Math.random();
                nodes[i].size = s.graph.degree(nodes[i].id);
                nodes[i].color = nodes[i].center ? '#333' : '#666';
            }

            // Refresh the display:
            s.refresh();

            // ForceAtlas Layout
            //s.startForceAtlas2();
        }
   );*/
}
