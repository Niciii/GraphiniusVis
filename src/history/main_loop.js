
/**
 * delta t stuff
 */

function main_loop() {
  /**
   * Check for changes,
   * - if none, do nothing
   * - if changes, invoke reader and GO!
   */

  window.requestAnimationFrame(main_loop);
}

window.requestAnimationFrame(main_loop);
