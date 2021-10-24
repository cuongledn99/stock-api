// const data = `BVH|Tập đoàn Bảo Việt - Tập Đoàn Bảo Việt|https://finance.vietstock.vn/BVH-tap-doan-bao-viet.htm|Tập Đoàn Bảo Việt|HOSE|2\r\nBiaVietHa|CTCP Bia và Nước giải khát Việt Hà - BVH|https://finance.vietstock.vn/BiaVietHa-ctcp-bia-va-nuoc-giai-khat-viet-ha.htm|BVH|OTC|2`
// console.log(data.split('|'))

const axios = require("axios")

function getFetch(url, data, props) {
    console.log(url, 'get ...')
    let attributes = Object.assign(
        {
            headers: {
                'postman-token': '759e0e94-4583-5422-a011-cc9e3259f1f0',
                'cache-control': 'no-cache'
            },
            params: data,
        },
        props
    )
    return new Promise((resolve, reject) => {
        axios
            .get(url, attributes)
            .then(res => {
                // if (res.status === 200) {
                resolve(res.data)
                // } else {
                //   reject({ error: true })
                // }
            })
            .catch(e => reject(e))
    })
}



const getCompanyUrl = async code => {
    const data = await getFetch("https://finance.vietstock.vn/search/BVH")
    console.log(data, 'datadata')
}

getCompanyUrl("BVH")


