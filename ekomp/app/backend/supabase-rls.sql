-- Supabase SQL Editor'de çalıştırın. Backend `postgres` rolüyle bağlandığı için RLS'ten etkilenmez;
-- policy tanımlanmadığı için anon/authenticated (PostgREST) erişimi tamamen kapanır.
DO $$ DECLARE t text; BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;
