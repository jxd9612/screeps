const Role = require('role');

const LOCATION_0 = { x: 40, y: 28 };
const LOCATION_1 = { x: 41, y: 28 };
const LOCATION_2 = { x: 27, y: 14 };

class Harvester extends Role {
    constructor() {
        super();
    }

    run(creep) {
        this.creep = creep;

        if (this.creep.memory.role === HARVESTER_TYPE0) {
            this.onlyWork();
        } else {
            this.work();
        }
    }

    work() {
        // if (!this.creep.memory.isWorking) {
        //     this.getSource(SOURCE_ID0);
        // } else {
        //     if (this.creep.upgradeController(this.creep.room.controller) === ERR_NOT_IN_RANGE) {
        //         this.creep.moveTo(this.creep.room.controller);
        //     }
        // }
        // if (this.creep.store[RESOURCE_ENERGY] === 0) {
        //     this.creep.memory.isWorking = false;
        // }
        const containerTarget = this.creep.room.find(FIND_STRUCTURES, {
            filter: o => o.structureType === STRUCTURE_CONTAINER && o.pos.x === LOCATION_2.x && o.pos.y === LOCATION_2.y
        })
        if (containerTarget) {
            this.getSource(SOURCE_ID0, [containerTarget[0].pos.x, containerTarget[0].pos.y]);
        }
    }

    onlyWork() {
        const containerTarget = this.creep.room.find(FIND_STRUCTURES, {
            filter: o => o.structureType === STRUCTURE_CONTAINER && o.store[RESOURCE_ENERGY] < o.store.getCapacity() &&
                        ((o.pos.x === LOCATION_0.x && o.pos.y === LOCATION_0.y) || (o.pos.x === LOCATION_1.x && o.pos.y === LOCATION_1.y))
        })
        if (containerTarget) {
            this.getSource(SOURCE_ID1, [containerTarget[0].pos.x, containerTarget[0].pos.y]);
        }
    }

    // 获取能量
    getSource(targetId, pos) {
        const sourceTarget = Game.getObjectById(targetId);
        if (sourceTarget) {
            this.creep.harvest(sourceTarget);
            if (pos) {
                this.creep.moveTo(pos[0], pos[1]);
            } else {
                this.creep.moveTo(sourceTarget);
            }
        } else {
            console.log('该 source 不存在！');
        }
        if (this.creep.memory.role === HARVESTER_TYPE0) return;
        // 能量收集满后，切换状态
        if (this.creep.store[RESOURCE_ENERGY] === this.creep.store.getCapacity()) {
            this.creep.memory.isWorking = true;
        }
    }
}

module.exports = Harvester;
