const com = require('common');
const Role = require('role');

class Transporter extends Role {
    constructor() {
        super();
    }

    run(creep) {
        this.creep = creep;
        // 监测剩余时间
        if (this.checkLive()) return;

        const target = this.creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: item => (item.structureType === STRUCTURE_EXTENSION || item.structureType === STRUCTURE_SPAWN) && item.energy < item.energyCapacity
        });
        if (target) {
            if (!this.creep.memory.isWorking) {
                this.getSourceFromStorage();
            } else {
                if (this.creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(target);
                }
            }
        } else {
            this.supplyTower();
        }
        if (this.creep.store[RESOURCE_ENERGY] === 0) {
            this.creep.memory.isWorking = false;
        }
    }

    // 为炮台补给能量
    supplyTower() {
        const towerTargets = this.creep.room.find(FIND_MY_STRUCTURES, {
            filter: item => item.structureType === STRUCTURE_TOWER  && item.energy < item.energyCapacity * 0.5
        });
        if (towerTargets.length) {
            this.getSourceFromStorage();
            if (this.creep.memory.isWorking) {
                if (this.creep.transfer(towerTargets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(towerTargets[0]);
                }
            }
        } else {
            // 监测是否能量过剩。如有则进入，没有则监测 link 能量是否溢出
            if (this.creep.store[RESOURCE_ENERGY] > 0) {
                this.transferSourceToStorage();
            } else {
                // this.checkOverflowFromContainer(CONTAINER_ID0);
                this.checkOverflowFromContainer();
            }
        }
    }

    // 监测 container 能量是否要溢出
    checkOverflowFromContainer() {
        const containerTarget = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: item => item.structureType === STRUCTURE_CONTAINER && item.store[RESOURCE_ENERGY] >= 800
        });
        if (containerTarget && containerTarget.store[RESOURCE_ENERGY] >= 800) {
            this.getSourceFromContainer(containerTarget.id);
            if (this.creep.memory.isWorking) {
                this.transferSourceToStorage();
            }
        } else {
            // this.recycling();
            this.checkOverflowFromLink(LINK_ID1);
        }
    }

    // 回收资源
    recycling() {
        const sourceTargets = this.creep.room.find(FIND_DROPPED_RESOURCES, { filter: item => item.energy >= 100 });
        if (sourceTargets.length) {
            const status = this.creep.pickup(sourceTargets[0]);
            if (status === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(sourceTargets[0]);
            } else if (status === ERR_FULL) {
                this.transferSourceToStorage();
            }
        } else {
            this.checkOverflowFromLink(LINK_ID1);
        }
    }

    // 监测 link 能量是否要溢出
    checkOverflowFromLink(targetId) {
        const linkTarget = Game.getObjectById(targetId);
        if (linkTarget) {
            if (linkTarget.store[RESOURCE_ENERGY] >= 600){
                this.getSourceFromLink(targetId, 200);
                if (this.creep.memory.isWorking) {
                    this.transferSourceToStorage();
                }
            } else {
                // this.recycling();
                this.creep.say('...');
            }
        } else {
            console.log('该 link 不存在！');
        }
    }
}

module.exports = Transporter;
