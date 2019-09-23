
function main() {

  const r = new Renderer();
  const carModel = new CarModel();
  function mainLoop(){
    r.clear_frame();
    r.render(carModel);
    window.requestAnimationFrame(mainLoop);
  }
  window.requestAnimationFrame(mainLoop);
}

main();
