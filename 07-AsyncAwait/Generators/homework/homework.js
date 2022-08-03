function* fizzBuzzGenerator(max) {
  // Tu código acá:
  let num = 1
  if (max !== undefined) {
    while (num <= max) {
      if (num % 3 === 0 && num % 5 === 0) {
        yield 'Fizz Buzz';
      } else if (num % 3 === 0) {
        yield 'Fizz';
      } else if (num % 5 === 0) {
        yield 'Buzz';
      } else {
        yield num;
      }
      num = num + 1;
    }
  } else {
    while (true) {
      if (num % 3 === 0 && num % 5 === 0) {
        yield 'Fizz Buzz';
      } else if (num % 3 === 0) {
        yield 'Fizz';
      } else if (num % 5 === 0) {
        yield 'Buzz';
      } else {
        yield num;
      }
      num = num + 1;
    }
  }
}

module.exports = fizzBuzzGenerator;
