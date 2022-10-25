const express = require('express');
const bcrypt = require('bcrypt');

const app = express();

class AppError extends Error {
  constructor(message, code = 500) {
    super(message);
    this.statusCode = code;
  }
}

const users = [
  //  FIXME Delete before demonstration
  {
    email: 'test@test.com',
    password: '$2b$12$7HftjaznSTN5xcjUr9Gn9u3/NMo2HhWuUdHxPrUd9dZxREI8ckm3a',
    name: 'Dummy User',
    status: 'Default',
    id: 0,
  },
];

let posts = [
  //  FIXME Delete before demonstration
  {
    title: 'First post',
    content: 'Everything works perfectly!',
    imageUrl: 'https://images.stock.com/image/1.png',
    creator: 0,
    id: 0,
  },
];

let postCounter = 1;
let userCounter = 1;

// Body parse middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`\nNew incoming request:\n`);
  console.log(`\t${req.method} ${req.url} HTTP/${req.httpVersion}\n`);
  for (const [header, value] of Object.entries(req.headers)) {
    console.log(`\t${header}: ${value}`);
  }
  console.dir(req.body);
  next();
});

// Auth routes

app.post('/auth/signup', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const conflict = users.find((user) => user.email === email);

    if (conflict) {
      throw new AppError('Email taken', 403);
    }

    const user = {
      email,
      name,
      password: hashedPassword,
      id: userCounter,
    };

    userCounter += 1;

    users.push(user);

    res.status(201).json({
      message: 'User has been created',
    });
  } catch (error) {
    next(error);
  }
});

app.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    const authError = new AppError('Authentification failed. Check your email/password.', 401);

    if (!user) throw authError;

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) throw authError;

    res.status(200).json({
      message: 'Authentification succeeded.',
      userId: user.id,
    });
  } catch (error) {
    next(error);
  }
});

// Post routes

app.get('/post/all', (req, res, next) => {
  try {
    res.status(200).json({ posts, totalItems: posts.length });
  } catch (error) {
    next(error);
  }
});

app.get('/post/search', (req, res, next) => {
  try {
    const searchPhrase = req.query.phrase.toLowerCase();

    const filteredPosts = posts.filter(
      (p) => p.content.toLowerCase().includes(searchPhrase) || p.title.toLowerCase().includes(searchPhrase)
    );

    res.status(200).json({ posts: filteredPosts, totalItems: filteredPosts.length });
  } catch (error) {
    next(error);
  }
});

app.get('/post/:postId', (req, res, next) => {
  try {
    const post = posts.find((p) => p.id === Number(req.params.postId));

    if (!post) {
      throw new AppError("Coudn't find post", 404);
    }

    res.status(200).json({ post });
  } catch (error) {
    next(error);
  }
});

app.post('/post', (req, res, next) => {
  try {
    const { title, content, imageUrl, userId } = req.body;

    const user = users.find((u) => u.id === Number(userId));

    if (!user) throw new AppError('Can not find user', 400);

    const post = { title, content, imageUrl, id: postCounter, creator: user.id };

    postCounter += 1;

    posts.push(post);

    res.status(201).json({
      message: 'Post has been created',
      post,
    });
  } catch (error) {
    next(error);
  }
});

app.patch('/post/:postId', (req, res, next) => {
  try {
    const post = posts.find((p) => p.id === Number(req.params.postId));

    if (!post) {
      throw new AppError("Coudn't find post", 404);
    }

    const updatedPost = { ...post, ...req.body };

    posts = posts.filter((p) => p.id !== Number(req.params.postId));

    posts.push(updatedPost);

    res.status(200).json({
      message: 'The post has been updated.',
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
});

app.delete('/post/:postId', (req, res, next) => {
  try {
    const post = posts.find((p) => p.id === Number(req.params.postId));

    if (!post) {
      throw new AppError("Coudn't find post", 404);
    }

    posts = posts.filter((p) => p.id !== Number(req.params.postId));

    res.status(200).json({
      message: 'The post has been deleted.',
      id: post.id,
    });
  } catch (error) {
    next(error);
  }
});

app.use((_req, res, _next) => {
  res.status(404).json({ message: 'API endpoint not found', statusCode: 404 });
});

// Error handling middleware
app.use((error, _req, res, _next) => {
  const { message, data, statusCode } = error;
  if (!statusCode || statusCode >= 500) {
    console.error(error);
  }
  res.status(statusCode || 500).json({ message, data, statusCode });
});

async function init() {
  try {
    app.listen(8080, () => console.log('Listening 8080'));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

init();
