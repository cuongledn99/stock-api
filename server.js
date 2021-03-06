const path = require('path');
const logger = require('morgan');
const express = require('express');
const { sendResponse } = require('./app/helpers');
const { fetchAuthorProfile } = require('./app/scotch');
// const { fetchData, getBCTC } = require('./app/vietstock');
const { getBCTC } = require('./app/crawlers/bctc')

const app = express();
const port = process.env.PORT || 3000;

app.set('port', port);
app.use(logger('dev'));
app.use('/', express.static(path.resolve(__dirname, 'public')));


app.get('/ping', async (req, res, next) => {
	return res.send({
		message: "Hello from Stock API"
	})
})

// app.get('/stock', async (req, res, next) => {
// 	try {
// 		// console.log(req.query, 'req.queryreq.query')
// 		const { time, code } = req.query
// 		// console.log({ time, code }, 'router ...')
// 		const data = await fetchData(time, code)
// 		return res.send({
// 			success: true,
// 			data
// 		})
// 	} catch (error) {
// 		console.log("errr")
// 		console.log(error)
// 		console.log("errr===")

// 	}

// })

app.get('/bctc', async (req, res, next) => {
	try {
		// console.log("Hello from router crawl")
		const { time, code } = req.query
		// const { time, code } = { time: "Q2_2020", code: "VCB" }

		const data = await getBCTC(time, code)
		return res.send({
			success: true,
			data
		})
	} catch (error) {
		console.log("errr")
		console.log(error)
		console.log("errr===")

	}
})
// app.get('/scotch/:author', (req, res, next) => {
// 	const author = req.params.author;
// 	sendResponse(res)(fetchAuthorProfile(author));
// });



app.listen(port, () => console.log(`App started on port ${port}.`));
