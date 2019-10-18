/**
* Bulk of 3D-models used in our game
**/
class Model {
};

function convertToOneIndex(vertexes, indices, vt, vt_indices){
  const resultVertex   = [];
  const resultVTexture = [];
  const resultIndices  = [];
  const reindexMap = new Map();

  var newIndex = 0;
  for( var i = 0; i < indices.length; i++) {
    const key = vt_indices[i].toString() + indices[i].toString();
    const element = reindexMap.get(key);
    if(element === undefined){
      reindexMap.set(key, newIndex);
      resultIndices.push(newIndex);
      resultVertex.push(vertexes[indices[i]*3]);
      resultVertex.push(vertexes[indices[i]*3 + 1]);
      resultVertex.push(vertexes[indices[i]*3 + 2]);
      resultVTexture.push(vt[vt_indices[i]*2]);
      resultVTexture.push(vt[vt_indices[i]*2 + 1]);
      newIndex++;
    }
    else
      resultIndices.push(element);
  }
  return {resultIndices, resultVertex, resultVTexture};
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
    mat4.translate(this.modelMatrix, this.modelMatrix, [10., 0., 0.]);
    this.vertexes = [
#include "../models/cube.obj.vertexes_array"
    ];
    this.indices = [
#include "../models/cube.obj.indices_vertexes_array"
    ];

    this.vt = [
#include "../models/cube.obj.vtextures_array"
    ];
    this.vt_indices = [
#include "../models/cube.obj.indices_vtextures_array"
  ];

    const image = new Image();
    image.src = "../textures/textureDefault.png";

    image.addEventListener('load', function () {
      console.log("img loaded");
    });
    this.image = image;

    const converted = convertToOneIndex(this.vertexes, this.indices, this.vt, this.vt_indices);
    this.resultIndices  = converted.resultIndices;
    this.resultVertex   = converted.resultVertex;
    this.resultVTexture = converted.resultVTexture;
  }
}

class Penguin{
  constructor(){
    this.modelMatrix = mat4.create();
    mat4.translate(this.modelMatrix, this.modelMatrix, [1., -5., 0.]);
    mat4.scale(this.modelMatrix, this.modelMatrix, [7., 7., 7.]);
    this.vertexes = [
#include "../models/penguin.obj.vertexes_array"
  ];
    this.indices = [
#include "../models/penguin.obj.indices_vertexes_array"
  ];
    this.vt = [
#include "../models/penguin.obj.vtextures_array"
  ];
    this.vt_indices = [
#include "../models/penguin.obj.indices_vtextures_array"
  ];

    const image = new Image();
    image.src = "../textures/penguin.png";

    image.addEventListener('load', function () {
      console.log("img loaded");
    });
    this.image = image;

    const converted = convertToOneIndex(this.vertexes, this.indices, this.vt, this.vt_indices);
    this.resultIndices  = converted.resultIndices;
    this.resultVertex   = converted.resultVertex;
    this.resultVTexture = converted.resultVTexture;
  }
}
