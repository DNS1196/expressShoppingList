process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require('./app');
let items = require('./fakeDb');

let tv = { name: 'tv', price: 145 };

beforeEach(function () {
    items.push(tv);
})
afterEach(function () {
    items.length = 0;
})

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ items: [tv] })
    })
})

describe("POST /items", () => {
    test("Create new item", async () => {
        const res = await request(app).post('/items').send({ name: "Chair", price: 20 });
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({ added: { name: "Chair", price: 20 } })
    })
    test("Responds with 400 if name or price is missing", async () => {
        const res = await request(app).post('/items').send({});
        expect(res.statusCode).toBe(400);
    })
})


describe('GET /items/:name', () => {
    test("Get item by name", async () => {
        const res = await request(app).get(`/items/${tv.name}`);
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ item: tv })
    })
    test("Responds with 404 if invalid item", async () => {
        const res = await request(app).get(`/items/bike`);
        expect(res.statusCode).toBe(404)
    })
})

describe('PATCH /items/:name', () => {
    test("Update an item's info", async () => {
        const res = await request(app).patch(`/items/${tv.name}`).send({ name: 'BigTV', price: '250' });
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ updated: { name: 'BigTV', price: '250' } })
    })
    test("Responds with 404 if invalid item", async () => {
        const res = await request(app).get(`/items/smalltv`).send({ name: 'BigTV', price: '250' });
        expect(res.statusCode).toBe(404)
    })
})

describe('DELETE /items/:name', () => {
    test('Delete an item', async () => {
        const res = await request(app).delete(`/items/${tv.name}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ message: "Deleted" })
    })
    test('Responds with 404 for invalid name', async () => {
        const res = await request(app).delete('/items/smalltv')
        expect(res.statusCode).toBe(404)
    })
})