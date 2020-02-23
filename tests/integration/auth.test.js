const request = require('supertest');
const { User } = require('../../src/models/user');
const { Genre } = require('../../src/models/genre');

let server;

describe('auth middleware', () => {
  beforeEach(async () => {
    server = require('../../src/server');
  });

  afterEach(async () => {
    await Genre.deleteMany({});
    await server.close();
  });

  let token;

  const exec = async () => {
    return await request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({
        name: 'genre 1'
      });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it('should return 401 if no token is provided', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if the token is invalid', async () => {
    token = '1';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if the token is valid', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
