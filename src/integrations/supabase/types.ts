export interface Database {
  public: {
    Tables: {
      tarefas: {
        Row: {
          id: string
          titulo: string
          data_criacao: string
          status: string
          data_conclusao: string | null
        }
        Insert: {
          titulo: string
          status?: string
          data_conclusao?: string | null
        }
        Update: {
          titulo?: string
          status?: string
          data_conclusao?: string | null
        }
      }
    }
  }
}