/**
* Bulk of 3D-models used in our game
**/
'use strict';
class Model {
};

function convertToOneIndex(vertexes, indices, vt, vt_indices, normals, normals_indices){
  const resultVertex   = [];
  const resultVTexture = [];
  const resultNormals  = [];
  const resultIndices  = [];
  var reindexMap = new Map();

  var newIndex = 0;
  for( var i = 0; i < indices.length; i++) {
    const key = vt_indices[i].toString() + indices[i].toString() + normals_indices[i].toString();
    const element_num = reindexMap.get(key);
    if(element_num === undefined){
      reindexMap.set(key, newIndex);
      resultIndices.push(newIndex);
      newIndex++;
      resultVertex.push(vertexes[indices[i]*3]);
      resultVertex.push(vertexes[indices[i]*3 + 1]);
      resultVertex.push(vertexes[indices[i]*3 + 2]);
      resultVTexture.push(vt[vt_indices[i]*2]);
      resultVTexture.push(vt[vt_indices[i]*2 + 1]);
      resultNormals.push(normals[normals_indices[i]*3 ]);
      resultNormals.push(normals[normals_indices[i]*3 + 1]);
      resultNormals.push(normals[normals_indices[i]*3 + 2]);
    }
    else
      resultIndices.push(element_num);
  }
  reindexMap = null;
  return {resultIndices, resultVertex, resultVTexture, resultNormals};
}

class CarModel{
  constructor(){
    this.modelMatrix = mat4.create();

    this.vertexes = [
#include "../models/car.obj.vertexes_array"
    ];
    this.indices = [
#include "../models/car.obj.indices_array"
    ];
  }

}

class CubeModel {
  constructor(){
    this.modelMatrix = mat4.create();
    const vertexes = [
#include "../models/cube.obj.vertexes_array"
    ];
    const indices = [
#include "../models/cube.obj.indices_vertexes_array"
    ];
    const vt = [
#include "../models/cube.obj.vtextures_array"
    ];
    const vt_indices = [
#include "../models/cube.obj.indices_vtextures_array"
  ];
    const file_normals = [
#include "../models/cube.obj.normals_array"
    ];
    const file_normals_indices = [
#include "../models/cube.obj.indices_normals_array"
  ];

    const image = new Image();
    image.src = "../textures/textureDefault.png";

    this.image = image;

    const converted = convertToOneIndex(vertexes, indices, vt, vt_indices, file_normals, file_normals_indices);
    this.resultIndices  = converted.resultIndices;
    this.resultVertex   = converted.resultVertex;
    this.resultVTexture = converted.resultVTexture;

    this.vTexturesFloatArray = new Float32Array(this.resultVTexture);
    this.indicesIntArray = new Uint16Array(this.resultIndices);
    this.vertexesFloatArray = new Float32Array(this.resultVertex);
    this.normalsFloatArray = new Float32Array(converted.resultNormals);
  }
}

class StatueModel {
  constructor(){
    this.modelMatrix = mat4.create();
    mat4.translate(this.modelMatrix, this.modelMatrix, [0., -5., 0.]);
    mat4.scale(this.modelMatrix, this.modelMatrix, [25., 25. , 25.]);
    const vertexes = [
#include "../models/statue.obj.vertexes_array"
  ];
    const indices = [
#include "../models/statue.obj.indices_vertexes_array"
  ];
    const vt = [
#include "../models/statue.obj.vtextures_array"
  ];
    const vt_indices = [
#include "../models/statue.obj.indices_vtextures_array"
  ];
    const file_normals = [
#include "../models/statue.obj.normals_array"
  ];
    const file_normals_indices = [
#include "../models/statue.obj.indices_normals_array"
  ];

    const image = new Image();
    image.src = "../textures/statue.jpg";

    this.image = image;

    const converted = convertToOneIndex(vertexes, indices, vt, vt_indices, file_normals, file_normals_indices);
    this.resultIndices  = converted.resultIndices;
    this.resultVertex   = converted.resultVertex;
    this.resultVTexture = converted.resultVTexture;

    this.vTexturesFloatArray = new Float32Array(this.resultVTexture);
    this.indicesIntArray = new Uint16Array(this.resultIndices);
    this.vertexesFloatArray = new Float32Array(this.resultVertex);
    this.normalsFloatArray = new Float32Array(converted.resultNormals);
  }
}


class Penguin{
  constructor(){
    this.modelMatrix = mat4.create();
    mat4.translate(this.modelMatrix, this.modelMatrix, [1., -5., 0.]);
    mat4.scale(this.modelMatrix, this.modelMatrix, [7., 7., 7.]);
    const vertexes = [
#include "../models/penguin.obj.vertexes_array"
  ];
    const indices = [
#include "../models/penguin.obj.indices_vertexes_array"
  ];
    const vt = [
#include "../models/penguin.obj.vtextures_array"
  ];
    const vt_indices = [
#include "../models/penguin.obj.indices_vtextures_array"
  ];

    const image = new Image();
    image.src = "../textures/penguin.png";

    this.image = image;

    const converted = convertToOneIndex(vertexes, indices, vt, vt_indices);
    this.resultIndices  = converted.resultIndices;
    this.resultVertex   = converted.resultVertex;
    this.resultVTexture = converted.resultVTexture;

    this.vTexturesFloatArray = new Float32Array(this.resultVTexture);
    this.indicesIntArray = new Uint16Array(this.resultIndices);
    this.vertexesFloatArray = new Float32Array(this.resultVertex);
  }
}

class EyeModel{
  constructor(){
    this.modelMatrix = mat4.create();
    mat4.translate(this.modelMatrix, this.modelMatrix, [0., -5., 0.]);
    mat4.scale(this.modelMatrix, this.modelMatrix, [75., 75. , 75.]);
    //mat4.rotateX(this.modelMatrix, this.modelMatrix, 3.14);
    const vertexes = [
#include "../models/eye.obj.vertexes_array"
  ];
    const indices = [
#include "../models/eye.obj.indices_vertexes_array"
  ];
    const vt = [
#include "../models/eye.obj.vtextures_array"
  ];
    const vt_indices = [
#include "../models/eye.obj.indices_vtextures_array"
  ];
    const file_normals = [
#include "../models/eye.obj.normals_array"
  ];
    const file_normals_indices = [
#include "../models/eye.obj.indices_normals_array"
  ];

    const image = new Image();
    image.src = "../textures/Eye_D.jpg";

    this.image = image;

    const converted = convertToOneIndex(vertexes, indices, vt, vt_indices, file_normals, file_normals_indices);
    this.resultIndices  = converted.resultIndices;
    this.resultVertex   = converted.resultVertex;
    this.resultVTexture = converted.resultVTexture;

    this.vTexturesFloatArray = new Float32Array(this.resultVTexture);
    this.indicesIntArray = new Uint16Array(this.resultIndices);
    this.vertexesFloatArray = new Float32Array(this.resultVertex);
    this.normalsFloatArray = new Float32Array(converted.resultNormals);
  }
}
