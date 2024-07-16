const dotenv = require('dotenv');
const envFile = process.env.NODE_ENV === 'devolps' ? '.env.devolps' : '.env.deploy';
dotenv.config({ path: envFile });

const port = process.env.APP_PORT;

import app from './app';

app.listen(port);




console.log(`Running in ${process.env.NODE_ENV} mode`);
