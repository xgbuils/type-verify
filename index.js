function typeVerify (value, types, cb) {
    var actual = {}
    var expected = {instance: [], type: []}
    var matches = types.some(function (type) {
        var key = calc(type, expected)
        actual[key] = functs[key](value)
        return key === 'instance' ? isInstanceOf(value, type) : actual[key] === type
    }) || types.length === 0
    return cb ? cb(matches, value, expected, actual) : matches
}

function calc (type, expected) {
    var key = typeof type === 'string' ? 'type' : 'instance'
    expected[key].push(key === 'instance' ? type.name : type)
    return key
}

function isInstanceOf (value, type) {
    var hasInstance = type[(Symbol || {}).hasInstance]
    return value instanceof type || hasInstance ? hasInstance.call(type, value) : false
}

var functs = {
    type: function (value) {
        return {}.toString.call(value).slice(8, -1)
    },
    instance: function (value) {
        return value == null ? '' + value : value.constructor.name
    }
}

module.exports = typeVerify
