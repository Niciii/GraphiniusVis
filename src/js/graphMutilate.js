mutilate.onclick = function() {
  
  if (document.querySelector('#dthree').checked) {
    graphD3Mutilate();
  }
  else if (document.querySelector('#plotly').checked) {
    graphPlotlyMutilate();
  }
  else if (document.querySelector('#cyto').checked) {
    graphCytoscapeMutilate();
  }
  else if (document.querySelector('#visjs').checked) {
    graphVisMultilate();
  }
  else if (document.querySelector('#sigmaJS').checked) {
    graphSigmaMutilate();
  }
}
