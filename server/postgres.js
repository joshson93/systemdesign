const { Client } = require('pg');
require('dotenv').config();
exports.client = new Client({
  host: 'ec2-34-230-36-143.compute-1.amazonaws.com',
  user: process.env.user,
  password: process.env.password,
  database: 'fennel',
});
