const TRANSPORTER_NUM = 1;

const transporterCount = _.sum(Game.creeps, creep => creep.memory.role === TRANSPORTER);

if (transporterCount < TRANSPORTER_NUM) {
    Game.spawns[SPAWN_NAME_0].spawnCreep(
        [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        `transporter${transporterCount}`,
        { memory: { role: TRANSPORTER, isWorking: false, isRenew: false, task: null } }
    );
}

// const HAVESTER_0_NUM = 1;
// const HAVESTER_1_NUM = 1;
// const UPGRADER_NUM = 1;
// const BUILDER_NUM = 2;
// const TRANSPORTER_NUM = 1;
// const REQUIRE_ENERGY_MAX = 1300;

// const havesters_0 = _.sum(Game.creeps, creep => creep.memory.role === HARVESTER_0);
// const havesters_1 = _.sum(Game.creeps, creep => creep.memory.role === HARVESTER_1);
// const upgraders = _.sum(Game.creeps, creep => creep.memory.role === UPGRADER);
// const builder = _.sum(Game.creeps, creep => creep.memory.role === BUILDER);

// const isFull = Game.rooms[ROOM0_NAME].energyAvailable >= REQUIRE_ENERGY_MAX;

// if (havesters_0 < HAVESTER_0_NUM && isFull) {
//     console.log('Spawning new harvester_0...');
//     Game.spawns[SPAWN_NAME].spawnCreep(
//         [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
//         `${HARVESTER_0}`,
//         { memory: { role: HARVESTER_0, isWorking: false } }
//     );
// } else if (havesters_1 < HAVESTER_1_NUM && isFull) {
//     console.log('Spawning new harvester_1...');
//     Game.spawns[SPAWN_NAME].spawnCreep(
//         [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
//         `${HARVESTER_1}`,
//         { memory: { role: HARVESTER_1, isWorking: false } }
//     );
// }  else if (upgraders < UPGRADER_NUM && isFull) {
//     console.log('Spawning new upgrader...');
//     Game.spawns[SPAWN_NAME].spawnCreep(
//         [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
//         `${UPGRADER}_${Game.time}`,
//         { memory: { role: UPGRADER, isWorking: false } }
//     );
// } else if (builder < BUILDER_NUM && isFull) {
//     console.log('Spawning new builder...');
//     Game.spawns[SPAWN_NAME].spawnCreep(
//         [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
//         `${BUILDER}_${Game.time}`,
//         { memory: { role: BUILDER, isWorking: false } }
//     );
// } else if (transporter < TRANSPORTER_NUM && isFull) {
//     Game.spawns[SPAWN_NAME].spawnCreep(
//         [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
//         'transporter',
//         { memory: { role: TRANSPORTER, isWorking: false, isRenew: false } }
//     );
// }
