const getQuarterText = quarterCode => {
    // console.log(quarterCode, 'quarterCodequarterCode')
    const year = quarterCode.split('_')[1]
    const quarter = quarterCode.split('_')[0][1]
    return `Quý ${quarter}/${year}`
}

const isTextExist = async (page, text) => {
    console.log(text, 'texttext')
    try {
        let chk = false
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
        // console.log(error, 'errorerror')
        return false
    }
}

module.exports = { getQuarterText, isTextExist }