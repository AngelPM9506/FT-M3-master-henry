const session = require('supertest-session');
const app = require('../index.js'); // Importo el archivo de entrada del server de express.

const agent = session(app);

describe('Test de APIS', () => {
  describe('GET /', () => {
    it('responds with 200', () => agent.get('/').expect(200));
    it('responds with and object with message `hola`', () =>
      agent.get('/').then((res) => {
        expect(res.body.message).toEqual('hola');
      }));
  });

  describe('GET /test', () => {
    it('responds with 200', () => agent.get('/test').expect(200));
    it('responds with and object with message `test`', () =>
      agent.get('/test').then((res) => {
        expect(res.body.message).toEqual('test');
      }));
  });

  describe('POST /sum', () => {
    it('responds with 200', () => agent.post('/sum').expect(200));
    it('responds with the sum of 2 and 3', () =>
      agent.post('/sum')
        .send({ a: 2, b: 3 })
        .then((res) => {
          expect(res.body.result).toEqual(5);
        })
    );
  });

  describe('POST /producto', () => {
    it('responds with 200', () => agent.post('/product').expect(200));
    it('responds with the product of 2 and 3', () =>
      agent.post('/product')
        .send({ a: 2, b: 3 })
        .then((res) => {
          expect(res.body.result).toEqual(6);
        })
    );
  });

  describe('POST /sumArray', () => {
    it('responds with 200', () => agent.post('/sumArray').expect(200));
    it('Respond with true or false if the internal sum of the array is equal or not equal to the number sent.', () =>
      agent.post('/sumArray')
        .send({ array: [2, 5, 7, 10, 11, 15, 20], num: 13 })
        .then((res) => {
          expect(res.body.result).toEqual(false);
        }));
    it('Respond with true or false if the internal sum of the array is equal or not equal to the number sent.', () =>
      agent.post('/sumArray')
        .send({ array: [2, 5, 7, 10, 11, 15, 20], num: 70 })
        .then((res) => {
          expect(res.body.result).toEqual(true);
        }));
  });

  describe('POST /numString', () => {
    it('Response with 400, if send empty', () => agent.post('/numString').expect(400));
    it('Response with 400, if send anything different of a string', () => agent.post('/numString').send({ word: 123 }).expect(400));
    it('Response with 200, if send a correct strign', () => agent.post('/numString').send({ word: 'Angel' }).expect(200));
    it('Response with the correct number of character if we send it', () => {
      return agent.post('/numString')
        .send({ word: 'Angel' })
        .then(res => {
          expect(res.body.result).toBe(5);
        })
    });
    it('Response with the correct number of character if we send it', () => {
      return agent.post('/numString')
        .send({ word: 'Mondragon' })
        .then(res => {
          expect(res.body.result).toBe(9);
        })
    });
  });

  describe('POST /pluck', () => {
    it('Response with 400, if send empty', () => agent.post('/pluck').expect(400));
    it('Responder con un status 400 (bad request) si array no es un arreglo', () =>
      agent.post('/pluck')
        .send({ array: 'Esto no es un arreglo', prop: 'unString' })
        .expect(400)
    );
    it('Responder con un status 400 (bad request) si el string propiedad está vacio.', () =>
      agent.post('/pluck')
        .send({ array: [{ lago: 'para probar' }], prop: '' })
        .expect(400)
    );
    it('Responder con status 200', () =>
      agent.post('/pluck')
        .send({ array: [{ name: 'Full Metal', genero: 'shojo' }], prop: 'anime' })
        .expect(200)
    );

    it('Responder con al funcionalidad del pluck.', () =>
      agent.post('/pluck')
        .send({
          array: [
            { name: 'Evangelion', genero: 'mecha' },
            { name: 'Zoids', genero: 'mecha' },
            { name: 'Kenichi', genero: 'Artes marciales' }
          ],
          prop: 'genero'
        })
        .then(res => {
          expect(res.body.result).toEqual(['mecha', 'mecha', 'Artes marciales'])
        })
    )
  });
});

