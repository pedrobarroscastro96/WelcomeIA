import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, CheckCircle, Circle, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  titulo: string;
  status: "pendente" | "concluída";
  data_criacao: string;
  data_conclusao?: string;
  user_id?: string;
}

// Simple client‑side UUID generator
const genId = () => crypto.randomUUID();

const Tasks = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks – fallback to local dummy data if Supabase fails
  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("tarefas")
          .select("*")
          .order("data_criacao", { ascending: false });

        if (error) throw error;
        setTasks(data as Task[]);
      } catch (err) {
        console.warn("[Tasks] Supabase load failed, using local fallback");
        setTasks([
          {
            id: genId(),
            titulo: "Tarefa de exemplo",
            status: "pendente",
            data_criacao: new Date().toISOString(),
          },
        ]);
        setError(
          "Não foi possível conectar ao Supabase – usando dados locais temporários.",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // CRUD helpers that update local state and try Supabase (ignore errors)
  const addTask = async (title: string) => {
    const temp: Task = {
      id: genId(),
      titulo: title,
      status: "pendente",
      data_criacao: new Date().toISOString(),
    };
    setTasks((prev) => [temp, ...prev]);

    try {
      const { data, error } = await supabase
        .from("tarefas")
        .insert([{ titulo: title, status: "pendente", user_id: null }])
        .select()
        .single();
      if (!error && data) {
        setTasks((prev) =>
          prev.map((t) => (t.id === temp.id ? (data as Task) : t)),
        );
      }
    } catch {
      // ignore – local copy already added
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
    try {
      await supabase.from("tarefas").update(updates).eq("id", id);
    } catch {
      // ignore
    }
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await supabase.from("tarefas").delete().eq("id", id);
    } catch {
      // ignore
    }
  };

  // UI actions
  const handleAddTask = async () => {
    if (newTask.trim()) {
      await addTask(newTask.trim());
      setNewTask("");
    }
  };

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.titulo);
  };

  const saveEdit = async () => {
    if (editingTaskId && editTitle.trim()) {
      await updateTask(editingTaskId, { titulo: editTitle.trim() });
      setEditingTaskId(null);
      setEditTitle("");
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle("");
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === "pendente" ? "concluída" : "pendente";
    const data_conclusao =
      newStatus === "concluída" ? new Date().toISOString() : null;
    await updateTask(task.id, { status: newStatus, data_conclusao });
  };

  const logout = () => {
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
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">{error}</p>
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
                  task.status === "concluída" ? "bg-gray-50" : ""
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
                        {task.status === "concluída" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <span
                          className={`block text-gray-800 ${
                            task.status === "concluída" ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {task.titulo}
                        </span>
                        <div className="mt-1 text-xs text-gray-500">
                          Criada: {new Date(task.data_criacao).toLocaleDateString("pt-BR")}
                          {task.data_conclusao && (
                            <span className="block text-green-600">
                              Concluída: {new Date(task.data_conclusao).toLocaleDateString("pt-BR")}
                            </span>
                          )}
                          <span
                            className={`block font-medium ${
                              task.status === "concluída" ? "text-green-600" : "text-yellow-600"
                            }`}
                          >
                            Status: {task.status}
                          </span>
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