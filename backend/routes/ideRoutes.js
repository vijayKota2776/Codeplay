// backend/routes/ideRoutes.js
const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

// POST /api/ide/run
router.post('/run', (req, res) => {
  const { language, code } = req.body || {};

  if (language !== 'javascript') {
    return res.status(400).json({ error: 'Only JavaScript is supported here' });
  }
  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing code' });
  }

  // Run JS with node in a separate process (very basic, no sandbox)
  const child = exec('node', { timeout: 5000 }, (error, stdout, stderr) => {
    if (error && !stderr) {
      // exec-level error (timeout, non-zero exit) but no stderr from script
      return res.json({
        stdout,
        stderr: error.message,
        status: { code: error.code, signal: error.signal },
      });
    }

    return res.json({
      stdout: stdout || '',
      stderr: stderr || '',
      status: { code: error ? error.code : 0 },
    });
  });

  // Send the code to node via stdin
  child.stdin.write(code);
  child.stdin.end();
});

module.exports = router;
