const com = require('common');
const Role = require('role');

class Upgrader extends Role {
    constructor() {
        super();
    }

    run(creep) {
        this.creep = creep;

        if (!this.creep.memory.isWorking) {
            this.getSourceFromLink(LINK_ID1);
        } else {
            this.creep.upgradeController(this.creep.room.controller);
            // if (this.creep.upgradeController(this.creep.room.controller) === ERR_NOT_IN_RANGE) {
            //     this.creep.moveTo(this.creep.room.controller);
            // }
            this.creep.moveTo(10, 39);
        }
        if (this.creep.store[RESOURCE_ENERGY] === 0) {
            this.creep.memory.isWorking = false;
        }
    }
}

module.exports = Upgrader;
