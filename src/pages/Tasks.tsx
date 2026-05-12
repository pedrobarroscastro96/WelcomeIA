import { useState } from "react";
import { Edit2, CheckCircle, Circle, Trash2 } from "lucide-react";
import { useTasks, Task } from "@/hooks/use-tasks";

const Tasks = () => {
  const { tasks, loading, error, addTask, updateTask, deleteTask } = useTasks();
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleAddTask = async () => {
    if (newTask.trim()) {
      try {
        await addTask(newTask.trim());
        setNewTask("");
      } catch (err) {
        console.error("Erro ao adicionar tarefa:", err);
      }
    }
  };

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.titulo);
  };

  const saveEdit = async () => {
    if (editTitle.trim() && editingTaskId) {
      try {
        await updateTask(editingTaskId, { titulo: editTitle.trim() });
        setEditingTaskId(null);
        setEditTitle("");
      } catch (err) {
        console.error("Erro ao atualizar tarefa:", err);
      }
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle("");
  };

  const toggleTaskStatus = async (task: Task) => {
    try {
      const newStatus = task.status === "pendente" ? "concluída" : "pendente";
      const data_conclusao = newStatus === "concluída" ? new Date().toISOString() : null;
      await updateTask(task.id, { status: newStatus, data_conclusao });
    } catch (err) {
      console.error("Erro ao atualizar status da tarefa:", err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
    } catch (err) {
      console.error("Erro ao deletar tarefa:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando tarefas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Erro: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Minhas Tarefas</h1>

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

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhuma tarefa adicionada</p>
          ) : (
            tasks.map((task) => {
              if (editingTaskId === task.id) {
                return (
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
                        onKeyPress={(e) => e.key === "Enter" && saveEdit()}
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
                );
              }

              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 border border-gray-200 rounded-md ${
                    task.status === "concluída" ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <button onClick={() => toggleTaskStatus(task)} className="flex-shrink-0">
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
                      <div className="flex flex-col gap-1 mt-1">
                        <span className="block text-xs text-gray-500">
                          Criada: {new Date(task.data_criacao).toLocaleDateString("pt-BR")}
                        </span>
                        {task.data_conclusao && (
                          <span className="block text-xs text-green-600">
                            Concluída: {new Date(task.data_conclusao).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                        <span
                          className={`block text-xs font-medium ${
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
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;