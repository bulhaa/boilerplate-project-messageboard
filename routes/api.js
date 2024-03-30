'use strict';
const mongoose = require('mongoose')
const Database = require('../src/database');
const ThreadModel = require('../src/models/thread');

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .get(async function (req, res){
      let output = []
      let threads = await ThreadModel
      .find({board: req.params.board})
      .sort([['bumped_on', -1]])
      .limit(10)

      threads.map((doc) => {
        output.push({
          _id: doc._id,
          board: doc.board,
          text: doc.text,
          created_on: doc.created_on,
          bumped_on: doc.bumped_on,
          replies: doc.replies.slice(0, 3).map(
            (reply) => {
              return {
                _id: reply._id,
                text: reply.text,
                created_on: reply.created_on,
              }
            }
          ),
        })
      })

      res.json(output)
    })
    .post(function (req, res){
      let text  = req.body.text ;
      let delete_password = req.body.delete_password;

      const thread = new ThreadModel({
        text,
        delete_password,
        board: req.params.board,
        created_on: new Date(),
        bumped_on: new Date(),
        reported: false,
        replies: []
      }).save()
      .then((doc) => {
        res.json(doc);
      })
    })
    .put(async function (req, res){
      let thread_id = req.body.thread_id;

      let thread = await ThreadModel
      .findOne({ board: req.params.board, _id: thread_id})
      
      thread.reported = true;
      await thread.save()

      res.send('reported')
    })
    .delete(async function (req, res){
      let thread_id = req.body.thread_id;
      let delete_password = req.body.delete_password;

      let thread = await ThreadModel
      .findOne({ board: req.params.board, _id: thread_id})

      if(thread.delete_password !== delete_password){
        res.send('incorrect password')
        return
      }

      await thread.deleteOne()

      res.send('success')
    })
  
  app.route('/api/replies/:board')
  .get(async function (req, res){
    let thread_id = req.query.thread_id;

    let output = []
    let thread = await ThreadModel
    .findOne({ board: req.params.board, _id: thread_id})
    
    output = {
      _id: thread._id,
      text: thread.text,
      created_on: thread.created_on,
      bumped_on: thread.bumped_on,
      replies: thread.replies.map(
        (reply) => {
          return {
            _id: reply._id,
            text: reply.text,
            created_on: reply.created_on,
          }
        }
      ),
    }

    res.json(output)
  })
    .post(async function (req, res){
      let text  = req.body.text;
      let delete_password  = req.body.delete_password;
      let thread_id  = req.body.thread_id;

      let thread = await ThreadModel.findOne({_id: thread_id})
      if(!thread){
        res.send('no thread exists')
        return
      }

      thread.bumped_on = new Date()

      thread.replies = [{
        text,
        delete_password,
        created_on: thread.bumped_on,
        reported: false,
      }, ...thread.replies]

      await thread.save()

      res.json(thread)
    })
    .put(async function (req, res){
      let thread_id = req.body.thread_id;
      let reply_id = req.body.reply_id;

      let thread = await ThreadModel
      .findOne({ board: req.params.board, _id: thread_id})

      let reply = thread.replies.find((reply) => reply._id.toString() === reply_id)

      reply.reported = true;
      await thread.save()

      res.send('reported')
    })
    .delete(async function (req, res){
      let thread_id = req.body.thread_id;
      let reply_id = req.body.reply_id;
      let delete_password = req.body.delete_password;

      let thread = await ThreadModel
      .findOne({ board: req.params.board, _id: thread_id})

      let reply = thread.replies.find((reply) => reply._id.toString() === reply_id)

      if(reply.delete_password !== delete_password){
        res.send('incorrect password')
        return
      }

      reply.text = '[deleted]'
      await thread.save()

      res.send('success')
    })

};
