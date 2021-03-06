/**
 * Collection of buffers to be shared between async processes.
 * Avoids allocating buffers each time async process starts.
 * bufSize - size of each buffer
 * bufNo - number of buffers
 * Caller has to make sure no more than bufNo async processes run simultaneously.
 */
function BufferPool(bufSize, bufNo) {
    const bufferPool = []
    for (let i = 0; i < bufNo; i++) {
        bufferPool.push({
            buf1: Buffer.alloc(bufSize),
            buf2: Buffer.alloc(bufSize),
            busy: false
        })
    }

    const allocateBuffers = () => {
        for (let j = 0; j < bufNo; j++) {
            const bufferPair = bufferPool[j]
            if (!bufferPair.busy) {
                bufferPair.busy = true
                return bufferPair
            }
        }
        throw new Error('Async buffer limit reached')
    }

    const freeBuffers = bufferPair => {
        bufferPair.busy = false
    }

    return {
        allocateBuffers: allocateBuffers,
        freeBuffers: freeBuffers
    }
}

module.exports = BufferPool
