var json_config;

(function init(json) {
  console.log('GRAPHINIUS VIS INITIALIZED');
  window.GraphiniusVIS = {
      config : {
      "render-defaults": {
        "node-size": 6
      }
    }
  };
})(json || {});
