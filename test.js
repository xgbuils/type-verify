var expect = require('chai').expect
var typeVerify = require('./index.js')
var sinon = require('sinon')

describe('typeVerify', function () {
    describe('typeof -> using no capitalize string', function () {
        it('boolean', function () {
            expect(typeVerify(false, ['boolean'])).to.be.equal(true)
        })

        it('number or object', function () {
            expect(typeVerify('string', ['number', 'object'])).to.be.equal(false)
        })

        describe('using callback', function () {
            var cb
            beforeEach(function () {
                cb = sinon.spy()
            })

            it('if it matches, callback is called with correct arguments', function () {
                var OBJ = {}
                var TYPES = ['string', 'object']
                typeVerify(OBJ, TYPES, cb)
                expect(cb.calledOnce).to.be.equal(true)
                expect(cb.calledWith(true, OBJ, TYPES))
            })

            it('if it does not match, callback is called with correct arguments', function () {
                var NUM = {}
                var TYPES = ['string', 'object']
                typeVerify(NUM, TYPES, cb)
                expect(cb.calledOnce).to.be.equal(true)
                expect(cb.calledWith(false, NUM, TYPES, {type: 'number'}))
            })
        })
    })

    describe('[object Type] -> using capitalize string', function () {
        it('/^abc/ is RegExp', function () {
            expect(typeVerify(/^abc/, ['RegExp'])).to.be.equal(true)
        })

        it('arguments of function is not a Number or an Object', function () {
            expect(typeVerify(arguments, ['Number', 'Object'])).to.be.equal(false)
        })

        describe('using callback', function () {
            var cb
            beforeEach(function () {
                cb = sinon.spy()
            })

            it('if it matches, callback is called with correct arguments', function () {
                var ARR = [1, 5, 3]
                var TYPES = ['Array', 'Null']
                typeVerify(ARR, TYPES, cb)
                expect(cb.calledOnce).to.be.equal(true)
                expect(cb.calledWith(true, ARR, TYPES))
            })

            it('if it does not match, callback is called with correct arguments', function () {
                function A () {}
                var a = new A()
                var TYPES = ['Undefined', 'Boolean']
                typeVerify(a, TYPES, cb)
                expect(cb.calledOnce).to.be.equal(true)
                expect(cb.calledWith(false, a, TYPES, {object: 'Object'}))
            })
        })
    })

    describe('instanceof -> using function constructor', function () {
        it('new A() is instance of B or A', function () {
            function A () {}
            function B () {}
            var a = new A()
            expect(typeVerify(a, [B, A])).to.be.equal(true)
        })

        it('primitive number is not instance of Number', function () {
            expect(typeVerify(2, [Number])).to.be.equal(false)
        })

        describe('using callback', function () {
            var cb
            beforeEach(function () {
                cb = sinon.spy()
            })

            it('if it matches, callback is called with correct arguments', function () {
                function A () {}
                function B () {}
                var instance = new B()
                var TYPES = [A, B]
                typeVerify(instance, TYPES, cb)
                expect(cb.calledOnce).to.be.equal(true)
                expect(cb.calledWith(true, instance, TYPES))
            })

            it('if it does not match, callback is called with correct arguments', function () {
                function A () {}
                function B () {}
                function C () {}
                var instance = new B()
                var TYPES = [A, C]
                typeVerify(instance, TYPES, cb)
                expect(cb.calledOnce).to.be.equal(true)
                expect(cb.calledWith(false, instance, TYPES, {instance: 'B'}))
            })
        })
    })
})