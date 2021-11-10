
// const { getVonChuSoHuu, getEPS, getDoanhThuThuan } = require('./vietstock')
// console.log(getDoanhThuThuan, 'getDoanhThuThuangetDoanhThuThuan')
const { getChiSoTaiChinhBySelector } = require('./utils-bctc')

const getDoanhThuThuan = ($, quarter) => {
    return getChiSoTaiChinhBySelector($, quarter, '#table-0 > tbody > tr:nth-child(1)')
}
// #table-0 > tbody > tr:nth-child(1) > td:nth-child(2)  
// #table-1 > tbody > tr:nth-child(5)
const getVonChuSoHuu = ($, quarter) => {
    return getChiSoTaiChinhBySelector($, quarter, '#table-1 > tbody > tr:nth-child(5)')
}
const getEPS = ($, quarter) => {
    return getChiSoTaiChinhBySelector($, quarter, '#table-2 > tbody > tr:nth-child(1)')
}

const getTSNgan = ($, quarter) => {
    return getChiSoTaiChinhBySelector($, quarter, '#finance-content > div > div > div.pos-relative.content-grid.w100 > div:nth-child(2) > table > tbody > tr:nth-child(1)')
}


// const getBCTCHandler = ($, time) => {
//     console.log("getBCTCHandlergetBCTCHandler")
//     // const doanhThuThuan = getDoanhThuThuan($, time)

//     // const vonChuSoHuu = getVonChuSoHuu($, time)
//     // const eps = getEPS($, time)
//     const taiSanNgan = getTSNgan($, time)
//     return {
//         taiSanNgan
//         // doanhThuThuan,
//         // vonChuSoHuu,
//         // eps

//     }

//     // return { name: "Cuong" }
// }

// module.exports = { getBCTCHandler }