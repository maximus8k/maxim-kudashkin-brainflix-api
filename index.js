const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require('cors');
const videoRoutes = require('./routes/video');

app.use(cors());
app.use(express.json());
app.use(express.static("public/images"));
app.use('/', videoRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Press CTRL + C to stop server');
});
  