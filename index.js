function typeVerify (value, types, cb) {
    var actual = {}
    var matches = types.some(function (type) {
        var key = calc(type)
        actual[key] = functs[key](value)
        return key === 'instance' ? value instanceof type : actual[key] === type
    })
    return cb ? cb(matches, value, types, actual) : matches
}

function calc (type) {
    var typeOfType = typeof type
    if (typeOfType === 'string') {
        return /^[A-Z]/.test(type) ? 'object' : 'type'
    } else if (typeOfType === 'function') {
        return 'instance'
    }
    throw Error('bad type to check: ', type)
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
