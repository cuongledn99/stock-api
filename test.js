const asyncLoop = (condition, callback) => {
    let promises = [];
    while (condition) {
        promises.push(new Promise((r, j) => {
            callback()
        }))
    }

    await Promise.all(promises)
}

const executor = (num) => {
    if (num === 3) {
        return true
    }
    return false
}
const main = async () => {
    let isFound = false
    while (!isFound) {
        promises.push(new Promise((r, j) => {
            callback()
        }))
    }

    await Promise.all(promises)
}