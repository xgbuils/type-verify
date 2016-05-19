function typeVerify (value, types, cb) {
    var actual = {}
    var expected = {object: [], instance: [], type: []}
    var matches = types.some(function (type) {
        var key = calc(type, expected)
        actual[key] = functs[key](value)
        return key === 'instance' ? value instanceof type : actual[key] === type
    }) || types.length === 0
    return cb ? cb(matches, value, expected, actual) : matches
}

function calc (type, expected) {
    var typeOfType = typeof type
    var key
    if (typeOfType === 'string') {
        key = /^[A-Z]/.test(type) ? 'object' : 'type'
    } else if (typeOfType === 'function') {
        key = 'instance'
    }
    if (!key) throw Error('bad type to check: ', type)
    expected[key].push(key === 'instance' ? type.name : type)
    return key
}

var functs = {
    object: function (value) {
        return {}.toString.call(value).slice(8, -1)
    },
    type: function (value) {
        return typeof value
    },
    instance: function (value) {
        return value == null ? '' + value : value.constructor.name
    }
}

module.exports = typeVerify
