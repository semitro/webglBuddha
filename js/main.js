function main() {

  const camera = mat4.create();
  const r = new Renderer(camera);
  // const carModel = new CarModel();
  const cubeRight = new CubeModel();
  const cubeLeft = new CubeModel();
  const statueModel = new StatueModel();
  // const penguinModel = new Penguin();
  const eyeModel = new EyeModel();
  const phys = new PhysEngine();
  phys.register(cubeRight, [ProcessAs.PLAYABLE_FALLING, ProcessAs.CUBE]);
  phys.register(cubeLeft, [ProcessAs.CUBE]);
  phys.register(statueModel, [ProcessAs.BUDDHA]);
  phys.register(eyeModel, [ProcessAs.EYE]);

  var last_timestamp = Date.now();
  var deltaTime;

  function keyPressed(e) {
    if (e.key === "w") mat4.translate(camera, camera, [0, 0, 0.1 * deltaTime]);
    if (e.key === "s") mat4.translate(camera, camera, [0, 0, -0.1 * deltaTime]);
    if (e.key === "a") mat4.rotateY(camera, camera, 0.005 * deltaTime);
    if (e.key === "d") mat4.rotateY(camera, camera, -0.005 * deltaTime);
    if (e.key === "q") mat4.rotateX(camera, camera, 0.1);
    if (e.key === "e") mat4.rotateX(camera, camera, -0.1);
    if (e.key === "k") phys.jumpIt(cubeRight);
    if (e.key === "j") phys.jumpIt(cubeLeft);
  };
  window.addEventListener("keypress", keyPressed);

  // set up initial positions
  mat4.translate(camera, camera, [0, 0., -50]);
  mat4.translate(cubeLeft.modelMatrix, cubeLeft.modelMatrix, [-20, 10., 1.]);
  mat4.translate(cubeRight.modelMatrix, cubeRight.modelMatrix, [20, 10., -1.]);
  mat4.rotateY(statueModel.modelMatrix, statueModel.modelMatrix, 3.14 + 3.14 / 2);

  function mainLoop() {
    deltaTime = Date.now() - last_timestamp;
    last_timestamp = Date.now();
    phys.update(deltaTime);

    r.clear_frame();
    console.timeStamp("Render begins");
    r.prepare_shadow_map(cubeRight);

    r.prepare_shadow_map(statueModel);
    r.prepare_shadow_map(eyeModel);

    r.clear_frame();
    //r.render(cubeRight);
   // r.render(cubeLeft);
  //  r.render(statueModel);
   // r.render(eyeModel);


    console.timeStamp("Render ends");

    window.requestAnimationFrame(mainLoop);
  }

  window.requestAnimationFrame(mainLoop);
}

main();
