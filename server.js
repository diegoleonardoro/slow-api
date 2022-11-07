const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const {
  slow_function,
  memoize,
} = require("./functions.js");


dotenv.config({ path: "./config/config.env" });

const app = express();

app.get("/api", async (req, res) => {
  const input = 'usaData';

  const fastFunction =  memoize(slow_function);

  console.log(await fastFunction(input));

  res.send(req.params.input);
});

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode in ${PORT}`)
);

/**

"redis":  "^2.8.0"

const redis = require ('redis')
const redisUrl = 'redis://127.0.0.1:6379'
const client = redis.createClient(redisUrl)

client.set('hi','there')
client.get("hi", (err, val)=>{ console.log(val) })
client.get("hi", console.log );

client.set('colors', JSON.stringify({red:'rojo'}))

nested hash data structure:

It is like a nested JavaScript object.

key: value
value: {nested_key : nested_value_object}

client.hset(master_key, nested_key, nested_value)
client.hget(master_key, nested_key, (err, val)=>console.log(val))

*/
