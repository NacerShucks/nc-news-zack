const request = require('supertest')
const app = require('../app.js')
const db = require('../db/connection.js')
const data = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')
const endpoints = require('../endpoints.json')
const {convertTimestampToDate} = require('../db/seeds/utils.js')

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
                expect(Object.keys(topic)).toContain('description')
                expect(Object.keys(topic)).toContain('slug')
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
            comment_count: '11',
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
        return request(app)
        .get(`/api/articles/badId`)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    });
    it('404: responds with a msg of Not Found when requesting a valid id that is not in db', () => {
        return request(app)
        .get(`/api/articles/50`)
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

describe('POST /api/articles/:article_id/comments', () => {
    it('201: responds with the posted comment when given valid request body', () => {
        const before = Date.now()

        return request(app)
        .post('/api/articles/2/comments')
        .send({
            username: "butter_bridge",
            body: "testBody"

        })
        .expect(201)
        .then(({body}) => {
            const after = Date.now()
            expect(Date.parse(body.comment.created_at)).toBeGreaterThan(before)
            expect(Date.parse(body.comment.created_at)).toBeLessThan(after)
            expect(body.comment).toEqual({
                body: 'testBody',
                votes: 0,
                author: 'butter_bridge',
                article_id: 2,
                created_at: body.comment.created_at
            })
            
        })
    });
    it('201: when given extra fields responds with posted comment with extra feilds removed', () => {
        const before = Date.now()
        return request(app)
        .post('/api/articles/2/comments')
        .send({
            username: "butter_bridge",
            body: "testBody",
            complements: "wow what a well made back end"
        })
        .expect(201)
        .then(({body}) => {
            const after = Date.now()
            expect(Date.parse(body.comment.created_at)).toBeGreaterThan(before)
            expect(Date.parse(body.comment.created_at)).toBeLessThan(after)
            expect(body.comment).toEqual({
                body: 'testBody',
                votes: 0,
                author: 'butter_bridge',
                article_id: 2,
                created_at: body.comment.created_at
            })
        })
    });
    it('400: responds with Bad Request when provided too few fields', () => {
        return request(app)
        .post('/api/articles/2/comments')
        .send({
            username: "butter_bridge",
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
            bodyodyody: "testBody"
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
            body: []
        })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual('Bad Request')
        })
    })
    it('404: responds with Not Found when passed an article id that refrences no article', () => {
        return request(app)
        .post('/api/articles/500/comments')
        .send({
            username: "butter_bridge",
            body: "testBody"
        })
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toEqual('Not Found')
        })
    });
})
    
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
    })
})

describe('GET /api/articles', () => {
    it('200: responds with an articles array of article objects, sorted by date, each of which should have the expected properties', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveLength(13)
            body.forEach((article) => {
                expect(Object.keys(article)).toContain('author') 
                expect(Object.keys(article)).toContain('title') 
                expect(Object.keys(article)).toContain('article_id') 
                expect(Object.keys(article)).toContain('topic') 
                expect(Object.keys(article)).toContain('created_at') 
                expect(Object.keys(article)).toContain('article_img_url') 
                expect(Object.keys(article)).toContain('votes') 
                expect(Object.keys(article)).toContain('comment_count') 
                expect(Object.keys(article)).not.toContain('body')               
            })
            expect(body).toBeSortedBy('created_at', {descending: true})
            expect(body[0].comment_count).toBe("2")
        })
    });
});

describe('ERR HANDLING', () => {
    it('404: responds with not found msg when requested with invalid endpoint', () => {
        return request(app)
        .get('/api/topics/nonsense')
        .expect(404)
        .then((response) => {
            expect(response.error.text).toBe('Not Found')
        })
    });
});

describe('PATCH /api/articles/:article_id', () => {
    it('201: accepts vote incrementer object and returns the patched article', () => {
        const testPatch = {inc_votes : 10}
        const expectArticle = {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 110,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            }
        return request(app)
        .patch('/api/articles/1')
        .send(testPatch)
        .expect(201)
        .then(({body}) => {
            expect(body.article).toEqual(expectArticle)
        })
    });
    it('400: update value is not an int', () => {
        const testPatch = {inc_votes : 'ten'}
        return request(app)
        .patch('/api/articles/1')
        .send(testPatch)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    });
    it('400: invalid update object key', () => {
        const testPatch = {dec_votes : 10}
        return request(app)
        .patch('/api/articles/1')
        .send(testPatch)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    });
    it('400: non int in article_id ', () => {
        const testPatch = {inc_votes : 10}
        return request(app)
        .patch('/api/articles/update')
        .send(testPatch)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    });
    it('404: trying to update non existant article', () => {
        const testPatch = {inc_votes : 10}
        return request(app)
        .patch('/api/articles/500')
        .send(testPatch)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    it('201: responds with 201', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(201)
    });
    it('404: returns error when queried with valid int not present in db', () => {
        return request(app)
        .delete('/api/comments/5345')
        .expect(404)
    });
    it('400: returns error when queried with string', () => {
        return request(app)
        .delete('/api/comments/sdawid')
        .expect(400)
    });
    it('400: returns error when queried with number out of range for int', () => {
        return request(app)
        .delete('/api/comments/2423423423423')
        .expect(400)
    });
});

describe('GET /api/users', () => {
    it('200: returns user array of expected length', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            expect(body.users.length).toBe(4)
            body.users.forEach((user) => {
                expect(Object.keys(user).length).toBe(3)
                expect(Object.keys(user)).toContain('username')
                expect(Object.keys(user)).toContain('name')
                expect(Object.keys(user)).toContain('avatar_url')
            })
        })
    });
});

describe('GET /api/articles?topic', () => {
    it('200: when queried with topic returns only articles of specified topic', () => {
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({body}) => {
            body.forEach((article) => {
                expect(Object.keys(article).length).toBe(8)
                expect(article.topic).toBe("mitch");
            })
        });
    });
    it('when queried with a topic that matches nothing then return 404 error', () => {
        return request(app)
        .get('/api/articles?topic=invalid')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not Found")
        })
    });
});

