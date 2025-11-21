const express = require('express');
const cors = require('cors');
const routerApi = require('./routes')
const { logErrors, ormErrorHandler, boomErrorHandler, errorHandler } = require('./middlewares/error.handler')

const { checkApiKey } = require('./middlewares/auth.handler');

const seedAdminUser = require('./utils/seedAdmin');


const port = process.env.PORT || 3000;
const app = express();
app.use(express.json())
app.use(express.static('public'));
app.use(cors());

require('./utils/auth');

app.get('/nueva-ruta', checkApiKey, (req, res) => {
  res.send('hola, soy una nueva ruta')
})

routerApi(app); // escuchamos la ruta, y enviamos el body, params,  y query --
app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);



app.listen(port, async () => {
  console.log('server in port ', port);

  await seedAdminUser();
})
