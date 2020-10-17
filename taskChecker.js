class TaskChecker {
    constructor(roomName) {
        this.room =  Game.rooms[roomName];
        Memory.tasks = [];
    }

    pushTask() {
        let tasks;
        if (Memory.tasks.length) {
            tasks = Memory.tasks.filter(_ => _);
            Memory.tasks.length = 0;
        } else {
            tasks = Memory.tasks;
        }

        // const sourceTargets = this.room.find(FIND_STRUCTURES, {
        //     filter: o => o.structureType === STRUCTURE_CONTAINER ||
        // });
        // sourceTargets.forEach(target => {
        //     const o = tasks.filter(_ => _.targetId === target.id);
        //     if (o.length) return;
        //     tasks.push({
        //         targetId: target.id,
        //         type: TYPE_GET_SOURCE,
        //         status: STATUS_IDLE,
        //         isDone: false,
        //         executor: [],
        //     });
        // });

        const refuelTargets = this.room.find(FIND_MY_STRUCTURES, {
            filter: o => ((o.structureType === STRUCTURE_SPAWN || o.structureType === STRUCTURE_EXTENSION) && o.energy < o.energyCapacity) ||
                        (o.structureType === STRUCTURE_TOWER && o.energy < o.energyCapacity * 0.5)
        })
        // console.log(JSON.stringify(refuelTargets));
        refuelTargets.forEach(target => {
            const o = tasks.filter(_ => _.targetId === target.id);
            if (o.length) return;
            tasks.push({
                targetId: target.id,
                type: TYPE_REFUEL,
                status: STATUS_IDLE,
                isDone: false,
                executor: [],
            });
        });

        Memory.tasks = tasks;
    }
}

module.exports = TaskChecker;