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
        if (this.creep.store[RESOURCE_ENERGY] === 0) {
            this.creep.memory.isWorking = false;
        }
        if (!this.creep.memory.isWorking) {
            this.getSource(SOURCE_ID0, [LOCATION_2.x, LOCATION_2.y]);
        } else {
            const linkTarget = Game.getObjectById(LINK_ID0);
            if (linkTarget.store[RESOURCE_ENERGY] < 800) {
                this.creep.transfer(linkTarget, RESOURCE_ENERGY);
            } else {
                // this.transferSourceToContainer('5f8ab50bfe35864cd6408307');
                const containerTarget = this.creep.room.find(FIND_STRUCTURES, {
                    filter: o => o.structureType === STRUCTURE_CONTAINER && o.store[RESOURCE_ENERGY] < o.store.getCapacity() && o.pos.x === LOCATION_2.x && o.pos.y === LOCATION_2.y
                });
                if (containerTarget.length) {
                    this.creep.transfer(containerTarget[0], RESOURCE_ENERGY);
                }
            }
        }
    }

    onlyWork() {
        const containerTarget = this.creep.room.find(FIND_STRUCTURES, {
            filter: o => o.structureType === STRUCTURE_CONTAINER && o.store[RESOURCE_ENERGY] < o.store.getCapacity() &&
                        ((o.pos.x === LOCATION_0.x && o.pos.y === LOCATION_0.y) || (o.pos.x === LOCATION_1.x && o.pos.y === LOCATION_1.y))
        })
        if (containerTarget.length) {
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
