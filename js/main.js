
function main() {

  const r = new Renderer();
  const carModel = new CarModel();
  const cubeModel = new CubeModel();
  const phys = new PhysEngine();
  phys.register(carModel, ProcessAs.GRAVITY);

  var last_timestamp = Date.now();
  var deltaTime;

  function mainLoop(){
    deltaTime = Date.now() - last_timestamp;
    last_timestamp = Date.now();
    phys.update(deltaTime);

    r.clear_frame();
    r.render(carModel);
    r.render(cubeModel);
    window.requestAnimationFrame(mainLoop);
  }
  window.requestAnimationFrame(mainLoop);
}

main();
