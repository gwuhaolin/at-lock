[![Npm Package](https://img.shields.io/npm/v/at-lock.svg?style=flat-square)](https://www.npmjs.com/package/at-lock)
[![Build Status](https://img.shields.io/circleci/project/github/gwuhaolin/at-lock.svg?style=flat-square)](https://circleci.com/gh/gwuhaolin/at-lock/)
[![Npm Downloads](http://img.shields.io/npm/dm/at-lock.svg?style=flat-square)](https://www.npmjs.com/package/at-lock)
[![Dependency Status](https://david-dm.org/gwuhaolin/at-lock.svg?style=flat-square)](https://npmjs.org/package/at-lock)

# 防暴击装饰器@lock

在异步函数返回的Promise完成之前，其它调用都会直接被忽略掉，防止用户快速点击时多次触发异步函数。

使用方法有3种，以适应各种场景：
1. 装饰类字段箭头函数
2. 装饰类成员函数
3. 直接包裹函数

代码如下：
```js
import { lock } from 'at-lock';

class Test {
  // 1. 装饰类字段箭头函数
  @lock()
  a = async () => {};

  // 2. 装饰类成员函数
  @lock()
  async b() {}

  // 3. 用lock直接包裹函数 lock(()=>{})
  c = lock(async () => {});
}
```

