
// importing modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express(); // initialized express app
const router = express.Router(); // initiating express router


const downloadedImages = [];

/**
 * 
 * Created by Kishan Panchal on 2020.09.04
 * @author Kishan Panchal 
 * @description controller file
 * @version 1.0
 */

const downloadImageFromURL = (request, response, next) => {
    const req = require('request').defaults({ encoding: null });
    const url = request.body.url;
    const exist = downloadedImages.find(d => d.url === url);
    if (exist?.data) {
        response.json(exist?.data);
    } else {
        req.get(url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                const img = "data:jpg;base64," + Buffer.from(body).toString('base64');
                const data = {
                    status: true,
                    data: img,
                };
                downloadedImages.push({ url, data });
                response.json(data);
            } else {
                response.json({ status: false, error });
            }
        });
    }
}


// routers config
/**
 * 
 * Created by Kishan Panchal on 2022.03.30
 * @author Kishan Panchal 
 * @description routing file...
 * @version 1.0
 */
router.get('/', (req, res) => {
    res.send(`
         <b>Welcome to Coderman Common APIs</b><br>\n
         <a href="https://coderman401.web.app/about">Visit here for more...</a>
     `);
});

router.post('/downloadImage', downloadImageFromURL);

/**
 * 
 * Created by Kishan Panchal on 2022.03.30
 * @author Kishan Panchal 
 * @url "" 
 * @version 1.0
 */

// middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use('/', router);

// process.env.
let port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is up and running on port number ${port}`)
});