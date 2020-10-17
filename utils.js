class Source {
    constructor() {}

    func1() {
        console.log(this.creep.test);
    }
}

class Son extends Source {
    constructor() {
        super();
    }

    run(creep) {
        this.creep = creep;
        this.func1();
    }
}

const son = new Son();
son.run({test:'test'});
