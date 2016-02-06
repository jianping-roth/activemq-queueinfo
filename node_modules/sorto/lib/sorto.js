var me = module.exports

me.bykey = function(collection, transform) {
  var arr = colToArray(collection)

  arr.sort(function(a, b) {
    var k1 = Object.keys(a)[0]
    var k2 = Object.keys(b)[0]

    if (transform)
      k1 = transform(k1)

    if (transform)
      k2 = transform(k2)

    if (k1 < k2) return -1
    else if (k1 > k2) return 1
    else return 0
  })

  return arr
}

me.byval = function(collection, transform) {
  var arr = colToArray(collection)

  arr.sort(function(a, b) {
    var v1 = a[Object.keys(a)[0]]
    var v2 = b[Object.keys(b)[0]]

    if (transform)
      v1 = transform(v1)

    if (transform)
      v2 = transform(v2)

    if (v1 < v2) return -1
    else if (v1 > v2) return 1
    else return 0
  })

  return arr
}

me.k = function key (obj) {
  return Object.keys(obj)[0]
}

me.v = function value (obj) {
  return obj[me.k(obj)]
}

function colToArray (col) {
  if (typeof col != 'object') throw new Error('sorto: Input collection does not seem to be an array or an object.')

  if (Object.prototype.toString.call(col) === '[object Array]') 
    return col //we have an array!

  var arr = []
  for (var i in col) {
    if (col.hasOwnProperty(i)) {
      var o = {}
      o[i] = col[i]
      arr.push(o)
    }
  }

  return arr
}