/**
* Bulk of 3D-models used in our game
**/
class Model {

};

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
#include "../models/cube.obj.indices_array"
    ];

  }

}
