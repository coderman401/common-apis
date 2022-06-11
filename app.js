
// importing modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express(); // initialized express app
const router = express.Router(); // initiating express router
const { getMetadata } = require('page-metadata-parser');
const domino = require('domino');


const downloadedImages = [];
const allMetadata = [];

/**
 * 
 * Created by Kishan Panchal on 2022.03.30
 * @author Kishan Panchal 
 * @description download image from url and send base64.
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
/**
 * 
 * Created by Kishan Panchal on 2022.03.30
 * @author Kishan Panchal 
 * @description get metadata from the given url
 * @version 1.0
 */

const getMetadataFromUrl = (request, response, next) => {
    const req = require('request').defaults({ encoding: null });
    const url = request.body.url;
    const exist = allMetadata.find(d => d.url === url);
    if (exist?.data) {
        response.json(exist?.data);
    } else {
        req.get(url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                const doc = domino.createWindow(body?.toString()).document;
                const metadata = getMetadata(doc, url);
                const data = {
                    status: true,
                    data: metadata,
                };
                allMetadata.push({ url, data });
                response.json(data);
                response.send(metadata);
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
router.post('/getMetadata', getMetadataFromUrl);

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
app.use(cors({ origin: '*' }));
app.use('/', router);

// process.env.
let port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is up and running on port number ${port}`)
});