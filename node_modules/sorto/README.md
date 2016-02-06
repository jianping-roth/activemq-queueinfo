
Node.js - sorto
================

[![build status](https://secure.travis-ci.org/jprichardson/node-sorto.png)](http://travis-ci.org/jprichardson/node-sorto)

Sort an object by key or value.


Why?
----

When I'm crunching through data, I like to keep a count on various strings using an associative array. It's handy to be able to view this data sorted alphabetically or by count.




Installation
------------

    npm install --save sorto



Methods
-------

### sorto.bykey(collection, [transformFunc])

Sorts an object or array of single keyed objects by key.

**Examples:**

```js
var sorto = require('sorto')

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


//use a transform function
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
```


### sorto.byval(collection, [transformFunc])

Sorts an object or array of single keyed objects by value.

**Examples:**

```js
var sorto = require('sorto')

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

//use transform function
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
console.dir(items)

EQ (items[0]['zoo'], '-5')
EQ (items[1]['arthur'], '0')
EQ (items[2]['tim'], '4')
EQ (items[3]['b'], '7')
EQ (items[4]['jordan'], '33.2')
EQ (items[5]['cat'], '90.5')
```

### Utility Methods

Since `sorto` returns an array of objects with a single/key value pair, it can be kind of annoying accessing those values if you don't know
their names.


### k(obj)

Get the key of an object with a single key/value pair.

**Example:**

```js
var obj = {name: 'jp'}
EQ (sorto.k(obj), 'name')
```


### v(obj)

Get the value of an object with a single key/value pair.

**Example:**

```js
var obj = {name: 'jp'}
EQ (sorto.v(obj), 'jp')
```


License
-------

(MIT License)

Copyright 2013 JP Richardson  <jprichardson@gmail.com>





