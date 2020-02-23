const request = require('supertest');
const { Genre } = require('../../src/models/genre');
const { User } = require('../../src/models/user');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
  beforeEach(() => {
    server = require('../../src/server');
  });

  afterEach(async () => {
    await Genre.deleteMany({});
    await server.close();
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.insertMany([
        {
          name: 'genre 1'
        },
        {
          name: 'genre 2'
        }
      ]);
      const res = await request(server).get('/api/genres');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === 'genre 1')).toBeTruthy();
      expect(res.body.some((g) => g.name === 'genre 2')).toBeTruthy();
    }, 30000);
  });

  describe('GET /:id', () => {
    it('should return a genre if valid id is passed', async () => {
      let genre = new Genre({
        name: 'genre 1'
      });
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

    it('should return 404 if passed id is not in the db', async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const res = await request(server).get(`/api/genres/${id}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    let token;
    let name;

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre 1';
    });

    const exec = async () => {
      return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({
          name: name
        });
    };

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if genre is less than 5 characters', async () => {
      name = '1234';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 characters', async () => {
      name = new Array(60).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 200 if name is more than 4 and less than 51 characters', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should save the genre if it is valid', async () => {
      await exec();

      const genre = await Genre.findOne({
        name: name
      });

      expect(genre).not.toBeNull();
      expect(genre).toHaveProperty('name', name);
    });

    it('should return the genre if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name', 'genre 1');
      expect(res.body).toHaveProperty('_id');
    });
  });
});
