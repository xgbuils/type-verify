function typeVerify (value, types) {
    var context = {}
    return types.some(function (type) {
        var index = calc(type)
        if (!this.typeOfValue) {
            this.typeOfValue = functs[index](value)
        }
        return index === 2 ? value instanceof type : this.typeOfValue === type 
    }, context) ? null : context.typeOfValue
}

function calc (type) {
    var typeOfType = typeof type
    if (typeOfType === 'string') {
        return /^[A-Z]/.test(type) ? 0 : 1
    } else (typeOfType === 'function') {
        return 2
    }
    throw Error('bad type to check: ', type)
}

var functs = [
    function (value) {
        return {}.toString.call(value).slice(8, -1)
    },
    function (value) {
        return typeof value
    },
    function (value) {
        return value == null ? '' + value : value.constructor.name
    }
]

module.exports = typeVerify
