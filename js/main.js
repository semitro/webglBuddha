
function main() {

  const r = new Renderer();
  const carModel = new CarModel();
  const cubeModel = new CubeModel();

  function mainLoop(){
    r.clear_frame();
    r.render(carModel);
    r.render(cubeModel);
    window.requestAnimationFrame(mainLoop);
  }
  window.requestAnimationFrame(mainLoop);
}

main();
