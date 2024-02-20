const request = require('supertest')
const app = require('../app.js')
const db = require('../db/connection.js')
const data = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')
const endpoints = require('../endpoints.json')

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})

describe('GET /api/topics', () => {
    it('200: returns topic array of expected length', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body.topics.length).toBe(3)
            body.topics.forEach((topic) => {
                expect(Object.keys(topic).length).toBe(2)
                expect(Object.keys(topic)).toContain('description', 'slug')
            })
        })
    });
    
});

describe('GET /api', () => {
    it('200: responds with an object describing all available endpoints on the API', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual(endpoints)
        })
    });
});

describe('GET /api/articles/:article_id', () => {
    it('200: responds with article object with correct properties', () => {
        const expectArticle = {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            }
        return request(app)
        .get(`/api/articles/1`)
        .expect(200)
        .then(({body}) => {
            expect(body.article).toEqual(expectArticle)
        })
    });
    it('400: responds with a msg of Bad Request when requesting an invalid string in artices/id', () => {
        const testId = 'badId'
        return request(app)
        .get(`/api/articles/${testId}`)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    });
    it('404: responds with a msg of Not Found when requesting a valid id that is not in db', () => {
        const testId = 50
        return request(app)
        .get(`/api/articles/${testId}`)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    });

});

describe.only('POST /api/articles/:article_id/comments', () => {
    it.only('201: responds with the posted comment when given valid request body', () => {
        const startTime = new Date()
        return request(app)
        .post('/api/articles/2/comments')
        .send({
            username: "butter_bridge",
            body: "testBody"
            
        })
        .expect(201)
        .then(({body}) => {
            console.log(body);
            
            expect(body.comment).toEqual({
                body: 'testBody',
                votes: 0,
                author: 'butter_bridge',
                article_id: 2,
                created_at: '2024-02-20T22:39:17.583Z'
            })
        })
    });
    it('400: responds with Bad Request when provided too many fields', () => {
        return request(app)
        .post('/api/articles/2/comments')
        .send({
            username: "butter_bridge",
            body: "testBody"
        })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual('Bad Request')
        })
    });
    it('400: responds with Bad Request when provided too few fields', () => {
        return request(app)
        .post('/api/articles/2/comments')
        .send({
            username: "butter_bridge",
            body: "testBody"
        })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual('Bad Request')
        })
    });
    it('400: responds with Bad Request when one field has wrong name', () => {
        return request(app)
        .post('/api/articles/2/comments')
        .send({
            username: "butter_bridge",
            body: "testBody"
        })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual('Bad Request')
        })
    });
    it('400: responds with Bad Request when field has wrong value type', () => {
        return request(app)
        .post('/api/articles/2/comments')
        .send({
            username: "butter_bridge",
            body: "testBody"
        })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual('Bad Request')
        })
    });
});

describe('GET /api/topics ERR HANDLING', () => {
    it('404: responds with not found msg when requested with invalid endpoint', () => {
        return request(app)
        .get('/api/topics/nonsense')
        .expect(404)
        .then((response) => {
            expect(response.error.text).toBe('Not Found')
        })
    });
});