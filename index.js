const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/generate-secret', (req, res) => {
    const { length = 32, algorithm = 'hex' } = req.query;
    try {
        const secret = crypto.randomBytes(parseInt(length)).toString(algorithm);
        res.json({ secret });
    } catch (err) {
        res.status(400).json({ error: 'Invalid parameters' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
