import utils from "./utils";

import './init';

function main(): void{
    // 清除
    utils.cleanMemoryCreep();

    // utils.initCreep();
    // console.log(utils.getHarvesterMineralNum());
}

export const loop = main;
