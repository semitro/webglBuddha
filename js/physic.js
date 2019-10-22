/**
 * convert real world time into inner Physical Engine time
 **/
const speed_of_time_factor = 0.0001;
/**
 * F = mg, don't you forget?
 **/
const g = 0.1;

/**
 * Enum by which Physical Engine decide how to handle this kind of object
 * @param GRAVITY - use gravitation force on the object that is being registered
 ***/
const ProcessAs = {
  GRAVITY: 1,
  CUBE : 2,
  BUDDHA: 3
};

/**
 * It makes model matrix transformations
 */
class PhysEngine {
  constructor() {
    this.actorList = [];
  }

  /**
   * mark game object that is supposed to be processed at the PE
   * @param actor - game object
   * @param as - type of object (see ProcessesAs enum above)
   */
  register(actor, as) {
    this.actorList.push({
      model: actor,
      as: as,
      speed: [0, 0, 0],
      rotSpeed: [5*Math.random(), 5*Math.random(), 5*Math.random()]
    });
  }

  /**
   * make processes continue
   * @param deltaTime - real unix time that is passed since the previous call
   **/
  update(deltaTime) {
    const dt = deltaTime * speed_of_time_factor;
    this.actorList.forEach(a => this.update_one(a, dt));
  }

  /**
   * @access private
   * */
  update_one(actor, dt) {
    if (actor.as === ProcessAs.GRAVITY) {
      actor.speed[1] -= g * dt;
    }
    if(actor.as === ProcessAs.CUBE){
      mat4.rotateX(actor.model.modelMatrix, actor.model.modelMatrix, actor.rotSpeed[0]*dt);
      mat4.rotateY(actor.model.modelMatrix, actor.model.modelMatrix, actor.rotSpeed[1]*dt);
      mat4.rotateZ(actor.model.modelMatrix, actor.model.modelMatrix, actor.rotSpeed[2]*dt);
      if(Math.random() < 0.05)
        actor.rotSpeed = [15*Math.random(), 15*Math.random(), 15*Math.random()];
    }
    if(actor.as === ProcessAs.BUDDHA){
      mat4.rotateY(actor.model.modelMatrix, actor.model.modelMatrix, actor.rotSpeed[1]*0.1*dt);
      mat4.rotateX(actor.model.modelMatrix, actor.model.modelMatrix, actor.rotSpeed[0]*0.01*dt);
      mat4.rotateZ(actor.model.modelMatrix, actor.model.modelMatrix, actor.rotSpeed[2]*0.025*dt);
      if(Math.random() < 0.01){
        const reverseIndex = parseInt(Math.random()*2.9999);
          actor.rotSpeed[reverseIndex] = -actor.rotSpeed[reverseIndex]*Math.random()*3;
      }
    }
    var actorPos = actor.model.modelMatrix;
    mat4.translate(actorPos, actorPos, actor.speed);
  }
}
