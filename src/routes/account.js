const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const router = express.Router();

const users = [];

router.post(
  '/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { email, password } = req.body;
    const user = users.find((user) => user.email === email);
    if (user) {
      return res
        .status(400)
        .json({ message: 'This user name already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    users.push({
      email,
      password: hashedPassword,
    });

    const token = JWT.sign({ email }, 'secret_key', { expiresIn: '24h' });

    return res.json({ token });
  }
);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({
      message: 'This user does not exist.',
    });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: 'login failed.' });
  }

  const token = JWT.sign({ email }, 'secret_key', { expiresIn: '24h' });

  return res.json({ token });
});

module.exports = router;
