const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json')); 
const middlewares = jsonServer.defaults();
const cors = require('cors');


server.use((req, res, next) => {
  console.log('Dados do db.json:', router.db.getState());
  next();
});

server.use(jsonServer.bodyParser);


const allowedOrigins = [
  'http://localhost:4200',
  'https://testflow-app-pzcq.vercel.app' 
];

server.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  next();
});

server.use(cors({
  origin: function (origin, callback) {

    if (!origin) return callback(null, true); 

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Acesso bloqueado pela política CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


server.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const user = router.db.get('users').find({ email, senha }).value();

  if (user) {
    const { senha: _, ...userWithoutPassword } = user; 
    res.status(200).json({ message: 'Login bem-sucedido', user: userWithoutPassword });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});