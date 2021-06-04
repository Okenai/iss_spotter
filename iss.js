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

const fetchISSFlyOverTimes = function (coords, callback) {
  request(`http://api.open-notify.org/iss/v1/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error);
      return
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}), null`;
      callback(Error(msg));
      return;
    }
    if (response && response.statusCode === 200) {
      if (body === '[]') {
        callback('the location was not found')
      }
      if (body !== '[]') {

        const passes = JSON.parse(body).response;
        callback(null, passes);
      }
    }
  })
}

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};
  


module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };