# buffer-reuse-pool

An easy way to reuse buffers without much API ceremony

```
npm install buffer-reuse-pool
```

[![build status](https://travis-ci.org/mafintosh/buffer-reuse-pool.svg?branch=master)](https://travis-ci.org/mafintosh/buffer-reuse-pool)

## Usage

``` js
const reuse = require('buffer-reuse-pool')
const pool = reuse.pool(65536) // make a pool of 64kb chunks

const buf = pool.alloc() // alloc a buffer

// ... do stuff like passing it to fs.read
// when done free it

reuse.free(buf) // re-adds it to the pool it was allocated from
```

The neat thing is that the `buf` variable is just a normal buffer and that the
reuse function does not need to know about the pool, meaning that module authors
can support buffer reuse without any additional api complexities.

All you have to do is free a buffer when you are completely done using it

## API

#### `const pool = reuse.pool(size)`

Make a new buffer reuse pool. `size` if the size of the buffers allocated.

#### `pool.size`

Get the buffer size of this pool.

#### `const buffer = pool.alloc()`

Allocate a new buffer of size `pool.size`.
Note that the buffer is *not* guaranteed to be blank as it can have been used before.

#### `const reusable = reuse.free(buffer)`

Free a buffer. Returns `true` if this buffer was reuseable, `false` if not.
It is safe to pass a normal buffer allocated with `Buffer.alloc` or a one allocated with `pool.alloc`.

#### `const slicedBuffer = reuse.slice(buffer, start, end)`

Slice a buffer. If the `slicedBuffer` is freed the original `buffer` is reused.

## License

MIT
