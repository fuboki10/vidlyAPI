const request = require('supertest');
const { Genre } = require('../../src/models/genre');
let server;

describe('/api/genres', () => {
  beforeEach(() => { 
    server = require('../../src/server'); 
  });
  
  afterEach(async () => { 
    await Genre.remove({}); 
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

    }, 30000);
  });
});