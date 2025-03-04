import React, { useEffect } from 'react';

import type { Route } from './+types/home';
import { useState } from 'react';

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

type Category = {
  id: string;
  name: string;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

const fetchTodos = async () => {
  const response = await fetch('http://localhost:3000/todos');
  const data = await response.json();
  return data;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  
  useEffect(() => {
    fetchTodos().then(setTodos);
  }, []);

  useEffect(() => {
    fetchCategories().then((categories) => {
      console.log(categories);
      setCategories(categories);
    });
  }, []);

  const fetchCategories = async () => {
    const response = await fetch('http://localhost:3000/categories');
    const data = await response.json();
    return data;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    fetch('http://localhost:3000/todos', {
      method: 'POST',
      body: JSON.stringify({ title, category }),
    });

    fetchTodos().then(setTodos);
  };

  const handleSubmitCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const category = formData.get('category') as string;
    fetch('http://localhost:3000/categories', {
      method: 'POST',
      body: JSON.stringify({ name: category }),
    });

    fetchCategories().then(setCategories);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Home</h1>
      {todos.length > 0 ? (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      ) : (
        <p className="text-2xl font-bold bg-white text-black rounded px-2">
          No todos found
        </p>
      )}

      <form onSubmit={handleSubmitCategory}>
        <input
          type="text"
          name="category"
          className="rounded px-2 bg-white text-black"
          placeholder="Add a category"
        />
        <button type="submit" className="rounded px-2 bg-white text-black">
          Add category
        </button>
      </form>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 items-center justify-center "
      >
        <input
          type="text"
          name="title"
          className="rounded px-2 bg-white text-black"
          placeholder="Add a todo"
        />
        <select name="category" className="rounded px-2 bg-white text-black">
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded px-2 bg-white text-black">
          Add Todo
        </button>
      </form>
    </div>
  );
}
