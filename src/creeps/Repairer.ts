import Root from './root';

class Repairer extends Root {
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
      // 建造
      const target = Game.getObjectById<ConstructionSite<BuildableStructureConstant>>(creep.memory.targetId);
      const status = creep.build(target);
      if (status === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
        return;
      }
      // 已经建造完成
      if (status === ERR_INVALID_TARGET) {
        const newBuildTarget = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
        if (newBuildTarget) {
          creep.memory.targetId = newBuildTarget.id;
        } else {
          creep.memory.isBusy = false;
        }
      }
    } else {
      if (!creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
        creep.memory.isWork = true;
        return;
      }

      if (creep.room.controller.level < 5) {
        const origin = Game.getObjectById<StructureContainer | StructureExtension | StructureSpawn>(creep.memory.originId);
        const status = creep.withdraw(origin, RESOURCE_ENERGY);
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

export default new Repairer();
