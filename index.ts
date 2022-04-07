import { Logger } from './turbo/middlewares/turbo-logger.middleware';
import { TurboApplication } from './turbo/application';
import { BodyParser } from './turbo/middlewares/body-parser.middleware';

const app = new TurboApplication();

app.use(Logger);
app.use(BodyParser);

app.post('/', (req, res) => {
  res.send(req.body);
});

app.get('/todos', (req, res) => {
  res.send({
    hello: 'world',
  });
});

app.get('/todos/:id', (req, res) => {
  res.send({ message: `hello from id ${req.params.id}` });
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`server is running on port %d`, PORT);
});
