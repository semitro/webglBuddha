function main() {

  const r = new Renderer();
  const carModel = new CarModel();
  const cubeModel = new CubeModel();
  const penguinModel = new Penguin();
  const phys = new PhysEngine();
  phys.register(carModel, ProcessAs.GRAVITY);

  var last_timestamp = Date.now();
  var deltaTime;
  window.addEventListener("keypress", keyPressed);

  function keyPressed(e) {
    console.log(e);
  };


  function mainLoop() {
    deltaTime = Date.now() - last_timestamp;
    last_timestamp = Date.now();
    phys.update(deltaTime);

    r.clear_frame();
 //   r.render(carModel);
    r.render(penguinModel);
    r.render(cubeModel);

    window.requestAnimationFrame(mainLoop);
  }

  window.requestAnimationFrame(mainLoop);
}

main();
