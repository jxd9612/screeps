import { ROLE_STATUS, ROLE_TYPE } from "./constants";

const TEMP_NUM = 1;

class Utils {
    constructor() {}

    cleanMemoryCreep(): void {
        Object.keys(Memory.creeps).forEach(creepName => {
            if (!Game.creeps[creepName]) {
                delete Memory.creeps[creepName];
            }
        });
    }

    initCreep(): void {
        const harvester_energy_num = this.getRoleNumber(ROLE_TYPE.HARVESTER_ENERGY);
        if (harvester_energy_num < TEMP_NUM) {
            Game.spawns['JXD0_0'].spawnCreep([WORK, CARRY, MOVE], 'test', {
                memory: {
                    role: ROLE_TYPE.HARVESTER_ENERGY,
                    status: ROLE_STATUS.AT_IDLE,
                }
            })
        }
    }

    getSourceVacancy(sourceId: string): number {
        const sourceTarget: any = Game.getObjectById(sourceId);
        if (sourceTarget) {
            const sourcePos = {x: sourceTarget.pos.x};
        }
        console.log('采集点获取失败！');
        return 0;
    }

    getRoleNumber(type: ROLE_TYPE): number {
        return this.getAllCreeps().filter((o) :boolean => o.memory.role === type).length;
    }

    getAllCreeps(): Array<any> {
        const obj: Array<any> = [];
        Object.keys(Game.creeps).forEach((name): void => {
            obj.push(Game.creeps[name]);
        })
        return obj;
    }
}

export default new Utils();
