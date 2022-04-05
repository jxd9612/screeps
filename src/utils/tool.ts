import { creepEnum, roomEnum, taskType } from '../enmus/index';

class Tool {
  constructor() {}

  /**
   * 获取指定类型的creep数量
   * @creep命名 ${creepCode: creepCodeEnum}-uuid
   * @param code creep的代号
   * @returns creep数量
   */
  public getCreepAmount(creepCode?: creepEnum): number {
    let creepNames: Array<string> = [];
    if (creepCode) {
      creepNames = Object.keys(Game.creeps).filter((item: string) => item.split('_')[0] === creepCode);
    } else {
      creepNames = Object.keys(Game.creeps);
    }
    return creepNames.length;
  }

  /**
   * 根据任务类型、或者和 creepCode，获取 creep 数量
   * @param task
   * @param creepCode
   * @returns
   */
  public getCreepAmountByTaskType(task: taskType, creepCode?: creepEnum): number {
    if (!creepCode) {
      return Object.keys(Game.creeps).filter((name: creepEnum) => Game.creeps[name].memory.taskType === task).length;
    } else {
      return Object.keys(Game.creeps).filter(
        (name: creepEnum) => Game.creeps[name].memory.taskType === task && name.split('_')[0] === creepCode
      ).length;
    }
  }

  public getFreeCreep(creepCode: creepEnum): Creep {
    const creepNames: Array<string> = Object.keys(Game.creeps).filter((item: string) => item.split('-')[0] === creepCode);
    let creepObject: Creep;
    creepNames.forEach((creepName: string) => {
      if (!Game.creeps[creepName].memory.isBusy) creepObject = Game.creeps[creepName];
    });
    return creepObject;
  }

  /**
   * @returns 时间戳字符串
   */
  public getUuid(): string {
    return new Date().getTime().toString();
  }

  /**
   * 获取当前房间控制器等级
   * @param roomName
   * @returns 等级，0-8
   */
  public getRoomLevel(roomName: roomEnum): number {
    return Game.rooms[roomName].controller.level;
  }

  /**
   * 获取本房间的可用能量总量
   * @param room
   * @returns
   */
  public getRoomEnergyAvailable(room: roomEnum): number {
    return Game.rooms[room].energyAvailable;
  }

  /**
   * 获取本房间的能量容量上限
   * @param room
   * @returns
   */
  public getRoomEnergyCapacity(room: roomEnum): number {
    return Game.rooms[room].energyCapacityAvailable;
  }

  /**
   * 能量是否已满
   * @param room
   * @returns
   */
  public roomEnergyIsFull(room: roomEnum): boolean {
    return this.getRoomEnergyAvailable(room) === this.getRoomEnergyCapacity(room);
  }

  /**
   * 睡眠
   * @param delay 多少个tick
   */
  public sleep(delay: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const later: number = Game.time + delay;
      while (Game.time < later) {}
      resolve();
    });
  }

  /**
   * 清除 memory 缓存
   */
  public clearMemory() {
    Object.keys(Memory.creeps || {}).forEach(name => {
      if (!Game.creeps[name]) {
        console.log(`delete ${name}`);
        delete Memory.creeps[name];
      }
    });
  }
}

export default new Tool();
