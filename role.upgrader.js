const Role = require('role');

class Upgrader extends Role {
    constructor() {
        super();
    }

    run(creep) {
        this.creep = creep;

        if (this.creep.store[RESOURCE_ENERGY] === 0) {
            this.creep.memory.isWorking = false;
        }
        if (!this.creep.memory.isWorking) {
            this.getSourceFromLink(LINK_ID1);
            // this.getSourceFromContainer('5f8ab50bfe35864cd6408307');
        } else {
            // if (this.creep.upgradeController(this.creep.room.controller) === ERR_NOT_IN_RANGE) {
            //     this.creep.moveTo(this.creep.room.controller);
            // }
            if (this.creep.pos.x !== 40 && this.creep.pos.x !== 14) {
                this.creep.moveTo(40, 14);
            } else {
                this.creep.upgradeController(this.creep.room.controller);
            }
        }
    }
}

module.exports = Upgrader;
