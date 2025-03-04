import { Hono } from 'hono';
import { cors } from 'hono/cors'
import { prisma } from './lib/db.js';
import { serve } from '@hono/node-server';
const app = new Hono();

// Add CORS middleware
app.use('/*', cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  exposeHeaders: ['Content-Length', 'X-Requested-With'],
  credentials: true,
}));

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/todos', async (c) => {
  const todos = await prisma.todo.findMany();
  return c.json(todos);
});

app.post('/todos', async (c) => {
  const { title, category } = await c.req.json();
  const todo = await prisma.todo.create({
    data: { title, category: { connect: { id: category } } },
  });
  return c.json(todo);
});

app.get('/categories', async (c) => {
  const categories = await prisma.category.findMany();
  return c.json(categories);
});

app.post('/categories', async (c) => {
  const { name } = await c.req.json();
  const category = await prisma.category.create({ data: { name } });
  return c.json(category);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
