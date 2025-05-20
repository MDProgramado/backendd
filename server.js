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
  'https://testflow-app-mu.vercel.app' 
];

server.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Acesso bloqueado pela política CORS'), false);
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
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


server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});