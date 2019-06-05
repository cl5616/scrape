import express from 'express';
// import bodyParser from 'body-parser';
import scrape from './scrape';

// Set up the express app
const app = express();

// Parse incoming requests data
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/v1/rates', (req, res) => {
  console.log(req.query);
    if(!req.query.hotel_id) {
      return res.status(400).send({
        success: 'false',
        message: 'hotel_id is required'
      });
    }
    if(!req.query.checkin) {
      return res.status(400).send({
        success: 'false',
        message: 'checkin is required'
      });
    }
    if(!req.query.checkout) {
        return res.status(400).send({
          success: 'false',
          message: 'checkout is required'
        });
    }
    if(!req.query.selected_currency) {
        return res.status(400).send({
          success: 'false',
          message: 'selected_currency is required'
        });
    }

    let scrape_info = scrape(req.query.hotel_id,
        req.query.checkin, req.query.checkout, req.query.selected_currency);
    scrape_info.then((value) => {
        return res.status(201).send(value);
    })
    // TODO TIMEOUT???
  });

  const PORT = 5000;
  
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
  });