import type { Route } from './+types/home';
import { useEffect } from 'react';
import { useState } from "react";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
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

  useEffect(() => {
    fetchTodos().then(setTodos);
  }, []);

  return (
    <div>
      <h1>Home</h1>
      {
        todos.length > 0 ? (
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>{todo.title}</li>
            ))}
          </ul>
        ) : (
          <p>No todos found</p>
        )
      }
    </div>
  );
}
