const tape = require('tape')
const reuse = require('./')

tape('alloc pool and reuse', function (t) {
  const pool = reuse.pool(1024)
  const buf = pool.alloc()

  t.same(buf.length, 1024, 'length is pool length')
  t.ok(Buffer.isBuffer(buf), 'is buffer')

  const nextBuf = pool.alloc()
  t.ok(nextBuf !== buf, 'not same buffer')

  t.ok(reuse.free(buf), 'was freed')

  const nextNextBuf = pool.alloc()

  t.ok(nextNextBuf === buf, 'is same buffer')
  t.end()
})

tape('slice and reuse', function (t) {
  const pool = reuse.pool(1024)
  const buf = pool.alloc()

  const slice = reuse.slice(buf, 10, 20)

  t.same(slice.length, 10, 'right length')
  for (var i = 0; i < 10; i++) slice[i] = i
  t.same(buf.slice(10, 20), slice, 'is a real slice')

  t.ok(reuse.free(slice), 'was freed')
  t.ok(buf === pool.alloc(), 'is same buffer')

  t.end()
})

tape('free not reusable buffer', function (t) {
  const buf = Buffer.alloc(1024)

  t.ok(!reuse.free(buf), 'not freed')
  t.end()
})
