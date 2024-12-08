import { create } from "zustand";

interface Todo {
  id: string;
  text: string;
  description: string;
  completed: boolean;
}

interface TodoStore {
  todos: { [key: string]: Todo[] };
  input: string;
  description: string;
  selectedDay: string | null; 
  setInput: (input: string) => void;
  setDescription: (description: string) => void;
  setSelectedDay: (day: string) => void; 
  addTodo: () => void;
  onDeleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  editTodo: (id: string, newText: string, newDescription: string) => void;
}

export const useTodoStore = create<TodoStore>((set: any) => ({
  todos: {},
  input: "",
  description: "",
  selectedDay: null,
  setInput: (input: any) => set({ input }),
  setDescription: (description: any) => set({ description }),
  setSelectedDay: (day: any) => set({ selectedDay: day }), 
  addTodo: () => {
    set((state: any) => {
      if (!state.selectedDay) return {}; 
      const newTodo = {
        id: Date.now().toString(),
        text: state.input,
        description: state.description,
        completed: false,
      };
      const updatedTodos = {
        ...state.todos,
        [state.selectedDay]: [
          ...(state.todos[state.selectedDay] || []),
          newTodo
        ]
      };
      return { todos: updatedTodos, input: "", description: "" };
    });
  },
  onDeleteTodo: (id: any) => {
    set((state: any) => {
      const updatedTodos = { ...state.todos };
      updatedTodos[state.selectedDay || ""] = updatedTodos[state.selectedDay || ""].filter(
        (todo: any) => todo.id !== id
      );
      return { todos: updatedTodos };
    });
  },
  toggleTodo: (id: any) => {
    set((state: any) => {
      const updatedTodos = { ...state.todos };
      updatedTodos[state.selectedDay || ""] = updatedTodos[state.selectedDay || ""].map((todo: any) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      return { todos: updatedTodos };
    });
  },
  editTodo: (id: any, newText: any, newDescription: any) => {
    set((state: any) => {
      const updatedTodos = { ...state.todos };
      updatedTodos[state.selectedDay || ""] = updatedTodos[state.selectedDay || ""].map((todo: any) =>
        todo.id === id ? { ...todo, text: newText, description: newDescription } : todo
      );
      return { todos: updatedTodos };
    });
  },
}));
