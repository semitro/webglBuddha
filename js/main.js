const vertex_shader = `
#include "../shaders/vertex.vt"
`;

const frag_shader = `
#include "../shaders/frag.fg"
`;


function init_gl(vertex_shader_src, frag_shader_src) {
  const canvas = document.getElementById("mainCanvas");
  const gl = canvas.getContext("webgl");
  // final projection "window" size
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag_shader_src);
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex_shader_src);
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);
  return {
    program: program,
    gl: gl,
    attribLocations: {
      vertexPos: gl.getAttribLocation(program, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(program, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(program, 'uModelViewMatrix'),
    },
  };
}

function main() {

  const program_info = init_gl(vertex_shader, frag_shader);
  const gl = program_info.gl;

  // Tell it to use our program (pair of shaders)

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

  var time = Date.now();
  function mainLoop(){
    const dt = Date.now() - time;
    time += dt;
    gl.clearColor(0., 0., 0., 0.05);
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

    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0, -6.0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, time*0.0005, [0, 1, 1]);

    // pos
    const vertexPos = program_info.attribLocations.vertexPos;
    gl.bindBuffer(gl.ARRAY_BUFFER, boxBuffer);
    gl.vertexAttribPointer(
      vertexPos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPos);

    // color
    const vertexColor = program_info.attribLocations.vertexColor;
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexColor);

    // indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBuffer);
    //
    const projectionMatrixUniform = program_info.uniformLocations.projectionMatrix;
    const modelViewMatrixUniform = program_info.uniformLocations.modelViewMatrix;
    gl.uniformMatrix4fv(projectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(modelViewMatrixUniform, false, modelViewMatrix);

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0); // run frag shader for each vert
  }
  setInterval(mainLoop, 0);
  // drawing
}

function getObject() {
  const positions = [
    // Front face
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];
  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
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
