import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Mock Auth
app.post('/api/v1/auth/signup', (req, res) => {
  res.json({
    success: true,
    data: {
      user: { id: '123', name: req.body.name, email: req.body.email },
      tokens: { accessToken: 'mock-token-123' }
    }
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  res.json({
    success: true,
    data: {
      user: { id: '123', name: 'Mock User', email: req.body.email },
      tokens: { accessToken: 'mock-token-123' }
    }
  });
});

app.get('/api/v1/auth/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      id: '123', name: 'Mock User', email: 'mock@example.com'
    }
  });
});

// Mock Dashboard
app.get('/api/v1/dashboard/', (req, res) => {
  res.json({
    success: true,
    data: {
      opportunities: 5,
      leads: 12,
      complianceIssues: 0,
      activeOutreaches: 3
    }
  });
});

app.listen(3001, () => {
  console.log('Mock API server running on http://localhost:3001');
});
