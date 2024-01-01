"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class an {
    _id = 1;
    get id() {
        return this.id + 56;
    }
    constructor() { }
    dosome() {
        console.log('an');
        this._id = this.id + 1;
    }
}
class dog extends an {
    constructor() {
        super();
    }
    get id() {
        return this._id + 56;
    }
    dosome() {
        this._id = this.id + 1;
        console.log('dog', this.id);
    }
}
let test = new dog();
test.dosome();
