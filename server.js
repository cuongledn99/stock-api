const path = require('path');
const logger = require('morgan');
const express = require('express');
const { sendResponse } = require('./app/helpers');
const { fetchAuthorProfile } = require('./app/scotch');
const { fetchData } = require('./app/vietstock');

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

app.get('/stock', async (req, res, next) => {
	try {
		const data = await fetchData()
		return res.send(data)
	} catch (error) {
		console.log("errr")
		console.log(error)
		console.log("errr===")

	}

})
app.get('/scotch/:author', (req, res, next) => {
	const author = req.params.author;
	sendResponse(res)(fetchAuthorProfile(author));
});



app.listen(port, () => console.log(`App started on port ${port}.`));
