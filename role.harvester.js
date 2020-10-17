const Role = require('role');

const LOCATION_0 = { x: 23, y: 23 };
const LOCATION_1 = { x: 5, y: 45 };
const LOCATION_2 = { x: 4, y: 44 };

class Harvester extends Role {
    constructor() {
        super();
    }

    run(creep) {
        this.creep = creep;
        if (!this.creep.memory.isWorking) {
            this.getSource(SOURCE_ID0);
        } else {
            const target = this.creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: item => (item.structureType === STRUCTURE_EXTENSION || item.structureType === STRUCTURE_SPAWN) && item.energy < item.energyCapacity
            });
            if (target) {
                if (this.creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(target);
                }
            } else {
                const buildTarget = this.creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                if (buildTarget) {
                    if (this.creep.build(buildTarget) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(buildTarget);
                    }
                } else {
                    if (this.creep.upgradeController(this.creep.room.controller) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(this.creep.room.controller);
                    }
                }
            }
        }
        if (this.creep.store[RESOURCE_ENERGY] === 0) {
            this.creep.memory.isWorking = false;
        }
    }

    // run(creep, belong) {
    //     this.creep = creep;
    //     this.belong = belong;
    //     if (this.belong === HARVESTER_0) {
    //         if (!this.creep.memory.isWorking) {
    //             this.getSource(SOURCE_ID0, LOCATION_0);
    //         } else {
    //             // this.transferSourceToStorage();
    //             this.transferSourceToLink(LINK_ID0);
    //         }
    //     } else if (this.belong === HARVESTER_1) {
    //         if (!this.creep.memory.isWorking) {
    //             const target = Game.getObjectById(CONTAINER_ID0);
    //             if (target.store[RESOURCE_ENERGY] === target.store.getCapacity()) {
    //                 this.getSource(SOURCE_ID1, LOCATION_2);
    //             } else {
    //                 this.getSource(SOURCE_ID1, LOCATION_1);
    //             }
    //         } else {
    //             this.transferSourceToContainer(CONTAINER_ID0);
    //         }
    //     }
    // }

    // 获取能量
    getSource(targetId) {
        const sourceTarget = Game.getObjectById(targetId);
        if (sourceTarget) {
            const status = this.creep.harvest(sourceTarget);
            if (status === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(sourceTarget);
            }
        } else {
            console.log('该 source 不存在！');
        }
        // 能量收集满后，切换状态
        if (this.creep.store[RESOURCE_ENERGY] === this.creep.store.getCapacity()) {
            this.creep.memory.isWorking = true;
        }
    }
}

module.exports = Harvester;
