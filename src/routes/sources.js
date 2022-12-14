/* eslint-disable max-len */
const express = require('express');
const mongoose = require('mongoose');
const {authorization} = require('../middlewares');

const router = express.Router();

const Source = require('../models/source');

router.get('/sources',
  authorization,
  async (req, res, next) => {
    /**
     * GET  route
     * This request is for getting the sources from the database.
     * @returns A JSON Object with the source's data and a JSON Object with the value success set
     * to true.
     */
    try {
      const {id} = req.decoded;
      const foundSources = await Source.find({owner: mongoose.Types.ObjectId(id)});
      const sources = [];
      foundSources.forEach((s) => {
        sources.push({
          id: s._id,
          name: s.name,
          type: s.type,
          url: s.url,
          login: s.login,
          passcode: s.passcode,
          vhost: s.vhost,
          active: false
        });
      });

      return res.json({
        success: true,
        sources
      });
    } catch (err) {
      return next(err.body);
    }
  });

router.post('/create-source', 
  authorization,
  async (req, res, next) => {
    /**
     * POST route
     * This request is for creating a new source.
     * @returns A JSON Object with status 409 if a source with the same name already exists, or a
     * JSON Object with the value success set to true.
     */
    try {
      const {name, type, url, login, passcode, vhost} = req.body;
      const {id} = req.decoded;
      const foundSource = await Source.findOne({owner: mongoose.Types.ObjectId(id), name});
      if (foundSource) {
        return res.json({
          status: 409,
          message: 'A source with that name already exists.'
        });
      }
      await new Source({
        name,
        type,
        url,
        login,
        passcode,
        vhost,
        owner: mongoose.Types.ObjectId(id)
      }).save();

      return res.json({success: true});
    } catch (err) {
      return next(err.body);
    }
  });

router.post('/change-source', 
  authorization,
  async (req, res, next) => {
    /**
     * POST route
     * This request is for changing the information of a source.
     * @returns A JSON Object with status 409 if the specific source is not found or a source with
     * the same name have been found, or a JSON Object with the value success set to true.
     */
    try {
      const {id, name, type, url, login, passcode, vhost} = req.body;
      const foundSource = await Source.findOne({_id: mongoose.Types.ObjectId(id), owner: mongoose.Types.ObjectId(req.decoded.id)});
      if (!foundSource) {
        return res.json({
          status: 409,
          message: 'The selected source has not been found.'
        });
      }
      
      const sameNameSources = await Source.findOne({_id: {$ne: mongoose.Types.ObjectId(id)}, owner: mongoose.Types.ObjectId(req.decoded.id), name});
      if (sameNameSources) {
        return res.json({
          status: 409,
          message: 'A source with the same name has been found.'
        });
      }

      foundSource.name = name;
      foundSource.type = type;
      foundSource.url = url;
      foundSource.login = login;
      foundSource.passcode = passcode;
      foundSource.vhost = vhost;
      await foundSource.save();

      return res.json({success: true});
    } catch (err) {
      return next(err.body);
    }
  });

router.post('/delete-source', 
  authorization,
  async (req, res, next) => {
    /**
     * POST route
     * This request is for deleting a source.
     * @returns A JSON Object with status 409 if the source is not found, or a JSON Object with the
     * value success set to true.
     */
    try {
      const {id} = req.body;

      const foundSource = await Source.findOneAndRemove({_id: mongoose.Types.ObjectId(id), owner: mongoose.Types.ObjectId(req.decoded.id)});
      if (!foundSource) {
        return res.json({
          status: 409,
          message: 'The selected source has not been found.'
        });
      }
      return res.json({success: true});
    } catch (err) {
      return next(err.body);
    }
  });

router.post('/source',
  async (req, res, next) => {
    /**
     *  POST route
     *  This request is for finding a specific source from user with UserId in the database.
     *  @returns A JSON Object with status 409 if source is not found, or a JSON Object with the
     *  source's data if the source is found.
     */
    try {
      const {name, owner, user} = req.body;
      const userId = (owner === 'self') ? user.id : owner;
      const foundSource = await Source.findOne({name, owner: mongoose.Types.ObjectId(userId)});
      if (!foundSource) {
        return res.json({
          status: 409,
          message: 'The selected source has not been found.'
        });
      }

      const source = {};
      source.type = foundSource.type;
      source.url = foundSource.url;
      source.login = foundSource.login;
      source.passcode = foundSource.passcode;
      source.vhost = foundSource.vhost;
    
      return res.json({
        success: true,
        source
      });
    } catch (err) {
      return next(err.body);
    }
  });

router.post('/check-sources',
  authorization,
  async (req, res, next) => {
    /**
     *  POST route
     * This request is for adding a non-existing source in the database. Tries to find the source
     * and if the source is not found, then it is added to the database.
     */
    try {
      const {sources} = req.body;
      const {id} = req.decoded;

      const newSources = [];

      for (let i = 0; i < sources.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const result = await Source.findOne({name: sources[i], owner: mongoose.Types.ObjectId(id)});
        if (!result) {
          newSources.push(sources[i]);
        }
      }

      for (let i = 0; i < newSources.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await new Source({
          name: newSources[i],
          type: 'stomp',
          url: '',
          login: '',
          passcode: '',
          vhost: '',
          owner: mongoose.Types.ObjectId(id)
        }).save();
      }

      return res.json({
        success: true,
        newSources
      });
    } catch (err) {
      return next(err.body);
    }
  });

module.exports = router;
