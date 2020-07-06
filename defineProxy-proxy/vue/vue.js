function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    Object.keys(data).forEach((key) => {
        defineReactive(data, key, data[key])
    })
}
function defineReactive(obj, key, value) {
    let dep = new Dep();
    observe(value);  // 递归监听属性值为对象
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        set: (newValue) => {
            console.log('值被设置')
            if (newValue !== value) {
                observe(newValue);
                value = newValue;
                console.log(dep, 'dep')
                //更新视图
                dep.notify();
            }
        },
        get: () => {
            console.log('值被获取', Dep)
            // 收集依赖
            if (Dep.target) {
                dep.addSub(Dep.target);
            }
            return value;
        },
    })
}
// 依赖收集 订阅者列表
// 主要负责收集订阅者，然后再属性变化的时候执行对应订阅者的更新函数
function Dep() {
    this.subs = [];
}
Dep.prototype = {
    addSub: function (sub) {
        this.subs.push(sub);
    },
    notify: function () {
        console.log(this.subs, 'this.subs')
        this.subs.forEach(function (sub) {
            sub.update();
        });
    }
};
// 订阅者
function Watcher(data, key, cb) {
    this.cb = cb;
    this.data = data;
    this.key = key;
    // 此处为了触发属性的getter，从而在dep添加自己，结合Observer更易理解
    this.value = this.get();
}
Watcher.prototype = {
    update: function () {
        this.run(); // 属性值变化收到通知
    },
    run: function () {
        var value = this.get(); // 取到最新值
        console.log(value, '取到最新值')
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb(); // 执行Compile中绑定的回调，更新视图
        }
    },
    get: function () {
        Dep.target = this;  // 将当前订阅者指向自己
        var value = this.data[this.key];   // 触发getter，添加自己到属性订阅器中
        Dep.target = null;  // 添加完毕，重置
        return value;
    }
};
function SelfVue(data, key, cb) {
    this.data = data;
    observe(data);
    cb(); // 初始化模板数据的值
    new Watcher(this.data, key, cb);
    return this;
}