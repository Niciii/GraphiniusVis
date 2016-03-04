var json_config;

(function init(json_config) {
  console.log('GRAPHINIUS VIS INITIALIZED');
  window.GraphiniusVIS = {
      config : {
      "render-defaults": {
        "node-size": 6
      }
    }
  };
})(json_config || {});
