
const jsonServer = require('json-server');
const path = require('path');
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();


const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:4200',
    'https://testflow-app-pzcq.vercel.app'
  ],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
};


server.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('[CORS PRE-FLIGHT]', req.headers.origin, req.headers['access-control-request-method']);
  }
  next();
});


server.use(cors(corsOptions));


server.options('*', cors(corsOptions), (req, res) => {
  return res.sendStatus(204);
});


server.use(middlewares);

server.use(jsonServer.bodyParser);


server.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const user = router.db.get('users').find({ email, senha }).value();

  if (user) {
    const { senha: _, ...userWithoutPassword } = user;
    return res.status(200).json({ message: 'Login bem-sucedido', user: userWithoutPassword });
  }
  return res.status(401).json({ message: 'Credenciais inválidas' });
});


server.use(router);


server.use((err, req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(err.status || 500).json({ error: err.message });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
