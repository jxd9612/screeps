import utils from './utils';

import './init';

import { ROLE_STATUS } from './constants';

function main(): void {
    return;
    // 清除
    utils.cleanMemoryCreep();

    Object.keys(Game.rooms).forEach((roomName: string): void => {
        utils.bluePrint(roomName);
    });
    // if (utils.getAllCreepNumber() < ROLE_NUMBER.TOTAL) {
    //     utils.spawnCreep();
    // }
    // console.log(utils.getHarvesterMineralNum());
}

export const loop = main;
