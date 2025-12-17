
const express = require('express');
const router = express.Router();

const Docker = require('dockerode');
let docker;
try {
  docker = new Docker();
} catch (err) {
  console.warn("Docker not initialized. Lab routes will not function.", err.message);
}
const auth = require('../middleware/auth');

const labs = new Map();


const usedPorts = new Set();
const PORT_MIN = 55000;
const PORT_MAX = 55999;

function allocatePort() {
  for (let p = PORT_MIN; p <= PORT_MAX; p++) {
    if (!usedPorts.has(p)) {
      usedPorts.add(p);
      return p;
    }
  }
  throw new Error('No free ports available for labs');
}

function getStarterFiles() {
  return {
    'src/App.jsx':
      'export default function App() { return <h1>Hello CodePlay Lab</h1>; }',
    'src/main.jsx':
      "import React from 'react';\n" +
      "import ReactDOM from 'react-dom/client';\n" +
      "import App from './App';\n" +
      "ReactDOM.createRoot(document.getElementById('root')).render(<App />);\n",
  };
}


router.post('/', auth, async (req, res) => {
  try {
    const { courseId, topicId } = req.body;
    if (!courseId || !topicId) {
      return res.status(400).json({ error: 'Missing courseId or topicId' });
    }

    if (!docker) {
      return res.status(503).json({ error: 'Lab environment (Docker) is not available on this server.' });
    }

    const container = await docker.createContainer({
      Image: 'codeplay-lab:latest',
      ExposedPorts: { '4173/tcp': {} },
      HostConfig: {
        PublishAllPorts: false,
        PortBindings: {
          '4173/tcp': [{ HostPort: '' }],
        },
      },
    });

    await container.start();
    await new Promise(r => setTimeout(r, 300));

    const data = await container.inspect();
    const ports = data.NetworkSettings?.Ports || {};
    const bindings = ports['4173/tcp'];

    if (!bindings || !bindings[0]?.HostPort) {
      throw new Error('No host port bound for 4173/tcp');
    }

    const hostPort = bindings[0].HostPort;
    const devUrl = `http://localhost:${hostPort}`;
    const labId = container.id.slice(0, 12);

    labs.set(labId, {
      containerId: container.id,
      userId: req.user.id,
      courseId,
      topicId,
      hostPort,
      files: getStarterFiles(),
    });

    return res.status(201).json({ labId, devUrl });
  } catch (err) {
    console.error('LAB ERROR:', err);
    return res.status(500).json({ error: err.message || 'Failed to start lab' });
  }
});




router.post('/:labId/files', auth, async (req, res) => {
  const { labId } = req.params;
  const { path, content } = req.body;

  const lab = labs.get(labId);
  if (!lab) return res.status(404).json({ error: 'Lab not found' });

  lab.files[path] = content;
  return res.json({ ok: true });
});



router.get('/:labId/files', auth, (req, res) => {
  const lab = labs.get(req.params.labId);
  if (!lab) return res.status(404).json({ error: 'Lab not found' });
  return res.json({ files: lab.files || {} });
});


router.put('/:labId/files', auth, (req, res) => {
  const lab = labs.get(req.params.labId);
  if (!lab) return res.status(404).json({ error: 'Lab not found' });

  const { path, content } = req.body;
  if (!path) return res.status(400).json({ error: 'Missing path' });

  lab.files = lab.files || {};
  lab.files[path] = content ?? '';
  labs.set(req.params.labId, lab);

  return res.json({ ok: true });
});

module.exports = router;
