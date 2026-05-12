import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit2, Save, X } from "lucide-react"
import { useTarefas } from "@/hooks/useTarefas"
import { showSuccess, showError } from "@/utils/toast"

const Tasks = () => {
  const [newTask, setNewTask] = useState("")
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const navigate = useNavigate()

  const { tarefas, loading, error, addTarefa, updateTarefa, deleteTarefa, toggleTarefa } = useTarefas()

  const handleAddTask = async () => {
    if (!newTask.trim()) return

    try {
      await addTarefa(newTask.trim())
      setNewTask("")
      showSuccess("Tarefa adicionada com sucesso!")
    } catch (err: any) {
      showError("Erro ao adicionar tarefa: " + err.message)
    }
  }

  const handleStartEdit = (task: any) => {
    setEditingTaskId(task.id)
    setEditTitle(task.titulo)
  }

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editingTaskId) return

    try {
      await updateTarefa(editingTaskId, { titulo: editTitle.trim() })
      setEditingTaskId(null)
      setEditTitle("")
      showSuccess("Tarefa atualizada com sucesso!")
    } catch (err: any) {
      showError("Erro ao atualizar tarefa: " + err.message)
    }
  }

  const handleCancelEdit = () => {
    setEditingTaskId(null)
    setEditTitle("")
  }

  const handleToggleTask = async (id: string, currentStatus: string) => {
    try {
      await toggleTarefa(id, currentStatus)
      showSuccess("Tarefa atualizada com sucesso!")
    } catch (err: any) {
      showError("Erro ao atualizar tarefa: " + err.message)
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTarefa(id)
      showSuccess("Tarefa excluída com sucesso!")
    } catch (err: any) {
      showError("Erro ao excluir tarefa: " + err.message)
    }
  }

  const logout = () => {
    localStorage.removeItem("isLoggedIn")
    navigate("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Carregando tarefas...</div>
      </div>
    )
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
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            Erro: {error}
          </div>
        )}

        <div className="flex mb-6 space-x-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            placeholder="Adicionar nova tarefa..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
          />
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-yellow-400 text-white font-medium rounded-r-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
          >
            Adicionar
          </button>
        </div>

        <div className="space-y-3">
          {tarefas.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhuma tarefa adicionada</p>
          ) : (
            tarefas.map((task) => (
              <div key={task.id}>
                {editingTaskId === task.id ? (
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                    <div className="flex items-center space-x-3 flex-1">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Tarefa..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center space-x-2 ml-3">
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-2 bg-yellow-400 text-white font-medium rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-2 text-gray-500 hover:text-gray-700"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`flex items-center justify-between p-4 border border-gray-200 rounded-md ${
                      task.status === "concluida" ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={task.status === "concluida"}
                        onChange={() => handleToggleTask(task.id, task.status)}
                        className="h-5 w-5 text-yellow-400 rounded focus:ring-yellow-400"
                      />
                      <div className="flex-1 min-w-0">
                        <span
                          className={`block text-gray-800 ${
                            task.status === "concluida" ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {task.titulo}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>Criada: {new Date(task.data_criacao).toLocaleDateString("pt-BR")}</span>
                          {task.data_conclusao && (
                            <span>
                              Concluída: {new Date(task.data_conclusao).toLocaleDateString("pt-BR")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleStartEdit(task)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
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
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Tasks