/* eslint-disable max-len */
const express = require('express');
const got = require('got');

const router = express.Router();

const User = require('../models/user');
const Dashboard = require('../models/dashboard');
const Source = require('../models/source');

router.get('/statistics',
  async (req, res, next) => {
    /**
     *  GET router
     *  This function returns statistics about the users, dashboards, views, and sources in the
     *  database.
     *  @param req (object): The request object.
     *  @param  res (object): The response object used to return the statistics.
     *  @param next (function): The next middleware function in the route.
     *  @returns An object containing the number of users, dashboards, views, and sources
     *  in the database.
     */
    try {
      const users = await User.countDocuments();
      const dashboards = await Dashboard.countDocuments();
      const views = await Dashboard.aggregate([
        {
          $group: {
            _id: null, 
            views: {$sum: '$views'}
          }
        }
      ]);
      const sources = await Source.countDocuments();

      let totalViews = 0;
      if (views[0] && views[0].views) {
        totalViews = views[0].views;
      }

      return res.json({
        success: true,
        users,
        dashboards,
        views: totalViews,
        sources
      });
    } catch (err) {
      return next(err.body);
    }
  });

router.get('/test-url',
  async (req, res) => {
    /**
     * Get router
     * This function sends a GET request to the specified URL and returns the HTTP status code and
     * whether the URL is active.
     * @param req (object): The request object containing the URL to be tested. The URL should be
     * provided as a query parameter, for example: /test-url?url=http://www.example.com
     * @param res (object): The response object used to return the status code and active status of
     * the URL.
     * @returns object: An object containing the HTTP status code and whether the URL is active
     * (returns a status code of 200).
     */
    try {
      const {url} = req.query;
      const {statusCode} = await got(url);
      return res.json({
        status: statusCode,
        active: (statusCode === 200),
      });
    } catch (err) {
      return res.json({
        status: 500,
        active: false,
      });
    }
  });

router.get('/test-url-request',
  async (req, res) => {
    /**
     * GET router
     * This function sends a specified HTTP request to the provided URL and returns the response.
     * @param req (object): The request object containing the URL, request type, headers, body, and
     * parameters to be used in the request. These should be provided as query parameters, for
     * example: /test-url-request?url=http://www.example.com&type=POST&headers={"Content-Type":"
     * application/json"}&body={"key":"value"}&params={"param1":"value1","param2":"value2"}
     * @param res (object): The response object used to return the HTTP status code and response
     * body of the request.
     * @returns An object containing the HTTP status code and response body of the request.
     */
    try {
      const {url, type, headers, body: requestBody, params} = req.query;

      let statusCode;
      let body;
      switch (type) {
        case 'GET':
          ({statusCode, body} = await got(url, {
            headers: headers ? JSON.parse(headers) : {},
            searchParams: params ? JSON.parse(params) : {}
          }));
          break;
        case 'POST':
          ({statusCode, body} = await got.post(url, {
            headers: headers ? JSON.parse(headers) : {},
            json: requestBody ? JSON.parse(requestBody) : {}
          }));
          break;
        case 'PUT':
          ({statusCode, body} = await got.put(url, {
            headers: headers ? JSON.parse(headers) : {},
            json: requestBody ? JSON.parse(requestBody) : {}
          }));
          break;
        default:
          statusCode = 500;
          body = 'Something went wrong';
      }
      
      return res.json({
        status: statusCode,
        response: body,
      });
    } catch (err) {
      return res.json({
        status: 500,
        response: err.toString(),
      });
    }
  });

module.exports = router;
