import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"

type Tarefa = Database["public"]["Tables"]["tarefas"]["Row"]
type NewTarefa = Database["public"]["Tables"]["tarefas"]["Insert"]

interface UseTarefasReturn {
  tarefas: Tarefa[]
  loading: boolean
  error: string | null
  addTarefa: (titulo: string) => Promise<void>
  updateTarefa: (id: string, updates: Partial<Tarefa>) => Promise<void>
  deleteTarefa: (id: string) => Promise<void>
  toggleTarefa: (id: string, currentStatus: string) => Promise<void>
}

export function useTarefas(): UseTarefasReturn {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTarefas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: err } = await supabase
        .from("tarefas")
        .select("*")
        .order("data_criacao", { ascending: false })

      if (err) {
        setError(err.message)
        return
      }

      setTarefas(data || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTarefas()

    // Inscrever-se em mudanças em tempo real
    const channel = supabase
      .channel("tarefas-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tarefas" },
        () => {
          fetchTarefas()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchTarefas])

  const addTarefa = async (titulo: string) => {
    const { error: err } = await supabase.from("tarefas").insert({
      titulo,
      status: "pendente",
    } as NewTarefa)

    if (err) throw err
  }

  const updateTarefa = async (id: string, updates: Partial<Tarefa>) => {
    const { error: err } = await supabase
      .from("tarefas")
      .update(updates)
      .eq("id", id)

    if (err) throw err
  }

  const deleteTarefa = async (id: string) => {
    const { error: err } = await supabase.from("tarefas").delete().eq("id", id)

    if (err) throw err
  }

  const toggleTarefa = async (id: string, currentStatus: string) => {
    const novoStatus = currentStatus === "concluida" ? "pendente" : "concluida"
    const updates: Partial<Tarefa> = {
      status: novoStatus,
      data_conclusao: novoStatus === "concluida" ? new Date().toISOString() : null,
    }

    const { error: err } = await supabase
      .from("tarefas")
      .update(updates)
      .eq("id", id)

    if (err) throw err
  }

  return {
    tarefas,
    loading,
    error,
    addTarefa,
    updateTarefa,
    deleteTarefa,
    toggleTarefa,
  }
}