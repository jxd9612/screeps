const Role = require('role');

class Builder extends Role {
    constructor() {
        super();
    }


    run(creep) {
        this.creep = creep;

        if (this.creep.store[RESOURCE_ENERGY] === 0) {
            this.creep.memory.isWorking = false;
        }
        if (!this.creep.memory.isWorking) {
            this.getSourceFromStorage();
        } else {
            this.buildStructure();
        }
    }

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
            // if (this.creep.upgradeController(this.creep.room.controller) === ERR_NOT_IN_RANGE) {
            //     this.creep.moveTo(this.creep.room.controller);
            // }
            this.reinforce();
        }
    }

    // 刷墙
    reinforce() {
        // const targets = this.creep.room.find(FIND_STRUCTURES, {
        //     filter: o => (o.structureType === STRUCTURE_WALL || o.structureType === STRUCTURE_RAMPART) && o.hits < 300000
        // });
        const targets = this.creep.room.find(FIND_STRUCTURES, {
            filter: o => o.structureType === STRUCTURE_RAMPART && o.hits < 1000000
        });
        if (targets.length) {
            if (this.creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(targets[0]);
            }
        } else {
            this.creep.say('...');
        }
    }
}

module.exports = Builder;
