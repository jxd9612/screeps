import { ROLE_TYPE } from './constants';
import './init';

class Utils {
    constructor() {}

    // 清除缓存中的creep尸体
    cleanMemoryCreep(): void {
        Object.keys(Memory.creeps).forEach((creepName: string): void => {
            if (!Game.creeps[creepName]) {
                delete Memory.creeps[creepName];
            }
        });
    }

    bluePrint(roomName: string): void {
        // const bluePrint = {};
        // Object.assign(Memory.rooms[roomName], { bluePrint: {} });
        if (!Memory.rooms[roomName]) {
            Object.assign(Memory.rooms, {
                [roomName]: {
                    bluePrint: {},
                },
            });
        }
        if (!Memory.rooms[roomName].hasOwnProperty('bluePrint')) {
        }
        const room: Room = Game.rooms[roomName];
        const level: number = room.controller.level;
        const sourceTargets: Array<Source> = room.find(FIND_SOURCES);
        if (level <= 3) {
            sourceTargets.forEach((source: Source) => {
                const collectPos: number = this.getSourceVacancy(source);
            });
        } else if (level <= 5) {
        } else {
            console.log('暂不考虑');
        }
    }

    tactics(level: number): void {}

    spawnCreep(): void {}

    // 获取能量可采集位置数量
    getSourceVacancy(source: Source): number {
        // const source = { x: sourceTarget.pos.x };
        console.log('采集点获取失败！');
        return 0;
    }

    // 获取该角色数量
    getRoleNumber(type: ROLE_TYPE): number {
        return this.getAllCreeps().filter((o: any): boolean => o.memory.role === type).length;
    }

    // 获取所有creep数量
    getAllCreepNumber(): number {
        return Object.keys(Game.creeps).length;
    }

    // 获取所有的creep
    getAllCreeps(): Array<Creep> {
        const obj: Array<Creep> = [];
        Object.keys(Game.creeps).forEach((name: string): void => {
            obj.push(Game.creeps[name]);
        });
        return obj;
    }
}

export default new Utils();
