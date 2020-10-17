require('common');
// require('init');

const Transporter = require('role.transporter');
const Harvester = require('role.harvester');
const Builder = require('role.builder');
const Upgrader = require('role.upgrader');

const harvester = new Harvester();
const upgrader = new Upgrader();
const builder = new Builder();
const transporter = new Transporter();

const HAVESTER_NUM = 3;
const UPGRADER_NUM = 0;
const BUILDER_NUM = 3;
const TRANSPORTER_NUM = 1;

const TaskChecker = require('taskChecker');
const task = new TaskChecker(ROOM0_NAME);

module.exports.loop = function () {
    Object.keys(Memory.creeps || {}).forEach(name => {
        if (!Game.creeps[name]) {
            console.log(`delete ${name}`);
            delete Memory.creeps[name];
        }
    });

    const towers = Game.rooms[ROOM0_NAME].find(FIND_MY_STRUCTURES, {
        filter: o => o.structureType === STRUCTURE_TOWER && o.store[RESOURCE_ENERGY] !== 0
    });
    towers.forEach(tower => {
        const closestHostile = tower.room.find(FIND_HOSTILE_CREEPS);
        if (closestHostile.length) {
            tower.attack(closestHostile[0]);
        } else {
            const repairTarget = tower.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: item => item.structureType === STRUCTURE_ROAD && item.hits < item.hitsMax * 0.75
            });
            if (repairTarget) tower.repair(repairTarget);   
        }
    });

    const harvesters = _.sum(Game.creeps, creep => creep.memory.role === HARVESTER);
    const builders = _.sum(Game.creeps, creep => creep.memory.role === BUILDER);
    const isFull = Game.rooms[ROOM0_NAME].energyAvailable >= 800;
    if (harvesters < HAVESTER_NUM && isFull) {
        Game.spawns[SPAWN_NAME_0].spawnCreep( [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], `${HARVESTER}_${Game.time}`, { memory: { role: HARVESTER, isWorking: false } });
    } else if (builders < BUILDER_NUM && isFull) {
        Game.spawns[SPAWN_NAME_0].spawnCreep( [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], `${BUILDER}_${Game.time}`, { memory: { role: BUILDER, isWorking: false } });
    }

    Object.keys(Game.creeps).forEach(name => {
        const creep = Game.creeps[name];
        if (creep.memory.role === HARVESTER) {
            harvester.run(creep);
        } else if (creep.memory.role === BUILDER) {
            builder.run(creep);
            // creep.suicide();
        } 
    });


    return;

    const resouceLink = Game.rooms[ROOM0_NAME].find(FIND_MY_STRUCTURES, { filter: item => item.id === LINK_ID0 })[0];
    if (resouceLink.store[RESOURCE_ENERGY] >= 500) {
        const targetLink = Game.rooms[ROOM0_NAME].find(FIND_MY_STRUCTURES, { filter: item => item.id === LINK_ID1 })[0];
        if (targetLink.store[RESOURCE_ENERGY] <= 400) resouceLink.transferEnergy(targetLink);
    }

    // const isFull = Game.rooms[ROOM0_NAME].energyAvailable === Game.rooms[ROOM0_NAME].energyCapacityAvailable;
    // const isFull = Game.rooms[ROOM0_NAME].energyAvailable >= 1300;

    Object.keys(Game.creeps).forEach(name => {
        const creep = Game.creeps[name];
        if (creep.memory.role === HARVESTER_0) {
            harvester.run(creep, HARVESTER_0);
        } else if (creep.memory.role === HARVESTER_1) {
            harvester.run(creep, HARVESTER_1);
        } else if (creep.memory.role === UPGRADER) {
            upgrader.run(creep);
        } else if (creep.memory.role === BUILDER) {
            builder.run(creep);
        } else if (creep.memory.role === TRANSPORTER) {
            transporter.run(creep);
        }
    });
}