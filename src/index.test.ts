import { lock } from "./index";

async function sleep() {
  return new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
}

class Tester {
  name;
  constructor(name?) {
    this.name = name;
  }
  onA = () => this.a++;
  onB = () => this.b++;
  onC = () => this.c++;

  a = 0;
  @lock()
  addA = async () => {
    this.onA();
    await sleep();
  };

  b = 0;
  @lock()
  async addB() {
    this.onB();
    await sleep();
  }

  c = 0;
  addC = lock(async () => {
    this.onC();
    await sleep();
    return 1;
  });
}

describe("@lock", () => {
  it("箭头函数", async done => {
    const tester = new Tester();
    tester.addA();
    tester.addA();
    console.log(tester.a);
    expect(tester.a).toEqual(1);
    done();
  });

  it("类方法", async done => {
    const tester = new Tester();
    tester.addB();
    tester.addB();
    console.log(tester.b);
    expect(tester.b).toEqual(1);
    done();
  });

  it("包裹函数", async done => {
    const tester = new Tester();
    tester.addC();
    tester.addC();
    console.log(tester.c);
    expect(tester.c).toEqual(1);
    done();
  });

  it("箭头函数 覆盖", async done => {
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
  });

  it("类方法 覆盖", async done => {
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
  });

  it("包裹函数 覆盖", async done => {
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
  });
});
