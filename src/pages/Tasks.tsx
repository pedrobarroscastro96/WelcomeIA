import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, CheckCircle, Circle, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  title: string;
  status: "Todo" | "In Progress" | "Done";
  priority?: string;
  due_date?: string;
  category?: string;
  created_at: string;
  user_id: string;
}

// Simple client‑side UUID generator for temporary items
const genId = () => crypto.randomUUID();

const Tasks = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user id
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setError("Falha ao obter usuário autenticado.");
        return;
      }
      setUserId(data.user?.id ?? null);
    };
    fetchUser();
  }, []);

  // Load tasks for the logged‑in user
  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTasks(data as Task[]);
      } catch (err) {
        console.error("[Tasks] Supabase load error:", err);
        setError("Erro ao carregar tarefas do Supabase.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  // Add a new task
  const addTask = async (title: string) => {
    if (!userId) return;
    const temp: Task = {
      id: genId(),
      title,
      status: "Todo",
      created_at: new Date().toISOString(),
      user_id: userId,
    };
    setTasks((prev) => [temp, ...prev]);

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ title, status: "Todo", user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      setTasks((prev) =>
        prev.map((t) => (t.id === temp.id ? (data as Task) : t)),
      );
    } catch (err) {
      console.error("[Tasks] Add error:", err);
      setError("Falha ao criar tarefa no Supabase.");
    }
  };

  // Update task (title or status)
  const updateTask = async (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
    try {
      const { error } = await supabase.from("tasks").update(updates).eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error("[Tasks] Update error:", err);
      setError("Falha ao atualizar tarefa no Supabase.");
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error("[Tasks] Delete error:", err);
      setError("Falha ao remover tarefa no Supabase.");
    }
  };

  // UI handlers
  const handleAddTask = async () => {
    if (newTask.trim()) {
      await addTask(newTask.trim());
      setNewTask("");
    }
  };

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = async () => {
    if (editingTaskId && editTitle.trim()) {
      await updateTask(editingTaskId, { title: editTitle.trim() });
      setEditingTaskId(null);
      setEditTitle("");
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle("");
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === "Todo" ? "Done" : "Todo";
    await updateTask(task.id, { status: newStatus });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Carregando tarefas…</p>
      </div>
    );
  }

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

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Add new task */}
        <div className="flex mb-6 space-x-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Adicionar nova tarefa..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
          />
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-yellow-400 text-white font-medium rounded-r-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
          >
            Adicionar
          </button>
        </div>

        {/* Task list */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhuma tarefa</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-4 border border-gray-200 rounded-md ${
                  task.status === "Done" ? "bg-gray-50" : ""
                }`}
              >
                {editingTaskId === task.id ? (
                  <>
                    <div className="flex-1 flex items-center space-x-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 text-gray-600 hover:text-gray-800"
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <button onClick={() => toggleStatus(task)} className="flex-shrink-0">
                        {task.status === "Done" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <span
                          className={`block text-gray-800 ${
                            task.status === "Done" ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {task.title}
                        </span>
                        <div className="mt-1 text-xs text-gray-500">
                          Criada: {new Date(task.created_at).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEdit(task)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;