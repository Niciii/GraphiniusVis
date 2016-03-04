var json_config;
console.log("blahooooo");

(function init(json_config) {
  console.log('GRAPHINIUS VIS INITIALIZED');
  window.$GV = {
      config : {
      "render-defaults": {
        "node-size": 6
      }
    }
  };
})(json_config || {});
