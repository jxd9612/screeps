// 角色类型
export enum ROLE_TYPE {
    HARVESTER_ENERGY, // 采集者 - 能量
    HARVESTER_MINERAL, // 采集者 - 矿物
    BUILDER, // 建造者
    UPGRADER, // 升级者
    TRANSPORTER, // 运输者
}

// 角色状态
export enum ROLE_STATUS {
    AT_IDLE, // 空闲中
    AT_WORK, // 工作中
    AT_RENEW, // 翻新中
}
