const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const generateSecret = (length, charset) => {
    let secret = '';
    const bytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        secret += charset[bytes[i] % charset.length];
    }
    return secret;
};

app.get('/generate-secret', (req, res) => {
    const { length = 32, algorithm = 'hex', charset = 'alphanumeric' } = req.query;
    try {
        let secret;
        if (charset === 'alphanumeric') {
            secret = generateSecret(parseInt(length), 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
        } else if (charset === 'numeric') {
            secret = generateSecret(parseInt(length), '0123456789');
        } else {
            secret = crypto.randomBytes(parseInt(length)).toString(algorithm);
        }
        res.json({ secret });
    } catch (err) {
        res.status(400).json({ error: 'Invalid parameters' });
    }
});

app.post('/generate-secret', (req, res) => {
    const { length = 32, algorithm = 'hex', charset = 'alphanumeric' } = req.body;
    try {
        let secret;
        if (charset === 'alphanumeric') {
            secret = generateSecret(parseInt(length), 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
        } else if (charset === 'numeric') {
            secret = generateSecret(parseInt(length), '0123456789');
        } else {
            secret = crypto.randomBytes(parseInt(length)).toString(algorithm);
        }
        res.json({ secret });
    } catch (err) {
        res.status(400).json({ error: 'Invalid parameters' });
    }
});

app.get('/validate-secret', (req, res) => {
    const { secret, length, charset = 'alphanumeric' } = req.query;
    let valid = true;
    if (length && secret.length !== parseInt(length)) valid = false;
    if (charset === 'alphanumeric' && /[^a-zA-Z0-9]/.test(secret)) valid = false;
    if (charset === 'numeric' && /[^0-9]/.test(secret)) valid = false;
    res.json({ valid });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
