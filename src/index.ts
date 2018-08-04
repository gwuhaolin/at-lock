const LOCK_KEY = "@lock";

/**
 * 在函数返回的 Promise 完成之前，其它调用都会直接被忽略掉。
 * 保证同时只有一个协程正在执行，调用了但当前不能被执行的协程会被忽略
 */
export function lock(fn?: Function): any {
  if (typeof fn === "function") {
    // 如果是用lock包裹函数 lock(()=>{})
    return function exe() {
      if (fn[LOCK_KEY]) {
        return;
      }
      fn[LOCK_KEY] = true;
      return Promise.resolve(fn.apply(this, arguments)).then(
        r => {
          delete fn[LOCK_KEY];
          return r;
        },
        e => {
          delete fn[LOCK_KEY];
          throw e;
        }
      );
    };
  } else {
    // 否则用于注解
    return (
      target: any,
      key: string,
      descriptor?: TypedPropertyDescriptor<any>
    ): any => {
      const cacheKey = `${LOCK_KEY}_${key}`;
      function exe() {
        let orgFn = this[cacheKey];
        if (orgFn[LOCK_KEY]) {
          return;
        }
        orgFn[LOCK_KEY] = true;
        return Promise.resolve(orgFn.apply(this, arguments)).then(
          r => {
            delete orgFn[LOCK_KEY];
            return r;
          },
          e => {
            delete orgFn[LOCK_KEY];
            throw e;
          }
        );
      }
      if (descriptor === undefined) {
        // 类字段 f = ()=>{} 箭头函数
        return {
          get() {
            if (typeof this[cacheKey] === "function") {
              return exe.bind(this);
            } else {
              return this[cacheKey];
            }
          },
          set(value: any) {
            this[cacheKey] = value;
          }
        };
      } else {
        // 类方法 f(){}
        target[cacheKey] = descriptor.value;
        descriptor.value = exe;
        return descriptor;
      }
    };
  }
}
