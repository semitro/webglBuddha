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
  convertToOneIndex(){
    this.textureCoord = new Array(this.indices.length);
    /*
    for(var i = 0; i < this.indices.length; i++) {
      this.textureCoord.push(0); // REPLACE!
    }

     */
    for(var i = 0 ; i < this.indices.length; i++) {
      this.textureCoord[this.indices[i]] = this.vtextures_dirty[this.vtextures_dirty_indices[i]];
    }
  }
  constructor(){
    this.modelMatrix = mat4.create();
    mat4.translate(this.modelMatrix, this.modelMatrix, [10., 0., 0.]);
    this.vertexes = [
#include "../models/cube.obj.vertexes_array"
    ];
    this.indices = [
#include "../models/cube.obj.indices_array"
    ];

    this.vtextures_dirty = [
#include "../models/cube.obj.vtextures_array"
    ];
    this.vtextures_dirty_indices = [
#include "../models/cube.obj.indices_vtextures_array"
  ];

    const image = new Image();
    image.src = "../textures/textureDefault.png";

    image.addEventListener('load', function () {
      // теперь, когда изображение загрузилось, копируем его в текстуру
      console.log("img loaded");
    });
    this.image = image;

    this.convertToOneIndex();
  }

}
