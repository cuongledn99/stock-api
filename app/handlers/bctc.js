const { getChiSoTaiChinhBySelector } = require('./../utils/selector')

const getDoanhThuThuan = ($, quarter) => {
    return getChiSoTaiChinhBySelector($, quarter, '#table-0 > tbody > tr:nth-child(1)')
}
// #table-0 > tbody > tr:nth-child(1) > td:nth-child(2)  
// #table-1 > tbody > tr:nth-child(5)
const getVonChuSoHuu = ($, quarter) => {
    return getChiSoTaiChinhBySelector($, quarter, '#finance-content > div > div > div.pos-relative.content-grid.w100 > div:nth-child(2) > table > tbody > tr:nth-child(19)')
}
const getEPS = ($, quarter) => {
    return getChiSoTaiChinhBySelector($, quarter, '#table-2 > tbody > tr:nth-child(1)')
}

const getTSNgan = ($, quarter) => {
    // //*[@id="finance-content"]/div/div/div[4]/div[2]/table/tbody/tr[1]
    // #finance-content > div > div > div.pos-relative.content-grid.w100 > div:nth-child(2) > table > tbody > tr:nth-child(1)
    return getChiSoTaiChinhBySelector($, quarter, '#finance-content > div > div > div.pos-relative.content-grid.w100 > div:nth-child(2) > table > tbody > tr:nth-child(1)')
}
const getTSDai = ($, quarter) => {
    // //*[@id="finance-content"]/div/div/div[4]/div[2]/table/tbody/tr[1]
    // #finance-content > div > div > div.pos-relative.content-grid.w100 > div:nth-child(2) > table > tbody > tr:nth-child(1)
    return getChiSoTaiChinhBySelector($, quarter, '#finance-content > div > div > div.pos-relative.content-grid.w100 > div:nth-child(2) > table > tbody > tr:nth-child(7)')
}
const getNoNgan = ($, quarter) => {
    // //*[@id="finance-content"]/div/div/div[4]/div[2]/table/tbody/tr[1]
    // #finance-content > div > div > div.pos-relative.content-grid.w100 > div:nth-child(2) > table > tbody > tr:nth-child(1)
    return getChiSoTaiChinhBySelector($, quarter, '#finance-content > div > div > div.pos-relative.content-grid.w100 > div:nth-child(2) > table > tbody > tr:nth-child(16)')
}
const getNoDai = ($, quarter) => {
    // //*[@id="finance-content"]/div/div/div[4]/div[2]/table/tbody/tr[1]
    // #finance-content > div > div > div.pos-relative.content-grid.w100 > div:nth-child(2) > table > tbody > tr:nth-child(1)
    return getChiSoTaiChinhBySelector($, quarter, '#finance-content > div > div > div.pos-relative.content-grid.w100 > div:nth-child(2) > table > tbody > tr:nth-child(18)')
}

const getValueByLabel = label => {

}


const getBCTCHandler = ($, time) => {
    // console.log("getBCTCHandlergetBCTCHandler")
    // const doanhThuThuan = getDoanhThuThuan($, time)

    // const vonChuSoHuu = getVonChuSoHuu($, time)
    // const eps = getEPS($, time)
    const taiSanNgan = getTSNgan($, time)
    const taiSanDai = getTSDai($, time)
    const noNgan = getNoNgan($, time)
    const noDai = getNoDai($, time)
    const vonChuSoHuu = getVonChuSoHuu($, time)
    // const 
    // #finance-content > div > div > div.pos-relative.content-grid.w100 > div:nth-child(2) > table > tbody > tr:nth-child(7)
    return {
        taiSanNgan,
        taiSanDai,
        noNgan,
        noDai,
        vonChuSoHuu

    }

    // return { name: "Cuong" }
}

module.exports = { getBCTCHandler }