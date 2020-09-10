/**
 * A wrapper around superagent to manage calls to our API.
 * @module utilities/api-request
 */

import superagent from 'superagent';

export const name = 'utilities/api-request';

// Constants to use throughout the module.
const API_ROOT = process.env.API_ROOT || 'http://localhost:8080';
const API_KEY = process.env.API_KEY || '5xWHinmB19Woco8GlFuC';
const API_SECRET = process.env.API_SECRET || 'vOBIrJKJJDG9d6qoMu1X';

// This is the prototype to export.
const api = function api() {};

/**
 * Simple wrapper around superagent that uses our headers for every request.
 * @param {String} method - Method to use, in the form of a module constant.
 * @param {String} path - Path to append to root API url, always start with a /
 * @param {Object} options - What query parameters or post data to send.
 * @param {Function} callback - Callback to send from superagent contains error & response.
 */
function request(method, path, options, callback) {
  const req = superagent(method, API_ROOT + path)
    .set('Accept', 'application/json')
    .set('X-YWCTW-API-Key', API_KEY)
    .set('X-YWCTW-API-Secret', API_SECRET);

  // Super agent handles query parameters and post data with different functions. Both are single objects.
  if (options.query) req.query(options.query);
  if (options.data) req.send(options.data);

  req.end(callback);
}

/**
 * Sends a get request to the API.
 * @param path
 * @param query
 * @returns {Promise}
 */
api.get = function get(path, query) {
  return new Promise((resolve, reject) => {
    request('GET', path, { query }, (error, response) => {
      if (error) {
        // This is an error from the API, a 400+ code.
        if (error.response) return reject(error.response.body);

        // This is a general error, the network is likely to blame.
        return reject({ success: false, error: error });
      }
      return resolve(response.body);
    });
  });
};

/**
 * Sends a post request to the API.
 * @param path
 * @param data
 * @returns {Promise}
 */
api.post = function get(path, data) {
  return new Promise((resolve, reject) => {
    request('POST', path, { data }, (error, response) => {
      if (error) {
        // This is an error from the API, a 400+ code.
        if (error.response) return reject(error.response.body);

        // This is a general error, the network is likely to blame.
        return reject({ success: false, error: error });
      }
      return resolve(response.body);
    });
  });
};

/**
 * Sends a put request to the API.
 * @param path
 * @param data
 * @returns {Promise}
 */
api.put = function get(path, data) {
  return new Promise((resolve, reject) => {
    request('PUT', path, { data }, (error, response) => {
      if (error) {
        // This is an error from the API, a 400+ code.
        if (error.response) return reject(error.response.body);

        // This is a general error, the network is likely to blame.
        return reject({ success: false, error: error });
      }
      return resolve(response.body);
    });
  });
};

/**
 * Sends a delete request to the API.
 * @param path
 * @returns {Promise}
 */
api.delete = function get(path) {
  return new Promise((resolve, reject) => {
    request('DELETE', path, {}, (error, response) => {
      if (error) {
        // This is an error from the API, a 400+ code.
        if (error.response) return reject(error.response.body);

        // This is a general error, the network is likely to blame.
        return reject({ success: false, error: error });
      }
      return resolve(response.body);
    });
  });
};

export default api;
