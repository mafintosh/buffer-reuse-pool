const BUFFER_POOL = createSymbol('BufferPool')
const BUFFER_SLICE = createSymbol('BufferSlice')

function BufferPool (size) {
  this.free = []
  this.size = size
}

BufferPool.prototype.alloc = function () {
  return this.free.pop() || this._allocNew()
}

BufferPool.prototype._allocNew = function () {
  const buf = Buffer.alloc(this.size)
  buf[BUFFER_POOL] = this
  return buf
}

// Trying to help v8. TODO: Is this needed?
Buffer.prototype[BUFFER_POOL] = null
Buffer.prototype[BUFFER_SLICE] = null

exports.slice = function (buf, start, end) {
  const slice = buf.slice(start, end)
  slice[BUFFER_SLICE] = buf[BUFFER_SLICE] || buf
  slice[BUFFER_POOL] = buf[BUFFER_POOL]
  return slice
}

exports.pool = function (size) {
  return new BufferPool(size)
}

exports.free = function (buf) {
  const pool = buf[BUFFER_POOL]
  if (!pool) return false
  pool.free.push(buf[BUFFER_SLICE] || buf)
  return true
}

function createSymbol (name) {
  if (typeof Symbol !== 'undefined') return Symbol(name)
  return '__SYMBOL__' + Date.now() + '_' + name
}
