require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const posts = [];
let currentId = 1;

app.get('/v1/posts', (req, res) => {
  res.json(posts);
});

// 获得与id相匹配的post
app.get('/v1/posts/:id', (req, res) => {
  // 获取id
  const { id } = req.params;

  // 在posts数组找对应的post
  const post = posts.find(i => {
    return i.id === Number(id);
  });

  // 处理post找不到的情况
  if (!post) {
    return res.sendStatus(404);
  }

  return res.json(post);
});

// 更新某个post
app.put('/v1/posts/:id', (req, res) => {
  // 获取id
  const { id } = req.params;
  // 获取post内容
  const { author, content } = req.body;

  // 找出这个post
  const post = posts.find(i => i.id === Number(id));

  // 处理post找不到
  if (!post) {
    return res.sendStatus(404);
  }
  // 取代之前的
  post.author = author;
  post.content = content;

  // 返回更新完的
  return res.json(post);
});

// 向数组里添加一个新的post
app.post('/v1/posts', (req, res) => {
  // 获得post请求里的内容，从body里面获取
  const { author, content } = req.body;

  // 赋予ID
  const newPost = { author, content, id: currentId++ };

  // 添加到posts里
  posts.push(newPost);

  // 返回添加的内容
  return res.json(newPost);
});

// 删除某个特定的post
app.delete('/v1/posts/:id', (req, res) => {
  // 获取id
  const { id } = req.params;

  // 通过id找到某个post的index
  const postIndex = posts.findIndex(i => i.id === Number(id));

  // 如果post找不到
  if (postIndex === -1) {
    return res.sendStatus(404);
  }

  // 把这个post删除
  const deletedPost = posts.splice(postIndex, 1);

  // 返回200
  return res.json(deletedPost);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server listening on port: ${PORT}`);
});
