const Role = require('role');

class Builder extends Role {
    constructor() {
        super();
    }


    run(creep) {
        this.creep = creep;
        if (!this.creep.memory.isWorking) {
            this.getSource(SOURCE_ID1);
        } else {
            this.buildStructure();
        }
        if (this.creep.store[RESOURCE_ENERGY] === 0) {
            this.creep.memory.isWorking = false;
        }
    }

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

    // run(creep) {
    //     this.creep = creep;
    //     if (!this.creep.memory.isWorking) {
    //         this.getSourceFromStorage();
    //     } else {
    //         this.buildStructure();
    //     }
    //     if (this.creep.store[RESOURCE_ENERGY] === 0) {
    //         this.creep.memory.isWorking = false;
    //     }
    // }

    buildStructure() {
        const buildTarget = this.creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
        if (buildTarget) {
            if (this.creep.build(buildTarget) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(buildTarget);
            }
        } else {
            this.repairContainer();
        }
    }

    // 维修 container
    repairContainer() {
        const containerTargets = this.creep.room.find(FIND_STRUCTURES, { filter: item => item.structureType === STRUCTURE_CONTAINER && item.hits < item.hitsMax });
        if (containerTargets.length) {
            if (this.creep.repair(containerTargets[0]) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(containerTargets[0])
            }
        } else {
            // this.repairWall();
            const refuelTarget = this.creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: o => o.structureType === STRUCTURE_TOWER && o.energy < o.energyCapacity * 0.5
            });
            if (refuelTarget) {
                if (this.creep.transfer(refuelTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(refuelTarget);
                }
            } else {
                if (this.creep.upgradeController(this.creep.room.controller) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(this.creep.room.controller);
                }
            }
        }
    }

    // 维修城墙
    repairWall() {
        const wallTarget = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: item => item.structureType === STRUCTURE_WALL && item.hits < 3000000 });
        if (wallTarget) {
            if (this.creep.repair(wallTarget) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(wallTarget)
            }
        } else {
            this.creep.say('等待任务...');
        }
    }
}

module.exports = Builder;
