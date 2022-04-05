const tower = {
  run() {
    const towers = Game.rooms[ROOM0_NAME].find(FIND_MY_STRUCTURES, {
      filter: o => o.structureType === STRUCTURE_TOWER && o.store[RESOURCE_ENERGY] !== 0,
    });
    towers.forEach(tower => {
      const closestHostile = tower.room.find(FIND_HOSTILE_CREEPS);
      if (closestHostile.length) {
        tower.attack(closestHostile[0]);
      } else {
        const repairTarget = tower.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: item => item.structureType === STRUCTURE_ROAD && item.hits < item.hitsMax * 0.5,
        });
        if (repairTarget) tower.repair(repairTarget);
      }
    });
  },
};

const spawnCreep = {
  run() {
    const harvester0Count = _.sum(Game.creeps, creep => creep.memory.role === HARVESTER_TYPE0);
    const harvester1Count = _.sum(Game.creeps, creep => creep.memory.role === HARVESTER_TYPE1);
    const builderCount = _.sum(Game.creeps, creep => creep.memory.role === BUILDER);
    const upgraderCount = _.sum(Game.creeps, creep => creep.memory.role === UPGRADER);

    const isSpawning = Game.spawns[SPAWN_NAME_0].spawning;
    if (harvester1Count < 1 && !isSpawning) {
      Game.spawns[SPAWN_NAME_0].spawnCreep(
        [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        `${HARVESTER_TYPE1}_${Game.time}`,
        { memory: { role: HARVESTER_TYPE1, isWorking: false } }
      );
    } else if (harvester0Count < 1 && !isSpawning) {
      Game.spawns[SPAWN_NAME_0].spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], `${HARVESTER_TYPE0}`, {
        memory: { role: HARVESTER_TYPE0, isWorking: false },
      });
    } else if (builderCount < 1 && !isSpawning) {
      Game.spawns[SPAWN_NAME_0].spawnCreep(
        [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
        `${BUILDER}_${Game.time}`,
        { memory: { role: BUILDER, isWorking: false } }
      );
    } else if (upgraderCount < 1 && !isSpawning) {
      Game.spawns[SPAWN_NAME_0].spawnCreep(
        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        `${UPGRADER}_${Game.time}`,
        { memory: { role: UPGRADER, isWorking: false } }
      );
    }
  },
};

module.exports = {
  tower,
  spawnCreep,
};
