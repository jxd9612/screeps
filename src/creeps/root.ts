import { creepEnum, requireLevelEnum, roomEnum, taskType } from '../enmus/index';
import { creepPlan, roomPlan } from '../config/index';
import * as utils from '../utils/index';

class Root {
  constructor() {}

  protected accessToTask(creep: Creep) {
    creep.memory.originId = '';
    creep.memory.targetId = '';
    creep.memory.taskType = '';

    const strategy = this.getAccessToTaskStrategy();
    strategy[creep.memory.role](creep);
  }

  /**
   * 动态调节各项任务所需的 creep 数量
   */
  private getReqLvNumStrategy() {
    return {
      [creepEnum.MultiTask]: (creep: Creep): number => {
        const storageTarget = creep.room.find(FIND_MY_STRUCTURES, {
          filter: o => o.structureType === STRUCTURE_STORAGE && o.store.getFreeCapacity(RESOURCE_ENERGY),
        })[0];

        if (storageTarget) {
          if (creep.memory.taskType === taskType.CarryToStore) {
            const available = creep.room.energyAvailable;
            const capacity = creep.room.energyCapacityAvailable;
            if (available <= capacity * 0.3) return requireLevelEnum.Important;
            if (available <= capacity * 0.6) return requireLevelEnum.Urgent;
            return requireLevelEnum.NotUrgent;
          }

          if (creep.memory.taskType === taskType.CarryToLink) {
            const linkOutputLen = roomPlan.get(creep.room.name as roomEnum).link.output.length;
            if (linkOutputLen <= 2 && linkOutputLen > 0) return requireLevelEnum.NotUrgent;
            if (linkOutputLen > 2) return requireLevelEnum.Urgent;
            return requireLevelEnum.NotRequire;
          }

          if (creep.memory.taskType === taskType.CarryToTower) {
            const roomLv = creep.room.controller.level;
            if (3 <= roomLv && roomLv < 8) return requireLevelEnum.NotUrgent;
            return requireLevelEnum.Urgent;
          }
        }

        if (creep.memory.taskType === taskType.HarvestEnergy) {
          const roomLv = creep.room.controller.level;
          if (roomLv <= 4) return requireLevelEnum.ImportantAndUrgent;
          return requireLevelEnum.NotRequire;
        }

        if (creep.memory.taskType === taskType.Build) {
          return requireLevelEnum.ALL;
        }

        if (creep.memory.taskType === taskType.Repair) {
          return requireLevelEnum.ALL;
        }

        // 该 creep 无任务类型
        return requireLevelEnum.Leisure;
      },
    };
  }

