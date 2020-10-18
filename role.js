class Role {
    constructor() {}

    checkLive() {
        // 当 spawn 生产 creep 时，终止 renew 操作
        if (Game.spawns[SPAWN_NAME_0].spawning || this.creep.room.energyAvailable === 0) {
            this.creep.memory.isRenew = false;
            return;
        }
        if (this.creep.ticksToLive < 200) {
            this.creep.memory.isRenew = true;
            this.creep.memory.isWorking = false;
        }
        if (this.creep.memory.isRenew) {
            if (Game.spawns[SPAWN_NAME_0].renewCreep(this.creep) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(Game.spawns[SPAWN_NAME_0]);
            }
            if (this.creep.ticksToLive > 1000) {
                this.creep.memory.isRenew = false;
            }
        }
        return this.creep.memory.isRenew;
    }

    // 从 storage 获取能量
    getSourceFromStorage(amount) {
        const storageTarget = this.creep.room.storage;
        if (storageTarget) {
            const status = this.creep.withdraw(storageTarget, RESOURCE_ENERGY, amount);
            if (status === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(storageTarget);
            } else if (status === ERR_NOT_ENOUGH_RESOURCES) {
                this.creep.say('...');
            }
        } else {
            console.log('storage 不存在！');
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

    // 从 link 获取能量
    getSourceFromLink(targetId, amount) {
        const linkTarget = Game.getObjectById(targetId);
        if (linkTarget) {
            const status = this.creep.withdraw(linkTarget, RESOURCE_ENERGY, amount);
            if (status === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(linkTarget);
            } else if (status === ERR_NOT_ENOUGH_RESOURCES) {
                this.creep.say('...');
            }
        } else {
            console.log('该 link 不存在！');
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

    // 从 container 获取能量
    getSourceFromContainer(targetId, amount) {
        const containerTarget = Game.getObjectById(targetId);
        if (containerTarget) {
            if (containerTarget.store[RESOURCE_ENERGY] < 200) {
                this.getSourceFromStorage();
            } else {
                const status = this.creep.withdraw(containerTarget, RESOURCE_ENERGY, amount);
                if (status === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(containerTarget);
                } else if (status === ERR_NOT_ENOUGH_RESOURCES) {
                    this.creep.say('...');
                }
            }
        } else {
            console.log('该 container 不存在！');
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

    // 将能量运输给 storage
    transferSourceToStorage() {
        const storageTarget = this.creep.room.storage;
        if (storageTarget) {
            const status = this.creep.transfer(storageTarget, RESOURCE_ENERGY);
            if (status === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(storageTarget);
            }
            if (this.creep.store[RESOURCE_ENERGY] === 0 || status === ERR_FULL) {
                this.creep.memory.isWorking = false;
            }
        } else {
            console.log('storage 不存在！');
        }
    }

    // 将能量运输给 link
    transferSourceToLink(targetId) {
        const linkTarget = Game.getObjectById(targetId);
        if (linkTarget) {
            const status = this.creep.transfer(linkTarget, RESOURCE_ENERGY);
            if (status === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(linkTarget);
            }
            if (this.creep.store[RESOURCE_ENERGY] === 0 || status === ERR_FULL) {
                this.creep.memory.isWorking = false;
            }
        } else {
            console.log('该 link 不存在！');
        }
    }

    // 将能量运输给 container
    transferSourceToContainer(targetId) {
        const containerTarget = Game.getObjectById(targetId);
        if (containerTarget) {
            const status = this.creep.transfer(containerTarget, RESOURCE_ENERGY);
            if (status === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(containerTarget);
            }
            if (this.creep.store[RESOURCE_ENERGY] === 0 || status === ERR_FULL) {
                this.creep.memory.isWorking = false;
            }
        } else {
            console.log('该 container 不存在！');
        }
    }
}

module.exports = Role;
