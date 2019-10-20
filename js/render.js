/**
 * such strange syntax (#include) is possible because I use gcc -E before
 * passing js files to the server.
 * @see deploy.sh
 * Don't forget that there shouldn't be spaces before #include macro
 */
 'use strict';
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
        textureCoord: gl.getAttribLocation(program, 'aTextureCoord')
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

    // calculate matrixes
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.01;
    const zFar = 1000.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const viewMatrix = mat4.create();

    mat4.translate(viewMatrix, viewMatrix, [0, 0, -20.0]);

    const modelMatrixUniform = program_info.uniformLocations.modelMatrix;
    const viewMatrixUniform = program_info.uniformLocations.viewMatrix;
    const projectionMatrixUniform = program_info.uniformLocations.projectionMatrix;
    gl.uniformMatrix4fv(modelMatrixUniform, false, model.modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projectionMatrixUniform, false, projectionMatrix);

    const modelVertexes = model.resultVertex;
    const modelIndices = model.resultIndices;
    const modelVTextures = model.resultVTexture;

    // set up vertexes positions in space
    const modelVertexesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, model.vertexesFloatArray, gl.STATIC_DRAW);

    const vertexPosAttr = program_info.attribLocations.vertexPos;
    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexesBuffer);
    gl.vertexAttribPointer(vertexPosAttr, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosAttr);

    // set up texture coordinates
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, model.vTexturesFloatArray, gl.STATIC_DRAW);

    const textureCoordAttr = program_info.attribLocations.textureCoord;
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.vertexAttribPointer(textureCoordAttr, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(textureCoordAttr);

    const vertexIndicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesIntArray, gl.STATIC_DRAW);

    // texture itself
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, model.image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.drawElements(gl.TRIANGLES, modelIndices.length, gl.UNSIGNED_SHORT, 0); // run frag shader for each vert
    gl.deleteBuffer(vertexIndicesBuffer);
    gl.deleteBuffer(textureCoordBuffer);
    gl.deleteBuffer(modelVertexesBuffer);
    gl.deleteTexture(texture);
  }
}

