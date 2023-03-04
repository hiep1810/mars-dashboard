require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

// your API calls

// example API call
app.get('/apod', async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ image });
  } catch (err) {
    console.log('error:', err);
  }
});

app.get('/rovers/:name', async (req, res) => {
  try {
    const data = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.name}/latest_photos?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    //send all data to front-end:
    const lastest_images = data.latest_photos.map((value) => {
      return {
        img_src: value.img_src,
        earth_date: value.earth_date,
        camera: value.camera.name,
        camera_full_name: value.camera.full_name,
      };
    });
    res.send({
      ...data.latest_photos[0].rover,
      lastest_images,
    });
  } catch (err) {
    console.log('error:', err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
