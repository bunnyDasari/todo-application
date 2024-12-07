"use client";
import React from 'react';
import { useTodoStore } from './store';
import { FC } from "react"
const TodoList: FC = () => {
  const { todos, input, setInput, addTodo, onDeleteTodo, toggleTodo, editTodo } = useTodoStore();


  const handleEditTodo = (id: string) => {
    const newText = prompt('Edit your Task:');
    if (newText !== null && newText.trim() !== '') {
      editTodo(id, newText);
    }
  };
  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-lg mt-12">
      <h1 className="text-2xl font-semibold text-center text-blue-600 mb-6">
        Todo Application
      </h1>
      <div className="flex gap-3 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="Enter your task"
        />

        <button
          onClick={addTodo}
          className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Add
        </button>
      </div>
      {todos.length > 0 ? (
        <div className="space-y-4">
          {todos.map((todo: any) => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-5 h-5 accent-blue-500 "
                />
                <p
                  className={`${todo.completed
                    ? 'line-through text-black-50'
                    : 'text-gray-800'
                    } text-lg`}
                >
                  {todo.text}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEditTodo(todo.id)}
                  className="text-yellow-500 hover:text-yellow-600 focus:outline-none"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-600 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">No tasks available. Add a tasks for Today!!</p>
      )}
    </div>

  );
};

export default TodoList;