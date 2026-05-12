import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  titulo: string;
  status: string;
  data_criacao: string;
  data_conclusao?: string;
  user_id: string | null;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tarefas")
        .select("*")
        .order("data_criacao", { ascending: false });

      if (error) throw error;
      setTasks(data as Task[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar tarefas");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (titulo: string) => {
    try {
      const { data, error } = await supabase
        .from("tarefas")
        .insert([
          {
            titulo,
            status: "pendente",
            // sem login, deixamos user_id nulo (coluna aceita null)
            user_id: null,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setTasks((prev) => [data as Task, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar tarefa");
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from("tarefas")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setTasks((prev) => prev.map((t) => (t.id === id ? (data as Task) : t)));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar tarefa");
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from("tarefas").delete().eq("id", id);
      if (error) throw error;
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar tarefa");
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    fetchTasks,
  };
};