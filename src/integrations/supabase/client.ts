"use client";

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hogwxlsanyklbjtdjndw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZ3d4bHNhbnlrbGJqdGRqbmR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMzIxNzUsImV4cCI6MjA4MDcwODE3NX0.wqr5HjGBl2f6U3DSxt4tUriWe7C2YNJDHvXRib7ow7I";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
＜/dyad-write>

<dyad-write path="src/pages/Tasks.tsx" description="Atualizando o componente Tasks para usar o Supabase para gerenciar tarefas.">
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

interface Task {
  id: string;
  titulo: string;
  data_criacao: string;
  status: string;
  data_conclusao: string | null;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newDate, setNewDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tarefas")
        .select("*")
        .order("data_criacao", { ascending: false });

      if (error) {
        showError("Erro ao buscar tarefas: " + error.message);
        return;
      }

      setTasks(data || []);
    } catch (error) {
      showError("Erro ao buscar tarefas: " + error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() && newDate) {
      try {
        const { data, error } = await supabase
          .from("tarefas")
          .insert([
            {
              titulo: newTask.trim(),
              data_criacao: newDate,
              status: "pendente",
            },
          ])
          .select();

        if (error) {
          showError("Erro ao adicionar tarefa: " + error.message);
          return;
        }

        setTasks([...tasks, data[0]]);
        setNewTask("");
        setNewDate("");
        showSuccess("Tarefa adicionada com sucesso!");
      } catch (error) {
        showError("Erro ao adicionar tarefa: " + error);
      }
    }
  };

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.titulo);
    setEditStatus(task.status);
  };

  const saveEdit = async () => {
    if (editTitle.trim() && editStatus) {
      try {
        const { error } = await supabase
          .from("tarefas")
          .update({
            titulo: editTitle.trim(),
            status: editStatus,
          })
          .eq("id", editingTaskId!);

        if (error) {
          showError("Erro ao salvar tarefa: " + error.message);
          return;
        }

        setTasks(
          tasks.map((task) =>
            task.id === editingTaskId
              ? { ...task, titulo: editTitle.trim(), status: editStatus }
              : task
          )
        );
        setEditingTaskId(null);
        setEditTitle("");
        setEditStatus("");
        showSuccess("Tarefa atualizada com sucesso!");
      } catch (error) {
        showError("Erro ao salvar tarefa: " + error);
      }
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle("");
    setEditStatus("");
  };

  const toggleTask = async (id: string) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const { error } = await supabase
        .from("tarefas")
        .update({
          status: task.status === "pendente" ? "concluída" : "pendente",
          data_conclusao: task.status === "pendente" ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (error) {
        showError("Erro ao atualizar status: " + error.message);
        return;
      }

      setTasks(
        tasks.map((t) =>
          t.id === id ? { ...t, status: task.status === "pendente" ? "concluída" : "pendente", data_conclusao: task.status === "pendente" ? new Date().toISOString() : null } : t
        )
      );
    } catch (error) {
      showError("Erro ao atualizar status: " + error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from("tarefas").delete().eq("id", id);

      if (error) {
        showError("Erro ao excluir tarefa: " + error.message);
        return;
      }

      setTasks(tasks.filter((task) => task.id !== id));
      showSuccess("Tarefa excluída com sucesso!");
    } catch (error) {
      showError("Erro ao excluir tarefa: " + error);
    }
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
          <input
            type="text"
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
          <button
            onClick={addTask}
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
                      />
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      >
                        <option value="pendente">Pendente</option>
                        <option value="concluída">Concluída</option>
                      </select>
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
                )
              }
              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 border border-gray-200 rounded-md ${
                    task.status === "concluída" ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={task.status === "concluída"}
                      onChange={() => toggleTask(task.id)}
                      className="h-5 w-5 text-yellow-400 rounded focus:ring-yellow-400"
                    />
                    <div className="flex-1 min-w-0">
                      <span
                        className={`block text-gray-800 ${
                          task.status === "concluída" ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {task.titulo}
                      </span>
                      <span className="block text-xs text-gray-500 mt-1">
                        {task.data_criacao}
                      </span>
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
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
＜/dyad-write>

<dyad-chat-summary>Adicionei o Supabase ao projeto, criei o cliente e atualizei o componente Tasks para usar o banco de dados. Agora as tarefas são persistidas no Supabase.</dyad-chat-summary></think><dyad-execute-sql>
CREATE TABLE public.tarefas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  data_criacao timestamp with time zone DEFAULT now(),
  status text NOT NULL DEFAULT 'pendente',
  data_conclusao timestamp with time zone
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "tarefas_select_policy" ON public.tarefas
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "tarefas_insert_policy" ON public.tarefas  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "tarefas_update_policy" ON public.tarefas
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "tarefas_delete_policy" ON public.tarefas
  FOR DELETE TO authenticated  USING (true);
</dyad-execute-sql>

<dyad-chat-summary>Created the `tarefas` table in Supabase with the requested columns and set up Row Level Security policies for authenticated users.</dyad-chat-summary>Vou continuar integrando a tabela `tarefas` do Supabase com a aplicação. Vou atualizar o componente Tasks.tsx para usar o Supabase como backend.

Primeiro, vou criar o cliente do Supabase e um hook customizado para tarefas:
<tool_call>write path="src/integrations/supabase/client.ts" description="Criando o cliente Supabase.">
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hogwxlsanyklbjtdjndw.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZ3d4bHNhbnlrbGJqdGRqbmR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMzIxNzUsImV4cCI6MjA4MDcwODE3NX0.wqr5HjGBl2f6U3DSxt4tUriWe7C2YNJDHvXRib7ow7I"

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)