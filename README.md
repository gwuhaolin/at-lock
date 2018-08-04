# @lock

用于防暴击

```js
class Test {
  // 装饰类字段箭头函数
  @lock() a = async () => {};

  // 装饰类成员函数
  @lock()
  async b() {}

  // 用lock直接包裹函数 lock(()=>{})
  addC = lock(async () => {});
}
```
