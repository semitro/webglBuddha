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
  GRAVITY: 1
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
      speed: [0, 0, 0]
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
    mat4.rotateX(actor.model.modelMatrix, actor.model.modelMatrix, 1.0*dt);
    mat4.rotateY(actor.model.modelMatrix, actor.model.modelMatrix, -2.*dt);
    var actorPos = actor.model.modelMatrix;
    mat4.translate(actorPos, actorPos, actor.speed);
  }
}
