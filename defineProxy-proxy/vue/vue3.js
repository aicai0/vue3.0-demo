// 将响应式与原始数据保存  防止重复代理 如下图所示
// let obj = {
//     a:1
// }
// let p = new Proxy(obj, basehandler)
// let p1 = new Proxy(obj, basehandler)
// let p2 = new Proxy(obj, basehandler)
// 原始=>响应式   存放代理后的对象
let toProxy = new WeakMap();
// 响应式=>原始  存放代理前的对象
let toRaw = new WeakMap();

let targetMap = new WeakMap();  // 收集依赖
let effectStack = []  // {name:effect()}  // 收集依赖对应关系
// {
//     target:{
//         key:[fn,fn,fn]
//     }
// }
// 收集依赖  动态创建依赖关系
function track (target, key) {  
    let effect = effectStack[effectStack.length-1];
    if(effect){  // 有对应关系 才创建关联
        let depMap = targetMap.get(target);
        if(depMap === undefined){
            depMap = new Map();
            targetMap.set(target, depMap);
        }
        let dep = depMap.get(key);
        if(dep === undefined) {
            dep = new Set();
            depMap.set(key, dep);
        }
        if(!dep.has(effect)){
            dep.add(effect)
        }
    }
}
// 更新视图
function trigger (target, key, info) {
    console.log("触发更新")
    console.log(targetMap)
    const depMap = targetMap.get(target);
    console.log(depMap)
    if(!depMap){
        return;
    }
    const effects = new Set();
    if(key){
        let deps = depMap.get(key);
        console.log(deps)
        if(deps){
            deps.forEach(effect=>{
                effects.add(effect)
            })
        }
    }
    effects.forEach(effect => effect())
}

// 观察者 代理 与vue2 不同
const baseHandler = {
    get (target, key) {
        console.log('收集依赖，数据初始化')
        const res = target[key];
        // 收集依赖  将effect key 对应起来  订阅
        track(target, key);
        return typeof res === "object" ? reactive(res) : res;  // 判断是否为对象 为对象的话继续代理
    },
    set (target, key, newVal) {
        console.log('数据变化')
        const info = {oldValue:target[key], newValue:newVal};
        // target[key] = newVal;  如果设置没成功 这对象不可以被设置 会报错 Reflect设置反射 有返回值
        const res = Reflect.set(target, key, newVal );
        // 通知更新
        // 触发私有属性才更新 如 arr length变化 不触发更新
        if(target.hasOwnProperty(key)){
            trigger(target, key, info);
        }
        return res;
    }
}
function reactive (target) {
    console.log(target,'响应式数据')
    // 如果不是对象 则返回
    if(typeof target !== 'object' && target === null){
        return target;
    }
    // 如果代理的数据中存在 则不再进行代理
    let proxy = toProxy.get(target)
    if(proxy){
        return proxy;   
    }
    // 如果对象已经代理过了 则返回该对象
    if(toRaw.has(target)){
        return target;   
    }
    // 创建观察者
    const observed = new Proxy(target, baseHandler);
    toProxy.set(target, observed);  // 原对象为键 代理后对象为值
    toRaw.set(observed, target);  // 原对象为键 代理后对象为值
    console.log(observed,'响应完成')
    return observed;
}

// let obj = {name:'aa'}
// effect(()=>{
//     console.log(obj.name)  // 此处触发get  然后收集依赖  将key effect 对应起来
// })
// obj.name = 'bb'
// effect 数据变化 更新视图的方法  默认执行一次 数据变化 再执行
function effect (fn) {
    // 数据变化 函数执行 变成响应式函数
    let effect = createReactiveEffect(fn);
    console.log(effect,'11')
    effect(); // 默认先执行一次
    return effect;
}
function createReactiveEffect(fn){
    let effect = function(){  // 响应式的effect
        return run(effect,fn);  // fn执行 且 存在栈中
    };
    console.log(effect,'effect')
    return effect;
}
function run (effect, fn) {
    console.log(effectStack,'effectStack')
    try{
        effectStack.push(effect);
        console.log(effectStack[0],'effect')
        return fn();
    }finally{
        effectStack.pop();
    }
}