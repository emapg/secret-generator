const express = require('express');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

app.get('/generate-secret', (req, res) => {
    const secret = crypto.randomBytes(32).toString('hex');
    res.json({ secret });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
