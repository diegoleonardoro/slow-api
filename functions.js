const redis = require("redis");
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
const util = require("util");
client.get = util.promisify(client.get);

const axios = require("axios");


const apis = {

  usaData: {
    method:"GET", 
    url:"https://datausa.io/api/data?drilldowns=Nation&measures=Population"
  }

};

// stores data (value) by key
async function cache_store(key, value) {
  // Whenever we store objects into redis, we need to stringify them ahead of time
  client.set(key, JSON.stringify(value));
}

// retrieves data by key (if it exists)
async function cache_retrieve(key) {
  // Check if the data exists is the cache server
  const cachedData = await client.get(key);
  return JSON.parse(cachedData);
}

// fetches data from a slow data source
async function slow_function(input) {
  // Make API request to "input"
  const apioptions = apis[input];
  const apiData = await axios.request(apioptions);
  return apiData;
}

// runs faster than slow_function by using cache functions
function memoize(slow_function) {
  return async (input) => {

    // check if input is present in cache
    const cacheData = await cache_retrieve(input);

    // If input is present in cache, then resturn the cache data
    if (cacheData) {
      console.log("data served from cache");
      return cacheData;
    }

    // If input is NOT present in cache, call slow_function to make the api request, and update the cache.
    const apiData = await slow_function(input);
    console.log("data served from api");
    client.set(input, JSON.stringify(apiData["data"]));
    return apiData["data"];

  };
}


module.exports = {   slow_function, memoize };
