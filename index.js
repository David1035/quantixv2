const express = require('express');
const cors = require('cors');
const routerApi = require('./routes')
const { logErrors, boomErrorHandler, errorHandler } = require('./middlewares/error.handler')


const port = process.env.PORT || 3000;
const app = express();
app.use(express.json())
app.use(cors())


routerApi(app); // escuchamos la ruta, y enviamos el body, params,  y query
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);



app.listen(port, () => {
  console.log('server in port ', port)
})
