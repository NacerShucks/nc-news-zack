const request = require('supertest')
const app = require('../app.js')
const db = require('../db/connection.js')
const data = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})

describe('GET /api/topics', () => {
    it('200: returns array of topic objects with correct keys', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(Object.keys(body.topics[0]).length).toBe(2)
            expect(Object.keys(body.topics[0])).toContain('description', 'slug')
        })
    });
    it('200: returns topic array of expected length', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body.topics.length).toBe(3)
        })
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
        it('404: responds with not found msg when requested with too short an endpoint', () => {
            return request(app)
            .get('/api/')
            .expect(404)
            .then((response) => {
                expect(response.error.text).toBe('Not Found')
            })
        });
    });
});