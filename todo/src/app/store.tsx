import { create } from 'zustand';

interface TodoData {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: TodoData[];
  input: string;
  setInput: (input: string) => void;
  addTodo: () => void;
  onDeleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
}

export const useTodoStore = create<TodoState>((set: any) => ({
  todos: [],
  input: '',
  setInput: (input: any) => set({ input }),
  addTodo: () => set((state: any) => {
    const newTodo: TodoData = {
      id: Date.now().toString(),
      text: state.input,
      completed: false,
    };
    localStorage.setItem(newTodo.id, JSON.stringify(newTodo));
    return { todos: [...state.todos, newTodo], input: '' };
  }),
  onDeleteTodo: (id: any) => set((state: any) => {
    const newDelTodo = state.todos.filter((todo: any) => todo.id !== id);
    localStorage.removeItem(id);
    return { todos: newDelTodo }
  }),
  toggleTodo: (id: any) =>
    set((state: any) => ({
      todos: state.todos.map((todo: any) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    })),
  editTodo: (id: any, text: string) => set((state: any) => ({
    todos: state.todos.map((todo: any) => todo.id === id ? { ...todo, text: text } : todo)
  }))
}));