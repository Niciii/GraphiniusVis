var json_config;

(function init(json_config) {
  console.log('GRAPHINIUS VIS INITIALIZED');
  var config = {
    //keys for handling events
    keys: {
      KEY_A: 97,
      KEY_D: 100,
      KEY_W: 119,
      KEY_S: 115,
      KEY_R: 114,
      KEY_F: 102,
      KEY_X: 120,
      KEY_Y: 121,
      KEY_C: 99,
      KEY_SX: 88,
      KEY_SY: 89,
      KEY_SC: 67
    },
    //default size of canvas/container
    container: {
      WIDTH: 1500,
      HEIGHT: 900
    },
    
    defaults: {
      node_size: 6,
      background_color: 0x000000,
      tranparent: true,
      opacity: 0.5, //default is 1; range: 0.0 - 1.0
      linewidth: 1,
      
      //zoom
      ZOOM_FACTOR: 0.05,
      MAX_FOV: 100, //zoom out
      MIN_FOV: 20, //zoom in
      
      //distance to move
      delta_distance: 10, 
      //rotation step
      delta_rotation: 0.05, 

      //for coloring
      randomColors: [
        0xc4d0db, 0xf6b68a, 0xffff33, 0x003fff,
        0xec2337, 0x008744, 0xffa700, 0x1df726,
        0x8fd621, 0x2d049b, 0x873bd3, 0x85835f
      ],
      
      //TODO
      INDEX: 0,
      NR_MUTILATE: 1
    }
  };
  module.exports = config;
})(json_config || {});
