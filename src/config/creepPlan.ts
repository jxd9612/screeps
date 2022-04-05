import { creepEnum } from '../enmus/index';

const multiTask = {
  amounts: [6, 6, 6, 6, 3, 3, 3, 3],
  abilities: [
    [WORK, CARRY, MOVE, MOVE], // 250
    [WORK, CARRY, MOVE, MOVE], // 250
    [WORK, WORK, CARRY, CARRY, MOVE, MOVE], // 400
    [WORK, WORK, CARRY, CARRY, MOVE, MOVE], // 400
    [WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], // 450
    [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], // 500
    [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], // 650
    [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], // 650
  ],
};

const repairer = {
  amounts: [0, 0, 0, 1, 2, 2, 2, 2],
  abilities: [
    [], // 0
    [], // 0
    [], // 0
    [WORK, WORK, CARRY, CARRY, MOVE, MOVE], // 400
    [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], // 800
    [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], // 800
    [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], // 800
    [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], // 800
  ],
};

const upgrader = {
  amounts: [1, 2, 2, 1, 1, 1, 1, 1],
  abilities: [
    [WORK, CARRY, MOVE, MOVE], // 250
    [WORK, CARRY, MOVE, MOVE], // 250
    [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], // 600
    [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], // 800
    [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], // 600
    [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], // 600
    [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], // 600
    [WORK, CARRY, MOVE], // 200
  ],
};

const harvester = {
  amounts: [0, 0, 0, 1, 2, 2, 2, 2],
  abilities: [
    [], // 0
    [], // 0
    [], // 0
    [WORK, WORK, WORK, WORK, MOVE, MOVE], // 500
    [WORK, WORK, WORK, WORK, MOVE, MOVE], // 500
    [WORK, WORK, WORK, WORK, MOVE, MOVE], // 500
    [WORK, WORK, WORK, WORK, MOVE, MOVE], // 500
    [WORK, WORK, WORK, WORK, MOVE, MOVE], // 500
  ],
};

const creepPlan: Map<creepEnum, custom.CreePlan> = new Map([
  [creepEnum.MultiTask, multiTask],
  [creepEnum.Repairer, repairer],
  [creepEnum.Upgrader, upgrader],
  [creepEnum.Harvester, harvester],
]);

export default creepPlan;
