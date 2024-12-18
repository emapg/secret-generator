import { randomBytes } from 'crypto';
import Cors from 'cors';

// Initialize CORS middleware
const cors = Cors({
  methods: ['GET'], // Allow only GET requests
});

// Helper function to run middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Load environment variables
require('dotenv').config();

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === 'GET') {
    try {
      // Get the secret length from query params or use a default value
      const length = parseInt(req.query.length, 10) || parseInt(process.env.DEFAULT_SECRET_LENGTH, 10) || 32;

      // Validate length
      if (length < 16 || length > 128) {
        return res.status(400).json({
          success: false,
          error: 'Secret length must be between 16 and 128 characters.',
        });
      }

      // Generate the secret using Node.js crypto module
      const secret = randomBytes(length / 2).toString('hex'); // Divide length by 2 because `randomBytes` generates bytes, and hex doubles the size

      res.status(200).json({
        success: true,
        secret,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
    });
  }
}
