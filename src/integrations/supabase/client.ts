import { createClient } from '@supabase/supabase-js';

// Hard‑coded credentials (provided in the project description)
const SUPABASE_URL = "https://nhcslyqhkcujmqrnqswm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oY3NseXFoa2N1am1xcm5xc3dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwODM1MDYsImV4cCI6MjA5MjY1OTUwNn0.iS-qF5bdb2IyzZZmWoxWTP2DLy4wC_LlZRTAAtO98SE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);