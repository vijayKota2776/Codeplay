const axios = require('axios');

const runCode = async (req, res) => {
  const { code, stdin = '' } = req.body;

  try {
    const response = await axios.post(
      'https://ce.judge0.com/submissions?base64_encoded=false&wait=true',
      {
        source_code: code,
        language_id: 63,
        stdin
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const data = response.data;
    res.json({
      stdout: data.stdout,
      stderr: data.stderr,
      status: data.status,
      time: data.time,
      memory: data.memory
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      error: 'Sandbox error',
      detail: err.response?.data || err.message
    });
  }
};

module.exports = { runCode };
