const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const apiRoutes = require('./routes/api');
const pageRoutes = require('./routes/pages');
const errorHandler = require('./middleware/errorHandler');
const limiter = require('./middleware/rateLimiter');

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
    },
  },
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(limiter);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', pageRoutes);
app.use('/api', apiRoutes);

app.use(errorHandler);

module.exports = app;
