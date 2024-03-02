import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';

import server from '@/app';

chai.should();
chai.use(chaiHttp);

const testUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'hello@example.com',
    password: '123456',
    phone: '1234567890',
    userName: 'test_user',
    isAdmin: true,
    status: true,
};

let token;

describe.skip('POST /api/auth/register', () => {
    it('should create new user and return tokens', (done) => {
        chai.request(server)
            .post('/api/auth/register')
            .send(testUser)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                // Check response
                res.should.have.status(201);
                res.body.should.have.property('token').a('string');
                res.body.should.have.property('refreshToken').a('string');
                done();
            });
    });
});

describe.skip('POST /api/auth/login', () => {
    it('should return tokens with 200 status code', (done) => {
        const payload = { userName: testUser.userName, password: testUser.password };
        chai.request(server)
            .post('/api/auth/login')
            .send(payload)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                // Check response
                res.should.have.status(200);
                res.body.should.have.property('token').a('string');
                res.body.should.have.property('refreshToken').a('string');
                // Set token
                token = res.body.token;
                done();
            });
    });
});

describe.skip('GET /api/auth/me', () => {
    it('should return current user with 200 status code', (done) => {
        chai.request(server)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                // Check response
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have
                    .property('firstName')
                    .eql(testUser.firstName);
                res.body.should.have
                    .property('lastName')
                    .eql(testUser.lastName);
                res.body.should.have.property('email').eql(testUser.email);
                res.body.should.have.property('createdAt');
                res.body.should.have.property('updatedAt');
                done();
            });
    });
});

describe.skip('PUT /api/auth/me', () => {
    it('should update authenticated user', (done) => {
        const payload = { firstName: 'Express', lastName: 'Starter' };
        chai.request(server)
            .put('/api/auth/me')
            .send(payload)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                // Check response
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(true);
                done();
            });
    });
});

describe.skip('DELETE /api/auth/me', () => {
    it('should delete authenticated user', (done) => {
        chai.request(server)
            .delete('/api/auth/me')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if (err) {
                    throw err;
                }
                // Check response
                res.should.have.status(204);
                done();
            });
    });
});
