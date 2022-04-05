import { roomEnum, taskType } from '../enmus/index';
import * as utils from '../utils/index';
import Root from './root';

class MultiTask extends Root {
  constructor() {
    super();
  }

  public init(creep: Creep) {
    if (!creep.memory.isBusy || !creep.memory.targetId || !creep.memory.originId) {
      this.accessToTask(creep);
    }

    this.getRunStrategies()[creep.memory.taskType](creep);
  }

  private getRunStrategies() {
    return {
      [taskType.HarvestEnergy]: (creep: Creep) => {
        if (!creep.store[RESOURCE_ENERGY]) creep.memory.isWork = false;

        if (creep.memory.isWork) {
          const origin = Game.getObjectById<StructureSpawn | StructureExtension>(creep.memory.originId);

          if (!origin) {
            console.log('---源目标被移除---', creep.memory.taskType);
            creep.memory.isBusy = false;
            creep.memory.isWork = false;
            return;
          }

          if (!origin.store.getFreeCapacity(RESOURCE_ENERGY)) {
            // 源目标存储能量已满，更新源目标
            const newOrigin = creep.room.find(FIND_MY_STRUCTURES, {
              filter: o =>
                (o.structureType === STRUCTURE_SPAWN || o.structureType === STRUCTURE_EXTENSION) &&
                o.store.getFreeCapacity(RESOURCE_ENERGY),
            })[0];

            if (newOrigin) {
              creep.memory.originId = newOrigin.id;
            } else {
              // 提前释放 creep
              creep.memory.isBusy = false;
              creep.memory.isWork = false;
            }
          } else {
            // 运输能量
            const status = creep.transfer(origin, RESOURCE_ENERGY);
            if (status === ERR_NOT_IN_RANGE) creep.moveTo(origin);
          }
        } else {
          if (!creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
            creep.memory.isWork = true;
            return;
          }
          // 收集
          const target = Game.getObjectById<Source>(creep.memory.targetId);
          const status = creep.harvest(target);
          if (status === ERR_NOT_IN_RANGE) creep.moveTo(target);
        }
      },
      [taskType.Build]: (creep: Creep) => {
        // 房间能量不足，重新分配任务
        if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
          creep.memory.isBusy = false;
          creep.memory.isWork = false;
          return;
        }

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
              creep.memory.isWork = false;
            }
          }
        } else {
          if (!creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
            creep.memory.isWork = true;
            return;
          }

          const storageTarget = creep.room.find<StructureStorage>(FIND_MY_STRUCTURES, {
            filter: o => o.structureType === STRUCTURE_STORAGE,
          })[0];

          const origin: any = Game.getObjectById(creep.memory.originId);
          let status: ScreepsReturnCode;

          if (storageTarget) {
            if (!origin.store[RESOURCE_ENERGY]) {
              creep.memory.isBusy = false;
              creep.memory.isWork = false;
              return;
            }
            status = creep.withdraw(origin, RESOURCE_ENERGY);
          } else {
            status = creep.harvest(origin);
          }

          if (status === ERR_NOT_IN_RANGE) creep.moveTo(origin);
        }
      },
      [taskType.Repair]: (creep: Creep) => {
        // 房间能量不足，重新分配任务
        if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
          creep.memory.isBusy = false;
          creep.memory.isWork = false;
          return;
        }

        if (!creep.store[RESOURCE_ENERGY]) creep.memory.isWork = false;

        if (creep.memory.isWork) {
          // 建造
          const target = Game.getObjectById<Structure>(creep.memory.targetId);
          const status = creep.repair(target);
          if (status === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            return;
          }
          // 维修完成，重新获取任务
          if (status === ERR_INVALID_TARGET) {
            creep.memory.isBusy = false;
            creep.memory.isWork = false;
          }
        } else {
          if (!creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
            creep.memory.isWork = true;
            return;
          }

          const storageTarget = creep.room.find<StructureStorage>(FIND_MY_STRUCTURES, {
            filter: o => o.structureType === STRUCTURE_STORAGE,
          })[0];

          const origin: any = Game.getObjectById(creep.memory.originId);
          let status: ScreepsReturnCode;

          if (storageTarget) {
            if (!origin.store[RESOURCE_ENERGY]) {
              creep.memory.isBusy = false;
              creep.memory.isWork = false;
              return;
            }
            status = creep.withdraw(origin, RESOURCE_ENERGY);
          } else {
            status = creep.harvest(origin);
          }

          if (status === ERR_NOT_IN_RANGE) creep.moveTo(origin);
        }
      },
      [taskType.CarryToStore]: (creep: Creep) => {},
      [taskType.CarryToTower]: (creep: Creep) => {},
      [taskType.CarryToLink]: (creep: Creep) => {},
      [taskType.Recycle]: (creep: Creep) => {},
    };
  }
}

export default new MultiTask();
