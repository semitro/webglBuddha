
const speed_of_time_factor = 0.0001; // convert sec to msec, e.g.
const g = 5.;

const ProcessAs = {
  GRAVITY: 1
}

class PhysEngine{
  constructor(){
    this.actorList = [];
  }

  register(actor, as){
    this.actorList.push({
      model: actor,
      as: as,
      speed: [0, 0, 0]
    });
  }
  update(deltaTime){
    const dt = deltaTime*speed_of_time_factor;
    this.actorList.forEach(a=>this.update_one(a, dt));
  }
  // private
  update_one(actor, dt){
    if(actor.as === ProcessAs.GRAVITY){
      actor.speed[1] -= g*dt;
    }
    var actorPos = actor.model.modelMatrix;
    mat4.translate(actorPos, actorPos, actor.speed);
  }
}
