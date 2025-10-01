const bcrypt = require('bcrypt');

async function verifyPassword() {
  myPassword = 'david123';
  const hash = '$2b$10$mOc/XsPhTKFwsM6hQfpBveZu38NfQyqHztu3Ik9jNZ5p7.tdM0ED6'
  const isMatch = await bcrypt.compare(myPassword, hash);
  console.log(isMatch)
}


verifyPassword()
