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

    utils.tower.run();
    utils.spawnCreep.run();

    const resouceLink = Game.getObjectById(LINK_ID0);;
    if (resouceLink.store[RESOURCE_ENERGY] >= 310) {
        const targetLink = Game.getObjectById(LINK_ID1);
        if (targetLink.store[RESOURCE_ENERGY] < 600) resouceLink.transferEnergy(targetLink, 310);
    }

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