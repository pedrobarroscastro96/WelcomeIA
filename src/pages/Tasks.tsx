import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Save, X } from "lucide-react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string; // ISO date string (YYYY-MM-DD)
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newDate, setNewDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  const addTask = () => {
    if (newTask.trim() && newDate) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.trim(),
        completed: false,
        date: newDate,
      };
      setTasks([...tasks, task]);
      setNewTask("");
      setNewDate("");
    }
  };

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDate(task.date);
  };

  const saveEdit = () => {
    if (editTitle.trim() && editDate) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId
            ? { ...task, title: editTitle.trim(), date: editDate }
            : task
        )
      );
      setEditingTaskId(null);
      setEditTitle("");
      setEditDate("");
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle("");
    setEditDate("");
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Minhas Tarefas</h1>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Sair
          </button>
        </div>

        <div className="flex mb-6 space-x-3">
          <input            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Adicionar nova tarefa..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
          />
          <button            onClick={addTask}
            className="px-4 py-2 bg-yellow-400 text-white font-medium rounded-r-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
          >
            Adicionar
          </button>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhuma tarefa adicionada</p>
          ) : (
            tasks.map((task) => (
              editingTaskId === task.id ? (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Tarefa..."
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={saveEdit}
                      className="px-3 py-2 bg-yellow-400 text-white font-medium rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-2 text-gray-500 hover:text-gray-700"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 border border-gray-200 rounded-md ${
                    task.completed ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="h-5 w-5 text-yellow-400 rounded focus:ring-yellow-400"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="block text-gray-800 ${
                        task.completed ? "line-through text-gray-500" : ""
                      }">
                        {task.title}
                      </span>
                      <span className="block text-xs text-gray-500 mt-1">
                        {task.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button                      onClick={() => startEdit(task)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;