import { creepEnum, roomEnum, spawnEnum } from './enmus/index';
import { creepPlan } from './config/index';
import multiTask from './creeps/multiTask';
import repairer from './creeps/Repairer';
import upgrader from './creeps/Upgrader';
import * as utils from './utils/index';

function main(): void {
  utils.tool.clearMemory();

  let roomLv = utils.tool.getRoomLevel(roomEnum.room_0);

  Object.keys(creepEnum).forEach((creepRole: creepEnum) => {
    const amount = utils.tool.getCreepAmount(creepRole);
    const plan = creepPlan.get(creepRole);
    if (amount < plan.amounts[roomLv - 1]) {
      Game.spawns[spawnEnum.spawn_0_0].spawnCreep(plan.abilities[roomLv - 1], `${creepRole}_${new Date().getTime()}`, {
        memory: { isBusy: false, isWork: false, role: creepRole, level: roomLv },
      });
    }
  });

  Object.keys(Game.creeps).forEach((creepName: string) => {
    const creep = Game.creeps[creepName];
    switch (creep.memory.role) {
      case creepEnum.Harvester:
        break;
      case creepEnum.MultiTask:
        multiTask.init(creep);
        break;
      case creepEnum.Repairer:
        repairer.init(creep);
        break;
      case creepEnum.Upgrader:
        upgrader.init(creep);
        break;
    }
  });
}

export const loop = main;
