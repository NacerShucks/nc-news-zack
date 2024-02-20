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

describe('GET /api/articles/:article_id/comments', () => {
    it('200: responds with an array of comments for the given article_id, ordered with most recent first of which each comment should have expected properties', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toHaveLength(11)
            body.comments.forEach((comment) => {
                expect(Object.keys(comment)).toContain('comment_id')
                expect(Object.keys(comment)).toContain('votes')
                expect(Object.keys(comment)).toContain('created_at')
                expect(Object.keys(comment)).toContain('author')
                expect(Object.keys(comment)).toContain('body')
                expect(Object.keys(comment)).toContain('article_id')
            })
            expect(body.comments).toBeSortedBy('created_at', {descending: true})
        })
    });
    it('200: responds with an empty array when given article id for artical with no comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toHaveLength(0)
        })
    });
    it('404: responds with msg of Not Found when given article id that refrences no article', () => {
        return request(app)
        .get('/api/articles/600/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    });
    it('400: responds with msg of Bad Request when given invalid data in place of article id', () => {
        return request(app)
        .get('/api/articles/invaliddata/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
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