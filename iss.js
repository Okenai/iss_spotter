const request = require('request');

const fetchMyIP = function (callback) {
  request('https://api.ipify.org/?format=json', (error, response, body) => {
    if (error) {
      callback(error);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    if (response && response.statusCode === 200) {
      if (body === '[]') {
        callback('IP adress is not found');
      }
      if (body !== '[]') {
        const data = JSON.parse(body);
        const ip = data.ip;
        callback(null, ip);
      }
    }
  })
}

const fetchCoordsByIP = function (ip, callback) {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Coordinated for IP: ${body}`;
      callback(Error(msg), null);
      return;
    }

    if (response && response.statusCode === 200) {
      if (body === '[]') {
        callback('Coordinates are not found')
      }
      if (body !== '[]') {

        const { latitude, longitude } = JSON.parse(body);

        callback(null, { latitude, longitude });
      }

    }
  })
}

  module.exports = { fetchMyIP, fetchCoordsByIP } 