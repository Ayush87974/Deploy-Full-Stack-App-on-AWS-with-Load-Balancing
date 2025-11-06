const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// simple cors so frontend on different host can call
app.use(cors());
app.use(bodyParser.json());

// health check for ALB
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// demo protected route
function verifyToken(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = (auth.startsWith('Bearer ') && auth.split(' ')[1]) || null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

app.post('/login', (req, res) => {
  // hardcoded demo user
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password123') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Hello from protected route', user: req.user });
});

app.get('/', (req, res) => res.send('Hello from backend!'));

app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
