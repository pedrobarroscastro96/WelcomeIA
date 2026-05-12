-- Criar tabela tarefas
CREATE TABLE public.tarefas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pendente',
  data_conclusao TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS (Row Level Security) para segurança
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso
-- Permitir que usuários vejam suas próprias tarefas
CREATE POLICY "Users can view their own tasks" ON public.tarefas
  FOR SELECT USING (auth.uid() = user_id);

-- Permitir que usuários criem tarefas (apenas para si mesmos)
CREATE POLICY "Users can insert their own tasks" ON public.tarefas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Permitir que usuários atualizem suas próprias tarefas
CREATE POLICY "Users can update their own tasks" ON public.tarefas
  FOR UPDATE USING (auth.uid() = user_id);

-- Permitir que usuários excluam suas próprias tarefas
CREATE POLICY "Users can delete their own tasks" ON public.tarefas
  FOR DELETE USING (auth.uid() = user_id);