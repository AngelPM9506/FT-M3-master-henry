const express = require('express');
const app = express();

app.use(express.json()); // for parsing application/json

app.get('/test', (req, res) => {
  res.send({ message: 'test' });
});

app.post('/sum', (req, res) => {
  let { a, b } = req.body;
  let suma = parseInt(a) + parseInt(b);
  res.send({ result: suma });
})

app.get('/', (req, res) => {
  res.send({
    message: 'hola',
  });
});

app.post('/product', (req, res) => {
  res.send({
    result: req.body.a * req.body.b,
  });
});

app.post('/sumArray', (req, res) => {

  let { num, array } = req.body;
  let sum = 0, isEqual = false;

  if (num && array) {
    array.forEach(num => sum += num);
    if (sum === num) {
      isEqual = true;
    }
  }

  res.status(200).send({ result: isEqual });
});

app.post('/numString', (req, res) => {
  let { word } = req.body;
  if (!word || typeof (word) !== 'string' || word === '') {
    return res.status(400).send({ error: 'word is empty or different of a strign' });
  }
  return res.send({ result: word.length });
});

app.post('/pluck', (req, res) => {
  let { array, prop } = req.body;
  let newArray = [];
  if (!Array.isArray(array) || typeof (prop) !== 'string' || prop === '') {
    return res.sendStatus(400);
  }
  for (let i = 0; i < array.length; i++) {
    if (array[i].hasOwnProperty(prop)) {
      newArray.push(array[i][prop]);
    }
  }
  console.log(newArray);
  return res.send({ result: newArray })
})

module.exports = app; // Exportamos app para que supertest session la pueda ejecuta*
