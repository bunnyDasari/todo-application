"use client";
import React, { useState, useEffect } from "react";
import { useTodoStore } from "./store";
import { FC } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid"; 

const TodoList: FC = () => {
  const {
    todos,
    input,
    description,
    setInput,
    setDescription,
    addTodo,
    onDeleteTodo,
    toggleTodo,
    editTodo,
    setSelectedDay,
    selectedDay, 
  } = useTodoStore();

  const [showInput, setShowInput] = useState(false);
  const [weekDates, setWeekDates] = useState<Date[]>([]);

  useEffect(() => {
    const today = new Date();
    const currentDay = today.getDay(); 
    const startOfWeek = new Date(today); 
    startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1)); 
    const week = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i); 
      return date;
    });
    setWeekDates(week);
  }, []);

  const handleEditTodo = (id: string) => {
    const newText = prompt("Edit your Task:");
    const newDescription = prompt("Edit your Description:");
    if (newText !== null && newText.trim() !== "" && newDescription !== null) {
      editTodo(id, newText, newDescription);
    }
  };

  const handleAddTodo = () => {
    if (selectedDay) {
      setShowInput(true);
    } else {
      alert("Please select a day before adding a task.");
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() !== "" && selectedDay && description.trim() !== "") {
      addTodo();
      setShowInput(false);
    }
  };

  const handleDayClick = (day: string) => {
    setSelectedDay(day); 
  };

  const tasksForSelectedDay = selectedDay ? todos[selectedDay] || [] : [];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between text-center text-sm font-medium mb-6">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
          const date = weekDates[index];
          const formattedDate = date
            ? date.toLocaleDateString("en-US", { day: "2-digit" })
            : ""; 
          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={`flex flex-col items-center justify-center p-2 w-12 h-12 rounded-lg cursor-pointer transition-transform duration-300 ${selectedDay === day
                ? "bg-black text-white scale-110"
                : "text-gray-700 hover:scale-105 hover:bg-gray-200"
                }`}
            >
              <span className="animate-fadeIn">{day}</span>
              <span className="text-lg font-semibold">{formattedDate}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Tasks", value: tasksForSelectedDay.length },
          { label: "Completed", value: tasksForSelectedDay.filter(t => t.completed).length },
          { label: "Progress", value: `${Math.round((tasksForSelectedDay.filter(t => t.completed).length / tasksForSelectedDay.length || 0) * 100)}%` }
        ].map((card, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-xl font-bold mt-2 text-black font-bold">{card.value}</p>
            <p className="text-gray-500 text-sm text-black font-bold">{card.label}</p>
          </div>
        ))}
      </div>

      
      <h1 className="text-xl font-bold mb-4 text-black">
        {selectedDay ? `Tasks for ${selectedDay}` : "Select a Day"}
      </h1>

      {tasksForSelectedDay.length > 0 ? (
        <div className="space-y-4">
          {tasksForSelectedDay.map((todo) => (
            <div key={todo.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl shadow-sm">
              <div className="flex items-start gap-3">
                <div
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 border-2 rounded-full flex items-center justify-center cursor-pointer ${todo.completed ? "bg-black" : "bg-white border-gray-400"
                    }`}
                >
                  {todo.completed && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`font-medium ${todo.completed ? "text-gray-400 line-through" : "text-gray-800"} font-serif font-semibold`}>
                    {todo.text}
                  </p>
                  {todo.description && <p className="text-sm text-gray-500 custom-font font-serif font-semibold">{todo.description}</p>} 
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEditTodo(todo.id)} className="text-blue-500 text-sm font-medium">
                  <PencilSquareIcon className="w-5 h-5 text-blue-500" />
                </button>
                <button onClick={() => onDeleteTodo(todo.id)} className="text-red-500 text-sm font-medium">
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mb-16">
          <p>No tasks for this day</p>
          <p className="text-sm">Click the + button to add a new task</p>
        </div>
      )}
      {showInput && (
        <form onSubmit={handleInputSubmit} className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-sm p-4 bg-white rounded-lg shadow-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-2 text-black"
            placeholder="Enter your task..."
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-2 text-black"
            placeholder="Enter task description..."
            rows={3}
          />
          <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800">
            Add Task
          </button>
        </form>
      )}
      <button onClick={handleAddTodo} className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-gray-800">
        +
      </button>
    </div>
  );
};

export default TodoList;
