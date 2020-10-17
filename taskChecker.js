const REFUEL = 0;
const GET_SOURCE = 1;
const REPAIR = 2;


const STATUS_IDLE = 0;
const STATUS_EXECUTING = 1;
const STATUS_SAME = 2;


class TaskChecker {
    constructor(roomName) {
        this.room =  Game.rooms[roomName];
        Memory.tasks = [];
    }

    pushTask() {
        let tasks;
        if (Memory.tasks.length) {
            tasks = Memory.tasks.filter(_ => !_.isDone);
            Memory.tasks.length = 0;
        } else {
            tasks = Memory.tasks;
        }

        const sourceTargets = this.room.find(FIND_SOURCES);
        sourceTargets.forEach(target => {
            const o = tasks.filter(_ => _.targetId === target.id);
            if (o.length) return;
            tasks.push({
                targetId: target.id,
                type: GET_SOURCE,
                status: STATUS_IDLE,
                isDone: false,
                executor: [],
            });
        });

        // const refuelTargets = this.room.find(FIND_MY_STRUCTURES, {
        //     filter: o => ((o.structureType === STRUCTURE_SPAWN || o.structureType === STRUCTURE_EXTENSION) && o.store[RESOURCE_ENERGY] < o.store.getFreeCapacity()) ||
        //                 (o.structureType === STRUCTURE_TOWER && o.store[RESOURCE_ENERGY] < o.store.getFreeCapacity() * 0.5)
        // })
        // refuelTargets.forEach(target => {
        //     const o = tasks.filter(_ => _.targetId === target.id);
        //     if (!o.length) return;
        //     tasks.push
        // });

        Memory.tasks = tasks;
    }
}

module.exports = TaskChecker;