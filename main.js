require('common');
require('init');
const utils = require('utils');

const Transporter = require('role.transporter');
const Harvester = require('role.harvester');
const Builder = require('role.builder');
const Upgrader = require('role.upgrader');

const harvester = new Harvester();
const upgrader = new Upgrader();
const builder = new Builder();
const transporter = new Transporter();

// const TaskChecker = require('taskChecker');
// const task = new TaskChecker(ROOM0_NAME);

module.exports.loop = function () {
    Object.keys(Memory.creeps || {}).forEach(name => {
        if (!Game.creeps[name]) {
            console.log(`delete ${name}`);
            delete Memory.creeps[name];
        }
    });

    // const resouceLink = Game.rooms[ROOM0_NAME].find(FIND_MY_STRUCTURES, { filter: item => item.id === LINK_ID0 })[0];
    // if (resouceLink.store[RESOURCE_ENERGY] >= 500) {
    //     const targetLink = Game.rooms[ROOM0_NAME].find(FIND_MY_STRUCTURES, { filter: item => item.id === LINK_ID1 })[0];
    //     if (targetLink.store[RESOURCE_ENERGY] <= 400) resouceLink.transferEnergy(targetLink);
    // }

    utils.tower.run();
    utils.spawnCreep.run();

    Object.keys(Game.creeps).forEach(name => {
        const creep = Game.creeps[name];
        switch(creep.memory.role) {
            case HARVESTER_TYPE0:
                harvester.run(creep);
                break;
            case HARVESTER_TYPE1:
                harvester.run(creep);
                break;
            case UPGRADER:
                upgrader.run(creep);
                break;
            case BUILDER:
                builder.run(creep);
                break;
            case TRANSPORTER:
                transporter.run(creep);
                break;
            default:
                console.log('未知错误');
        }
    });
}