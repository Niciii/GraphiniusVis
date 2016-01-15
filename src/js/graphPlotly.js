plotly.onclick = function(e) {
  console.log("click plotly");
  
  //svg based
  document.getElementById("svgGraph").style.display = "initial";
  document.getElementById("canvasGraph").style.display = "none";
  
	TESTER = document.getElementById('container');
	Plotly.plot( TESTER, [{
	x: [1, 2, 3, 4, 5],
	y: [1, 2, 4, 8, 16] }], {
	margin: { t: 0 } } );

}
