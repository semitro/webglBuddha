const vertex_shader = `
#include "../shaders/vertex.vt"
`;

const frag_shader = `
#include "../shaders/frag.fg"
`;

function main() {
  // Get A WebGL context
  var canvas = document.getElementById("mainCanvas");
  var gl = canvas.getContext("webgl");

  // create GLSL shaders, upload the GLSL source, compile the shaders
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag_shader);
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex_shader);

  // Link the two shaders into a program
  const program = createProgram(gl, vertexShader, fragmentShader);
  // look up where the vertex data needs to go.

  //webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  const object = getObject()[0];
  const objectIndicies = getObject()[1];
  const objectColors = getObject()[2];

  const boxBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, boxBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object), gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objectColors), gl.STATIC_DRAW);

  const boxIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(objectIndicies), gl.STATIC_DRAW)

  // draw
  gl.clearColor(0., 0., 0., 1.);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL); // obucre far things
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = 45 * Math.PI / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  const modelViewMatrix = mat4.create();

  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

  mat4.rotate(modelViewMatrix, modelViewMatrix, 0.2, [0, 0, 1]);

  // pos
  const vertexPos = gl.getAttribLocation(program, 'aVertexPosition');
  gl.vertexAttribPointer(
    vertexPos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexPos);

  // color
  const vertexColor = gl.getAttribLocation(program, 'aVertexColor');
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertexColor);

  // indices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBuffer);
  //
  const projectionMatrixUniform =  gl.getUniformLocation(program, 'uProjectionMatrix');
  const modelViewMatrixUniform  = gl.getUniformLocation(program, 'uModelViewMatrix');
  gl.uniformMatrix4fv(projectionMatrixUniform, false, projectionMatrix);
  gl.uniformMatrix4fv(modelViewMatrixUniform, false, modelViewMatrix);

  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0); // run frag shader for each vert
}

function getObject() {
  const positions = [
    // Front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0,
  ];
  const indices = [
    0, 1, 2, 0, 2, 3,    // front
    4, 5, 6, 4, 6, 7,    // back
    8, 9, 10, 8, 10, 11,   // top
    12, 13, 14, 12, 14, 15,   // bottom
    16, 17, 18, 16, 18, 19,   // right
    20, 21, 22, 20, 22, 23,   // left
  ];
  const faceColors = [
    [1.0, 1.0, 1.0, 1.0],    // Front face: white
    [1.0, 0.0, 0.0, 1.0],    // Back face: red
    [0.0, 1.0, 0.0, 1.0],    // Top face: green
    [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
    [1.0, 0.0, 1.0, 1.0],    // Left face: purple
  ];
  var colors = [];

  for (let j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];
    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c);
  }

  return [positions, indices, colors];
}

main();
