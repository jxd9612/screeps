import Root from './root';

class Upgrader extends Root {
  constructor() {
    super();
  }

  public init(creep: Creep) {
    if (!creep.memory.isBusy || !creep.memory.targetId || !creep.memory.originId) {
      this.accessToTask(creep);
    }

    this.run(creep);
  }

  private run(creep: Creep) {
    if (!creep.store[RESOURCE_ENERGY]) creep.memory.isWork = false;

    if (creep.memory.isWork) {
      // 升级
      const target = Game.getObjectById<StructureController>(creep.memory.targetId);
      const status = creep.upgradeController(target);
      if (status === ERR_NOT_IN_RANGE) creep.moveTo(target);
    } else {
      if (!creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
        creep.memory.isWork = true;
        return;
      }

      if (creep.room.controller.level < 5) {
        const origin = Game.getObjectById<Source>(creep.memory.originId);
        const status = creep.harvest(origin);
        if (status === ERR_NOT_IN_RANGE) creep.moveTo(origin);
        return;
      }

      const origin = Game.getObjectById<StructureStorage>(creep.memory.originId);
      // 源目标没有能量
      if (!origin.store[RESOURCE_ENERGY]) {
        creep.memory.isBusy = false;
        return;
      }
      const status = creep.withdraw(origin, RESOURCE_ENERGY);
      if (status === ERR_NOT_IN_RANGE) creep.moveTo(origin);
    }
  }
}

export default new Upgrader();
