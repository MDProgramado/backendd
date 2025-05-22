
const jsonServer = require('json-server');
const path = require('path');
const cors = require('cors');


const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));


const allowedOrigins = [
  'http://localhost:4200',
  'https://testflow-app-seven.vercel.app'
];
const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
};


const ENV = process.env.NODE_ENV || 'development';
console.log(`Inicializando servidor em ambiente: ${ENV}`);
server.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('[CORS preflight] headers:', {
      origin: req.headers.origin,
      acrm: req.headers['access-control-request-method'],
      acrh: req.headers['access-control-request-headers']
    });
  }
  next();
});


server.use(cors(corsOptions));
server.options('*', cors(corsOptions));


server.use(jsonServer.defaults({ noCors: true }));


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


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor JSON-Server rodando na porta ${PORT} em ambiente ${ENV}`);
});
