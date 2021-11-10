const data = `BVH|Tập đoàn Bảo Việt - Tập Đoàn Bảo Việt|https://finance.vietstock.vn/BVH-tap-doan-bao-viet.htm|Tập Đoàn Bảo Việt|HOSE|2\r\nBiaVietHa|CTCP Bia và Nước giải khát Việt Hà - BVH|https://finance.vietstock.vn/BiaVietHa-ctcp-bia-va-nuoc-giai-khat-viet-ha.htm|BVH|OTC|2`
const url = data.split('|')
    .filter(item => item.includes("https"))
console.log(url[0])


