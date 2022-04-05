/**
 * 孵化器枚举类
 */
export enum spawnEnum {
  spawn_0_0 = 'zn_0',
}

/**
 * 房间名枚举类
 */
export enum roomEnum {
  room_0 = 'E22S34',
  // room_0 = 'sim',
}

/**
 * creep 枚举类
 */
export enum creepEnum {
  MultiTask = 'MultiTask',
  Repairer = 'Repairer',
  Upgrader = 'Upgrader',
  Harvester = 'Harvester',
}

/**
 * 任务需求等级枚举类
 */
export enum requireLevelEnum {
  NotRequire = 0,
  NotUrgent = 1,
  Urgent = 2,
  Important = 3,
  ImportantAndUrgent = 4,
  ALL = 999,
  Leisure = -1,
}

/**
 * 任务类型
 */
export enum taskType {
  HarvestEnergy = 'HarvestEnergy',
  CarryToStore = 'CarryToStore',
  CarryFromLink = 'CarryFromLink',
  CarryToLink = 'CarryToLink',
  CarryToTower = 'CarryToTower',
  Recycle = 'Recycle',
  Build = 'Build',
  Repair = 'Repair',
  Upgrade = 'Upgrade',
  Cure = 'Cure',
}
