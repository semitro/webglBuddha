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

const vertex_shadow_shader = `
#include "../shaders/vertex_shadow.vt"
`;

const frag_shadow_shader = `
#include "../shaders/frag_shadow.fg"
`;

class Renderer {
  init_gl(vertex_shader_src, frag_shader_src) {
    const canvas = document.getElementById("mainCanvas");
    const gl = canvas.getContext("webgl");

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex_shader_src);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag_shader_src);
    const program = createProgram(gl, vertexShader, fragmentShader);
    const program_shadow = createProgram(gl,
      createShader(gl, gl.VERTEX_SHADER, vertex_shadow_shader),
      createShader(gl, gl.FRAGMENT_SHADER, frag_shadow_shader)
    );
    return {
      program: program,
      program_shadow: program_shadow,
      gl: gl,
      attribLocations: {
        vertexPos: gl.getAttribLocation(program, 'aVertexPosition'),
        vertexColor: gl.getAttribLocation(program, 'aVertexColor'),
        textureCoord: gl.getAttribLocation(program, 'aTextureCoord'),
        normals: gl.getAttribLocation(program, 'aVertexNormals')
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
        viewMatrix: gl.getUniformLocation(program, 'uViewMatrix'),
        modelMatrix: gl.getUniformLocation(program, 'uModelMatrix'),
        modelMatrixSh: gl.getUniformLocation(program, 'uModelMatrixSh'),
        lightPos: gl.getUniformLocation(program, 'uLightPosition'),
      },
    };
  }

  constructor(camera) {
    this.program_info = this.init_gl(vertex_shader, frag_shader);
    this.viewMatrix = camera;

    const gl = this.program_info.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL); // obscure far things
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.01;
    const zFar = 1000.0;
    this.projectionMatrix = mat4.create();
    mat4.perspective(this.projectionMatrix, fieldOfView, aspect, zNear, zFar);
    this.shadow_frame_buffer = gl.createFramebuffer();
    this.shadow_render_buffer = gl.createRenderbuffer();
    this.shadow_map = gl.createTexture();
  }

  clear_frame() {
    const gl = this.program_info.gl;
    gl.clearColor(0., 0., 0., 0.00);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //   gl.deleteTexture(this.shadow_map);
    //  gl.createTexture(this.shadow_map);
  }

  prepare_shadow_map(model) {
    const program_info = this.program_info;
    const gl = this.program_info.gl;
    gl.useProgram(program_info.program_shadow);

    /* look at world from ligth position */
    const lightPosition = mat4.create();
    mat4.translate(lightPosition, lightPosition, [0, 0, -50]);
    gl.uniformMatrix4fv(program_info.uniformLocations.lightPos, false, lightPosition);
    /* render to texture */
    gl.viewport(0, 0, 2048, 2048);
    const shadow_map = this.shadow_map;
    gl.bindTexture(gl.TEXTURE_2D, shadow_map);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2048, 2048, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    // Create and bind the framebuffer
    const fb = this.shadow_frame_buffer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    // attach the shadow texture as the first color attachment
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, shadow_map, 0);
    const rb = this.shadow_render_buffer;
    gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 2048, 2048);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rb);
    /* end drawing to texture */
    const modelIndices = model.resultIndices;
    gl.uniformMatrix4fv(program_info.uniformLocations.modelMatrixSh, false, model.modelMatrix);

    // set up vertexes positions in space
    const modelVertexesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, model.vertexesFloatArray, gl.DYNAMIC_DRAW);

    const vertexPosAttr = program_info.attribLocations.vertexPos;
    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexesBuffer);
    gl.vertexAttribPointer(vertexPosAttr, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosAttr);

    const vertexIndicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesIntArray, gl.DYNAMIC_DRAW);

    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, model.vTexturesFloatArray, gl.DYNAMIC_DRAW);

    const textureCoordAttr = program_info.attribLocations.textureCoord;
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.vertexAttribPointer(textureCoordAttr, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(textureCoordAttr);

    const normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, model.normalsFloatArray, gl.DYNAMIC_DRAW);
    const normalsAttr = program_info.attribLocations.normals;
    gl.vertexAttribPointer(normalsAttr, 3, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(normalsAttr);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.drawElements(gl.TRIANGLES, modelIndices.length, gl.UNSIGNED_SHORT, 0);
    gl.deleteBuffer(vertexIndicesBuffer);
    gl.deleteBuffer(modelVertexesBuffer);
  }

  render(model) {
    const program_info = this.program_info;
    const gl = program_info.gl;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.useProgram(program_info.program);
    const modelMatrixUniform = program_info.uniformLocations.modelMatrix;
    const viewMatrixUniform = program_info.uniformLocations.viewMatrix;
    const projectionMatrixUniform = program_info.uniformLocations.projectionMatrix;
    gl.uniformMatrix4fv(modelMatrixUniform, false, model.modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, this.viewMatrix);
    gl.uniformMatrix4fv(projectionMatrixUniform, false, this.projectionMatrix);

    const modelIndices = model.resultIndices;
    // set up vertexes positions in space
    const modelVertexesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, model.vertexesFloatArray, gl.DYNAMIC_DRAW);

    const vertexPosAttr = program_info.attribLocations.vertexPos;
    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexesBuffer);
    gl.vertexAttribPointer(vertexPosAttr, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosAttr);

    // set up texture coordinates
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, model.vTexturesFloatArray, gl.DYNAMIC_DRAW);

    const textureCoordAttr = program_info.attribLocations.textureCoord;
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.vertexAttribPointer(textureCoordAttr, 2, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(textureCoordAttr);

    // the texture itself
    //const texture = gl.createTexture();
    const texture = this.shadow_map;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, model.image);
    gl.generateMipmap(gl.TEXTURE_2D);

    // normals
    const normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, model.normalsFloatArray, gl.DYNAMIC_DRAW);
    const normalsAttr = program_info.attribLocations.normals;
    gl.vertexAttribPointer(normalsAttr, 3, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(normalsAttr);

    const vertexIndicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesIntArray, gl.DYNAMIC_DRAW);

    gl.drawElements(gl.TRIANGLES, modelIndices.length, gl.UNSIGNED_SHORT, 0); // run frag shader for each vert
    gl.deleteBuffer(normalsBuffer);
    gl.deleteBuffer(vertexIndicesBuffer);
    gl.deleteBuffer(textureCoordBuffer);
    gl.deleteBuffer(modelVertexesBuffer);
    // gl.deleteTexture(texture);
  }
}

