"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
function sleep() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            setTimeout(resolve, 1000);
        });
    });
}
class Tester {
    constructor(name) {
        this.onA = () => this.a++;
        this.onB = () => this.b++;
        this.onC = () => this.c++;
        this.a = 0;
        this.addA = () => __awaiter(this, void 0, void 0, function* () {
            this.onA();
            yield sleep();
        });
        this.b = 0;
        this.c = 0;
        this.addC = index_1.lock(() => __awaiter(this, void 0, void 0, function* () {
            this.onC();
            yield sleep();
        }));
        this.name = name;
    }
    addB() {
        return __awaiter(this, void 0, void 0, function* () {
            this.onB();
            yield sleep();
        });
    }
}
__decorate([
    index_1.lock()
], Tester.prototype, "addA", void 0);
__decorate([
    index_1.lock()
], Tester.prototype, "addB", null);
describe("@lock", () => {
    it("箭头函数", (done) => __awaiter(this, void 0, void 0, function* () {
        const tester = new Tester();
        tester.addA();
        tester.addA();
        console.log(tester.a);
        // expect(tester.a).toEqual(1);
        done();
    }));
    it("类方法", (done) => __awaiter(this, void 0, void 0, function* () {
        const tester = new Tester();
        tester.addB();
        tester.addB();
        console.log(tester.b);
        expect(tester.b).toEqual(1);
        done();
    }));
    it("包裹函数", (done) => __awaiter(this, void 0, void 0, function* () {
        const tester = new Tester();
        tester.addC();
        tester.addC();
        console.log(tester.c);
        expect(tester.c).toEqual(1);
        done();
    }));
    it("箭头函数 覆盖", (done) => __awaiter(this, void 0, void 0, function* () {
        const tester1 = new Tester(1);
        const tester2 = new Tester(2);
        tester2.onA = () => (tester2.a = -1);
        tester1.addA();
        tester1.addA();
        console.log(tester1.a);
        console.log(tester2.a);
        expect(tester1.a).toEqual(1);
        expect(tester2.a).toEqual(0);
        done();
    }));
    it("类方法 覆盖", (done) => __awaiter(this, void 0, void 0, function* () {
        const tester1 = new Tester();
        const tester2 = new Tester();
        tester2.onB = () => (tester2.b = -1);
        tester1.addB();
        tester1.addB();
        console.log(tester1.b);
        console.log(tester2.b);
        expect(tester1.b).toEqual(1);
        expect(tester2.b).toEqual(0);
        done();
    }));
    it("包裹函数 覆盖", (done) => __awaiter(this, void 0, void 0, function* () {
        const tester1 = new Tester();
        const tester2 = new Tester();
        tester2.onC = () => (tester2.c = -1);
        tester1.addC();
        tester1.addC();
        console.log(tester1.c);
        console.log(tester2.c);
        expect(tester1.c).toEqual(1);
        expect(tester2.c).toEqual(0);
        done();
    }));
});
//# sourceMappingURL=index.test.js.map