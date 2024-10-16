const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

describe('User Endpoints', () => {
  // Create a user before testing login
  beforeAll(async () => {
    await request(app)
      .post('/api/v1/createUser')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'Password123!',
        role: 'approver',
      });
  });

  it('should log in a registered user with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/login')
      .send({
        email: 'testuser@example.com',
        password: 'Password123!',
      });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User successfully logged in');
    expect(res.body.data).toHaveProperty('access_token');
    expect(res.body.data).toHaveProperty('role', 'uploader');
  });

  it('should return error for unregistered user', async () => {
    const res = await request(app)
      .post('/api/v1/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'Password123!',
      });
      
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'You are not a registered user');
  });

  it('should return error for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/login')
      .send({
        email: 'testuser@example.com',
        password: 'WrongPassword!',
      });
      
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
   
  
  it('should log out a user', async () => {
    const response = await request(app)
      .post('/api/v1/logout')
      .send({})
      .expect(200);
    expect(response.body).toHaveProperty('message', 'User successfully logged out');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
