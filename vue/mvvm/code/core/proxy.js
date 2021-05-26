const noop = () => {}

const sharedPropertypeDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
}
// 通过重写 get 和 set 来获取和更改 data 中的内容
// 此 demo 中，target 就是 vm，sourceKey 就是 $data(vm中的属性)，key 则是 $data 中对应的属性
function proxy (target, sourceKey, key) {
    sharedPropertypeDefinition.get = function proxyGet () {
        return target[sourceKey][key]
    }
    sharedPropertypeDefinition.set = function proxySet (val) {
        target[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertypeDefinition)
}
export {
  proxy
}