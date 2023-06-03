const express = require('express');
const accountRouter = require('./routes/account');

const app = express();
app.use(express.json());
app.use('/account', accountRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`server listen http://localhost:${PORT}`));
