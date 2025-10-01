const jwt = require('jsonwebtoken');

const secret = 'mySecret';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJhZG1pbmlzdHJhZG9yIiwiaWF0IjoxNzU5MzQ4MTI2fQ.85nXTnr6vmd-dYmmp7wFuOkM8V-743Dv5aoyEEmvUsA'

function verifyToken(token, secret){
  return jwt.verify(token, secret)
}

const payload = verifyToken(token, secret);
console.log(payload);
