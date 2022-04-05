const Role = require('role');

class Transporter extends Role {
    constructor() {
        super();
    }

    run(creep) {
        this.creep = creep;
        // 监测剩余时间
        if (this.checkLive()) return;

        // 任务发布模式
        // if (this.creep.memory.task) {
        //     if (!this.creep.memory.isWorking) {
        //         this.getSourceFromStorage();
        //     } else {
        //         const target = Game.getObjectById(this.creep.memory.task.targetId);
        //         if (this.creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        //             this.creep.moveTo(target);
        //         }
        //         if (this.creep.store[RESOURCE_ENERGY] === 0) {
        //             this.creep.memory.isWorking = false;
        //         }
        //         if (target.energy === target.energyCapacity) {
        //             this.creep.memory.task = null;
        //             this.creep.memory.isWorking = false;
        //         }
        //     }
        // } else {
        //     this.creep.moveTo(Game.spawns[SPAWN_NAME_0]);
        // }

        if (this.creep.store[RESOURCE_ENERGY] === 0) {
            this.creep.memory.isWorking = false;
        }
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
    }

    getSourceFromStorage(amount) {
        const storageTarget = this.creep.room.storage;
        if (storageTarget) {
            const status = this.creep.withdraw(storageTarget, RESOURCE_ENERGY, amount);
            if (status === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(storageTarget);
            } else if (status === ERR_NOT_ENOUGH_RESOURCES) {
                this.creep.say('empty');
                // this.checkOverflowFromContainer();
            }
        } else {
            console.log('stroage 不存在！');
        }
        // 当能量等于指定值或满载时，切换工作状态
        if (amount) {
            if (this.creep.store[RESOURCE_ENERGY] === amount) {
                this.creep.memory.isWorking = true;
            };
        } else {
            if (this.creep.store[RESOURCE_ENERGY] === this.creep.store.getCapacity()) {
                this.creep.memory.isWorking = true;
            }
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
                this.checkOverflowFromContainer();
            }
        }
    }

    // 监测 container 能量是否要溢出
    checkOverflowFromContainer() {
        const containerTarget = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: item => item.structureType === STRUCTURE_CONTAINER && item.store[RESOURCE_ENERGY] >= 800
        });
        if (containerTarget) {
            this.getSourceFromContainer(containerTarget.id);
            if (this.creep.memory.isWorking) {
                this.transferSourceToStorage();
            }
        } else {
            this.recycling();
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
            this.creep.say('...');
            // this.checkOverflowFromLink(LINK_ID1);
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