  private getAccessToTaskStrategy() {
    return {
      [creepEnum.MultiTask]: (creep: Creep) => {
        // 有 storage 容器时，多面手主要担任运输工作
        const storageTarget = creep.room.find<StructureStorage>(FIND_MY_STRUCTURES, {
          filter: o => o.structureType === STRUCTURE_STORAGE,
        })[0];


        const reqNumber = this.getReqLvNumStrategy()[creepEnum.MultiTask](creep);

        if (storageTarget) {
          // 从 container 处搬运能量至 storage 容器
          const carryToStoreNum = utils.tool.getCreepAmountByTaskType(taskType.CarryToStore, creepEnum.MultiTask);
          if (reqNumber === requireLevelEnum.Leisure || carryToStoreNum < reqNumber) {
            const containerTarget = creep.room.find(FIND_STRUCTURES, {
              filter: o => o.structureType === STRUCTURE_CONTAINER && o.store[RESOURCE_ENERGY],
            })[0];
            if (containerTarget) {
              creep.memory.isBusy = true;
              creep.memory.taskType = taskType.CarryToStore;
              creep.memory.originId = containerTarget.id;
              creep.memory.targetId = storageTarget.id;
              return;
            }
          }

          // 从 link 处搬运能量至 storage 容器（暂）

          // 从 storage 容器搬运能量至 link 处
          const carryToLinkNum = utils.tool.getCreepAmountByTaskType(taskType.CarryToLink, creepEnum.MultiTask);
          if (reqNumber === requireLevelEnum.Leisure || carryToLinkNum < reqNumber) {
            const outputLinks = roomPlan.get(creep.room.name as roomEnum).link.output;

            if (outputLinks.length) {
              let linkTarget: AnyOwnedStructure = null;

              for (let i = 0; i < outputLinks.length; i++) {
                linkTarget = creep.room.find(FIND_MY_STRUCTURES, {
                  filter: o =>
                    o.id === outputLinks[i] &&
                    o.structureType === STRUCTURE_LINK &&
                    o.store[RESOURCE_ENERGY] < o.store.getCapacity(RESOURCE_ENERGY) * 0.8,
                })[0];
                if (linkTarget) break; // 以获取到符合目标，退出循环
              }

              if (linkTarget) {
                creep.memory.isBusy = true;
                creep.memory.taskType = taskType.CarryToLink;
                creep.memory.originId = storageTarget.id;
                creep.memory.targetId = linkTarget.id;
                return;
              }
            }
          }

          // 从 storage 容器搬运能量至 tower
          const carryToTowerNum = utils.tool.getCreepAmountByTaskType(taskType.CarryToTower, creepEnum.MultiTask);
          if (reqNumber === requireLevelEnum.Leisure || carryToTowerNum < reqNumber) {
            const towerTarget = creep.room.find(FIND_MY_STRUCTURES, {
              filter: o => o.structureType === STRUCTURE_TOWER && o.store[RESOURCE_ENERGY] < o.store.getCapacity(RESOURCE_ENERGY) * 0.8,
            })[0];
            if (towerTarget && storageTarget.store[RESOURCE_ENERGY]) {
              creep.memory.isBusy = true;
              creep.memory.taskType = taskType.CarryToTower;
              creep.memory.originId = storageTarget.id;
              creep.memory.targetId = towerTarget.id;
              return;
            }
          }
        }

        // 回收掉落能量（暂）

        // 充当 harvester 收集能量（控制器四级之后不再主动收集能量）
        const harvestEnergyNum = utils.tool.getCreepAmountByTaskType(taskType.HarvestEnergy, creepEnum.MultiTask);
        if (reqNumber === requireLevelEnum.Leisure || harvestEnergyNum < reqNumber) {
          if (!utils.tool.roomEnergyIsFull(creep.room.name as roomEnum)) {
            creep.memory.isBusy = true;
            creep.memory.taskType = taskType.HarvestEnergy;
            const origin = creep.room.find<StructureStorage | StructureSpawn | StructureExtension>(FIND_MY_STRUCTURES, {
              filter: o =>
                (o.structureType === STRUCTURE_SPAWN || o.structureType === STRUCTURE_EXTENSION) &&
                o.store.getFreeCapacity(RESOURCE_ENERGY),
            })[0];
            creep.memory.originId = origin ? origin.id : '';
            // creep.memory.targetId = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE).id;
            creep.memory.targetId = creep.room.find(FIND_SOURCES_ACTIVE)[Math.round(Math.random())].id;
            return;
          }
        }

        // 充当 repairer 建造建筑
        const buildTarget = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
        if (buildTarget) {
          creep.memory.isBusy = true;
          creep.memory.taskType = taskType.Build;
          if (storageTarget) {
            creep.memory.originId = storageTarget.id;
          } else {
            creep.memory.originId = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE).id;
          }
          creep.memory.targetId = buildTarget.id;
          return;
        }

        // 充当 repairer 维修建筑
        const repairNormal = creep.room.find(FIND_MY_STRUCTURES, {
          filter: o => o.structureType !== STRUCTURE_RAMPART && o.hits < o.hitsMax * 0.8,
        })[0];
        if (repairNormal) {
          creep.memory.isBusy = true;
          creep.memory.taskType = taskType.Repair;
          if (storageTarget) {
            creep.memory.originId = storageTarget.id;
          } else {
            creep.memory.originId = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE).id;
          }
          creep.memory.targetId = repairNormal.id;
          return;
        }

        // 充当 repairer 刷墙
        const wallOrRempart = creep.room.find(FIND_STRUCTURES, {
          filter: o => (o.structureType === STRUCTURE_RAMPART || o.structureType === STRUCTURE_WALL) && o.hits < o.hitsMax * 0.5,
        })[0];
        if (wallOrRempart) {
          creep.memory.isBusy = true;
          creep.memory.taskType = taskType.Repair;
          if (storageTarget) {
            creep.memory.originId = storageTarget.id;
          } else {
            creep.memory.originId = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE).id;
          }
          creep.memory.targetId = wallOrRempart.id;
          return;
        }

        creep.say('multiTask daze', true);
      },
      [creepEnum.Harvester]: (creep: Creep) => {},
      [creepEnum.Repairer]: (creep: Creep) => {
        const storageTarget = creep.room.find(FIND_MY_STRUCTURES, {
          filter: o => o.structureType === STRUCTURE_STORAGE && o.store.getFreeCapacity(RESOURCE_ENERGY),
        })[0];

        // 修建
        const buildTarget = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
        if (buildTarget) {
          creep.memory.isBusy = true;
          creep.memory.taskType = taskType.Build;
          if (storageTarget) {
            creep.memory.originId = storageTarget.id;
          } else {
            creep.memory.originId = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE).id;
          }
          creep.memory.targetId = buildTarget.id;
          return;
        }

        // 维修
        const repairNormal = creep.room.find(FIND_MY_STRUCTURES, {
          filter: o => o.structureType !== STRUCTURE_RAMPART && o.hits < o.hitsMax * 0.8,
        })[0];
        if (repairNormal) {
          creep.memory.isBusy = true;
          creep.memory.taskType = taskType.Repair;
          creep.memory.originId = storageTarget.id;
          creep.memory.targetId = repairNormal.id;
          return;
        }

        // 刷墙
        const wallOrRempart = creep.room.find(FIND_STRUCTURES, {
          filter: o => (o.structureType === STRUCTURE_RAMPART || o.structureType === STRUCTURE_WALL) && o.hits < o.hitsMax,
        })[0];
        if (wallOrRempart) {
          creep.memory.isBusy = true;
          creep.memory.taskType = taskType.Repair;
          creep.memory.originId = storageTarget.id;
          creep.memory.targetId = wallOrRempart.id;
          return;
        }

        creep.say('repairer daze', true);
      },
      [creepEnum.Upgrader]: (creep: Creep) => {
        const storageTarget = creep.room.find(FIND_MY_STRUCTURES, {
          filter: o => o.structureType === STRUCTURE_STORAGE && o.store.getFreeCapacity(RESOURCE_ENERGY),
        })[0];
        creep.memory.isBusy = true;
        creep.memory.taskType = taskType.Upgrade;
        creep.memory.targetId = creep.room.controller.id;
        if (storageTarget) {
          creep.memory.originId = storageTarget.id;
        } else {
          creep.memory.originId = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE).id;
        }
      },
    };
  }
}

export default Root;
