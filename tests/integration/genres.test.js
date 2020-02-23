const request = require('supertest');
const { Genre } = require('../../src/models/genre');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
  beforeEach(() => { 
    server = require('../../src/server'); 
  });
  
  afterEach(async () => { 
    await Genre.deleteMany({}); 
    server.close(); 
  });
  
  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.insertMany([
        {name: "genre 1"},
        {name: "genre 2"}
      ]);
      const res = await request(server).get('/api/genres');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'genre 1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'genre 2')).toBeTruthy();
    }, 30000);
  });

  describe('GET /:id', () => {
    it('should return a genre if valid id is passed', async () => {
      let genre = new Genre({ name: 'genre 1' });
      await genre.save();

      const res = await request(server).get('/api/genres/' + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);
      expect(res.body).toHaveProperty('_id', genre._id.toHexString());
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/genres/1');

      expect(res.status).toBe(404);
    });
  });
});