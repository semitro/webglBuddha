function main() {

  const camera = mat4.create();
  const r = new Renderer(camera);
  // const carModel = new CarModel();
  const cubeRight = new CubeModel();
  const cubeLeft = new CubeModel();
  const statueModel = new StatueModel();
  // const penguinModel = new Penguin();
  //const eyeModel = new EyeModel();
  const phys = new PhysEngine();
  //phys.register(carModel, ProcessAs.GRAVITY);
  //phys.register(penguinModel, ProcessAs.GRAVITY);
  //phys.register(eyeModel, null);
   phys.register(cubeRight, ProcessAs.CUBE);
   phys.register(cubeLeft, ProcessAs.CUBE);
  phys.register(statueModel, ProcessAs.BUDDHA);
//  phys.register(statueModel, null);
  var last_timestamp = Date.now();
  var deltaTime;
  //window.addEventListener("keypress", keyPressed);

  // function keyPressed(e) {
  //  console.log(e);
  //};
  //mat4.translate(camera, camera, [0, 0, -0.1]);
  //mat4.translate(camera, camera, [0, 0., -500]);
  mat4.translate(camera, camera, [0, 0., -50]);
  mat4.translate(cubeLeft.modelMatrix, cubeLeft.modelMatrix, [-20, 10., 1.]);
  mat4.translate(cubeRight.modelMatrix, cubeRight.modelMatrix, [20, 10., -1.]);
  mat4.rotateY(statueModel.modelMatrix, statueModel.modelMatrix, 3.14 + 3.14/2);
  function mainLoop() {
    deltaTime = Date.now() - last_timestamp;
    last_timestamp = Date.now();
    phys.update(deltaTime);

    r.clear_frame();
    //   r.render(carModel);
    //r.render(eyeModel);
    console.timeStamp("Render begins");
//    r.render(penguinModel);
    r.render(cubeRight);
    r.render(cubeLeft);
    r.render(statueModel);
    console.timeStamp("Render ends");

    window.requestAnimationFrame(mainLoop);
  }

  window.requestAnimationFrame(mainLoop);
}

main();
