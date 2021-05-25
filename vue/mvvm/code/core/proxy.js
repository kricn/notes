const noop = () => {}

const sharedPropertypeDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
}

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