var testutil = require('testutil')
  , sorto = require('../lib/sorto')


suite('sorto');

test('- bykey(col)', function() {
  var obj = {
    'b': 'hi',
    'cat': 'meow',
    'zoo': 'animals',
    'jordan': 'basketball',
    'arthur': 'aardvark',
    'tim': 'person'
  }

  var items = sorto.bykey(obj)
  EQ (items.length, 6)

  EQ (items[0]['arthur'], 'aardvark')
  EQ (items[1]['b'], 'hi')
  EQ (items[2]['cat'], 'meow')
  EQ (items[3]['jordan'], 'basketball')
  EQ (items[4]['tim'], 'person')
  EQ (items[5]['zoo'], 'animals')
})

test('- bykey(col, transform)', function() {
  var obj = {
    '7': 'hi',
    '90.5': 'meow',
    '-5': 'animals',
    '33.2': 'basketball',
    '0': 'aardvark',
    '4': 'person'
  }

  var items = sorto.bykey(obj, parseFloat)
  EQ (items.length, 6)

  EQ (items[0]['-5'], 'animals')
  EQ (items[1]['0'], 'aardvark')
  EQ (items[2]['4'], 'person')
  EQ (items[3]['7'], 'hi')
  EQ (items[4]['33.2'], 'basketball')
  EQ (items[5]['90.5'], 'meow')
})

test('- byval(col)', function() {
  var obj = {
    'b': 'hi',
    'cat': 'meow',
    'zoo': 'animals',
    'jordan': 'basketball',
    'arthur': 'aardvark',
    'tim': 'person'
  }

  var items = sorto.byval(obj)
  EQ (items.length, 6)

  EQ (items[0]['arthur'], 'aardvark')
  EQ (items[1]['zoo'], 'animals')
  EQ (items[2]['jordan'], 'basketball')
  EQ (items[3]['b'], 'hi')
  EQ (items[4]['cat'], 'meow')
  EQ (items[5]['tim'], 'person')
})

test('- byval(col, transform)', function() {
  var obj = {
    'b': '7',
    'cat': '90.5',
    'zoo': '-5',
    'jordan': '33.2',
    'arthur': '0',
    'tim': '4'
  }

  var items = sorto.byval(obj, parseFloat)
  EQ (items.length, 6)
  //console.dir(items)

  EQ (items[0]['zoo'], '-5')
  EQ (items[1]['arthur'], '0')
  EQ (items[2]['tim'], '4')
  EQ (items[3]['b'], '7')
  EQ (items[4]['jordan'], '33.2')
  EQ (items[5]['cat'], '90.5')
})

test('- k(obj)', function() {
  var obj = {name: 'jp'}
  EQ (sorto.k(obj), 'name')
})

test('- v(obj)', function() {
  var obj = {name: 'jp'}
  EQ (sorto.v(obj), 'jp')
})


