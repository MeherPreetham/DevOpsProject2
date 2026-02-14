'use strict';

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/status', (req, res) => {
  res.json({
    status: 'UP',
    version: process.env.APP_VERSION || '1',
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on 0.0.0.0:${PORT}`);
});
