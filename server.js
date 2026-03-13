import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, 'dist'),
});

server.use(middlewares);
server.use(router);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
