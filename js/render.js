const vertex_shader = `
#include "../shaders/vertex.vt"
`;

const frag_shader = `
#include "../shaders/frag.fg"
`;

class Renderer {
  init_gl(vertex_shader_src, frag_shader_src) {
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
        viewMatrix: gl.getUniformLocation(program, 'uViewMatrix'),
        modelMatrix: gl.getUniformLocation(program, 'uModelMatrix'),
      },
    };
  }

  constructor() {
    this.program_info = this.init_gl(vertex_shader, frag_shader);
    const gl = this.program_info.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL); // obucre far things
  }

  clear_frame() {
    const gl = this.program_info.gl;
    gl.clearColor(0., 0., 0., 0.05);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  render(model) {

    const program_info = this.program_info;
    const gl = program_info.gl;

// Tell it to use our program (pair of shaders)
    const modelVertexes = model.vertexes;
    const modelIndices = model.indices;
    // const objectColors = getObject()[2];

    const boxBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelVertexes), gl.STATIC_DRAW);

//    const colorBuffer = gl.createBuffer();
//    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
//    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objectColors), gl.STATIC_DRAW);

    const boxIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(modelIndices), gl.STATIC_DRAW)

    //   var time = Date.now();

//      const dt = Date.now() - time;
    //    time += dt;

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.01;
    const zFar = 1000.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const viewMatrix = mat4.create();

    //var scale_factor = document.getElementById("scaleBox").value;
    // mat4.scale(viewMatrix, viewMatrix, [scale_factor, scale_factor, scale_factor]);
    mat4.translate(viewMatrix, viewMatrix, [0, 0, -85.0]);
//      mat4.rotate(viewMatrix, viewMatrix, time * 0.0005, [0, 1, 1]);
    // pos
    const vertexPos = program_info.attribLocations.vertexPos;
    gl.bindBuffer(gl.ARRAY_BUFFER, boxBuffer);
    gl.vertexAttribPointer(
      vertexPos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPos);

    // color
    // const vertexColor = program_info.attribLocations.vertexColor;
    //gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    //gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
    //gl.enableVertexAttribArray(vertexColor);

    // indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBuffer);
    //
    const modelMatrixUniform = program_info.uniformLocations.modelMatrix;
    const viewMatrixUniform = program_info.uniformLocations.viewMatrix;
    const projectionMatrixUniform = program_info.uniformLocations.projectionMatrix;

    gl.uniformMatrix4fv(modelMatrixUniform, false, model.modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projectionMatrixUniform, false, projectionMatrix);

    gl.drawElements(gl.TRIANGLES, modelIndices.length, gl.UNSIGNED_SHORT, 0); // run frag shader for each vert
  }
}

