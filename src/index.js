"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LOCK_KEY = "@lock";
/**
 * 在函数返回的 Promise 完成之前，其它调用都会直接被忽略掉。
 * 保证同时只有一个pendingKey相同的协程正在执行。
 * pendingKey 用于区分不同的协程，如果有多个协程被标记为同一个pendingKey，同一时刻只有一个协程会执行
 * 调用了但当前不能被执行的协程会被忽略
 */
function lock(fn) {
    if (typeof fn === "function") {
        // 如果是用lock包裹函数 lock(()=>{})
        return function exe() {
            if (fn[LOCK_KEY]) {
                return;
            }
            fn[LOCK_KEY] = true;
            return Promise.resolve(fn.apply(this, arguments)).then(r => {
                delete fn[LOCK_KEY];
                return r;
            }, e => {
                delete fn[LOCK_KEY];
                throw e;
            });
        };
    }
    else {
        // 否则用于注解
        return (target, key, descriptor) => {
            const cacheKey = `${LOCK_KEY}_${key}`;
            function exe() {
                let orgFn = this[cacheKey];
                if (orgFn[LOCK_KEY]) {
                    return;
                }
                orgFn[LOCK_KEY] = true;
                return Promise.resolve(orgFn.apply(this, arguments)).then(r => {
                    delete orgFn[LOCK_KEY];
                    return r;
                }, e => {
                    delete orgFn[LOCK_KEY];
                    throw e;
                });
            }
            if (descriptor === undefined) {
                // 类字段 f = ()=>{} 箭头函数
                return {
                    get() {
                        if (typeof this[cacheKey] === "function") {
                            return exe;
                        }
                        else {
                            return this[cacheKey];
                        }
                    },
                    set(value) {
                        this[cacheKey] = value;
                    }
                };
            }
            else {
                // 类方法 f(){}
                target[cacheKey] = descriptor.value;
                descriptor.value = exe;
                return descriptor;
            }
        };
    }
}
exports.lock = lock;
//# sourceMappingURL=index.js.map