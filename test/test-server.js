const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog Posts', function() {
    before(function() {
        return runServer();
      });

    after(function() {
        return closeServer();
      });

it('should list blog items on GET', function() {

    return chai.request(app)
    .get('/blog-post')
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');

      expect(res.body.length).to.be.at.least(1);
    
      const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
      res.body.forEach(function(item) {
        expect(item).to.be.a('object');
        expect(item).to.have.all.keys(expectedKeys);
      });
    });
});

it('should add a blog item on POST', function() {
    const newItem = {
        title: 'foo bar', 
        content: 'bizz bar bang foo', 
        author: 'Sally Students'
};
   
  return chai.request(app)
      .post('/blog-post')
      .send(newItem)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.all.keys(['id', 'publishDate'].concat(Object.keys(newItem)));
        expect(res.body.title).to.equal(newItem.title);
        expect(res.body.content).to.equal(newItem.content);
        expect(res.body.author).to.equal(newItem.author)
      });
  });

  it('should update blog items on PUT', function() {
    const updateData = {
        title: 'bar bar baggins', 
        content: 'fliend flag floot flight', 
        author: 'Timmy bean'
    };

    return chai.request(app)
    
    .get('/blog-post')
    .then(function(res) {
      updateData.id = res.body[0].id;

      return chai.request(app)
        .put(`/blog-post/${updateData.id}`)
        .send(updateData);
    })

    .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(updateData);
      });
  });

  it('should delete blog items on DELETE', function() {
    return chai.request(app)

      .get('/blog-post')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-post/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
});
