const getQuarterText = quarterCode => {
    // console.log(quarterCode, 'quarterCodequarterCode')
    const year = quarterCode.split('_')[1]
    const quarter = quarterCode.split('_')[0][1]
    return `Quý ${quarter}/${year}`
}

const getYearText = year => {
    return `Năm ${year}`
}

const getTimeType = time => {
    if (time.includes("_")) {
        return 'QUARTER'
    }

    return 'YEAR'
}


const isTimeLabelExist = async (page, text) => {
    // let result = false
    let element = await page.$$('b')
    let listLabels = element.map(async elItem => {
        let value = await page.evaluate(el => el.textContent, elItem)
        return value
        // console.log({ value, text })
        // if (value == text) {
        //     result = true
        // }
    })
    listLabels = await Promise.all(listLabels)
    // console.log(listLabels, 'listLabelslistLabels')
    const result = listLabels.find(lb => lb == text)
    // console.log(result, 'result')
    return result !== undefined
}
const isTextExist = async (page, text) => {
    // console.log(text, 'texttext')
    try {
        let chk = false

        // console.log(waiter, 'waiterwaiterwaiter')
        if ((await page.waitForXPath(`//*[contains(text(), "${text}")]`, {
            timeout: 100
        })) !== null) {
            chk = true
        } else {
            chk = false
        }
        return chk
    } catch (error) {
        console.log("Timeout isTextExist")
        console.log(error, 'errorerror')
        return false
    }
}

module.exports = { getQuarterText, isTextExist, getYearText, getTimeType, isTimeLabelExist }