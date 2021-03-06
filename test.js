var expect = require('chai').expect
var typeVerify = require('./index.js')
var sinon = require('sinon')

describe('typeVerify', function () {
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
                expect(cb.args[0][0]).to.be.deep.equal(true)
            })

            it('if it does not match, callback is called with correct arguments', function () {
                function A () {}
                var a = new A()
                var TYPES = ['Undefined', 'Boolean']
                typeVerify(a, TYPES, cb)
                expect(cb.calledOnce).to.be.equal(true)
                expect(cb.args[0]).to.be.deep.equal([false, a, {
                    instance: [],
                    type: TYPES
                }, {
                    type: 'Object'
                }])
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
                expect(cb.args[0][0]).to.be.deep.equal(true)
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
                expect(cb.args[0]).to.be.deep.equal([false, instance, {
                    instance: ['A', 'C'],
                    type: []
                }, {
                    instance: 'B'
                }])
            })
        })
    })

    describe('empty array', function () {
        describe('anything is correct', function () {
            it('returns true with instance of object', function () {
                function A () {}
                function B () {}
                var instance = new B()

                expect(typeVerify(instance, [])).to.be.equal(true)
            })

            it('returns true with number', function () {
                expect(typeVerify(6, [])).to.be.equal(true)
            })

            it('returns true with null', function () {
                expect(typeVerify(null, [])).to.be.equal(true)
            })

            it('returns true with undefined', function () {
                expect(typeVerify(undefined, [])).to.be.equal(true)
            })

            it('returns true with boolean', function () {
                expect(typeVerify(true, [])).to.be.equal(true)
            })

            it('returns true with string', function () {
                expect(typeVerify('foo', [])).to.be.equal(true)
            })

            it('returns true with function', function () {
                expect(typeVerify(function () {}, [])).to.be.equal(true)
            })
        })
    })
})