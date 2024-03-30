const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    test('Creating a new thread: POST request to /api/threads/{board}', function(done) {
      chai.request(server)
       .post('/api/threads/test')
       .send({
            text: 'title_ssd',
            delete_password: 'delete_password_ssd',
       })
       .end(function(err, res){
         assert.equal(res.status, 200);
         assert.equal(res.body.text, 'title_ssd');
         assert.equal(res.body.delete_password, 'delete_password_ssd');
         done();
       });
    });

    test('Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}', function(done) {
        chai.request(server)
         .get('/api/threads/test')
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.property(res.body[0], 'text', 'Books in array should contain _id');
           done();
         });
      });

    test('Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password', function(done) {
        chai.request(server)
         .get('/api/threads/test')
         .end(function(err, res){
           assert.equal(res.status, 200);

           chai.request(server)
            .delete('/api/threads/' + res.body[0].board)
            .send({
                 thread_id: res.body[0]._id,
                 delete_password: 'incorrect password',
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.text, 'incorrect password');
              done();
            });
         });
      });

    test('Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password', function(done) {
        chai.request(server)
         .get('/api/threads/test')
         .end(function(err, res){
           assert.equal(res.status, 200);

           chai.request(server)
            .delete('/api/threads/' + res.body[0].board)
            .send({
                 thread_id: res.body[0]._id,
                 delete_password: 'delete_password_ssd',
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.text, 'success');
              done();
            });
         });
      });

    test('Reporting a thread: PUT request to /api/threads/{board}', function(done) {
        chai.request(server)
         .get('/api/threads/test')
         .end(function(err, res){
           assert.equal(res.status, 200);

           chai.request(server)
            .put('/api/threads/' + res.body[0].board)
            .send({
                 thread_id: res.body[0]._id,
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.text, 'reported');
              done();
            });
         });
      });

    test('Creating a new reply: POST request to /api/replies/{board}', function(done) {
        chai.request(server)
         .get('/api/threads/test')
         .end(function(err, res){
           assert.equal(res.status, 200);

           chai.request(server)
            .post('/api/replies/' + res.body[0].board)
            .send({
                 thread_id: res.body[0]._id,
                 text: 'text_tt',
                 delete_password: 'delete_password_tt',
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.body.replies[0].text, 'text_tt');
              done();
            });
         });
      });

    test('Viewing a single thread with all replies: GET request to /api/replies/{board}', function(done) {
        chai.request(server)
         .get('/api/threads/test')
         .end(function(err, res){
           assert.equal(res.status, 200);

           chai.request(server)
            .get(`/api/replies/${res.body[0].board}?thread_id=${res.body[0]._id}`)
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.body.replies[0].text, 'text_tt');
              done();
            });
         });
      });

    test('Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password', function(done) {
        chai.request(server)
         .get('/api/threads/test')
         .end(function(err, res){
           assert.equal(res.status, 200);

           chai.request(server)
            .delete(`/api/replies/${res.body[0].board}`)
            .send({
                thread_id: res.body[0]._id,
                reply_id: res.body[0].replies[0]._id,
                delete_password: 'incorrect password',
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.text, 'incorrect password');
              done();
            });
         });
      });

    test('Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password', function(done) {
        chai.request(server)
         .get('/api/threads/test')
         .end(function(err, res){
           assert.equal(res.status, 200);

           chai.request(server)
            .delete(`/api/replies/${res.body[0].board}`)
            .send({
                thread_id: res.body[0]._id,
                reply_id: res.body[0].replies[0]._id,
                delete_password: 'delete_password_tt',
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.text, 'success');
              done();
            });
         });
      });

    test('Reporting a reply: PUT request to /api/replies/{board}', function(done) {
        chai.request(server)
         .get('/api/threads/test')
         .end(function(err, res){
           assert.equal(res.status, 200);

           chai.request(server)
            .put(`/api/replies/${res.body[0].board}`)
            .send({
                thread_id: res.body[0]._id,
                reply_id: res.body[0].replies[0]._id,
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.text, 'reported');
              done();
            });
         });
      });
  
});
