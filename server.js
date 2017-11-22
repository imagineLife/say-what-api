 const express = require('express');
 const app = express();
 const cors = require('cors');
 // const {CLIENT_ORIGIN} = require('./config');
 const PORT = process.env.PORT || 3000;

// app.use(
//     cors({
//         origin: CLIENT_ORIGIN
//     })
// );


// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});


 app.get('/api/*', (req, res) => {
   res.json({ok: true});
 });

 app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

 module.exports = {app};