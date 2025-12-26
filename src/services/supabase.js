import { createClient } from "@supabase/supabase-js";

// IMPORTANTE: Reemplaza estos valores con los de tu proyecto Supabase
const SUPABASE_URL = "https://izirwkulpwtdmuqwbzpl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6aXJ3a3VscHd0ZG11cXdienBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MDY1NjUsImV4cCI6MjA3NzA4MjU2NX0.DImAc2K1eFuE7fMs1nouuQnmIFdjMTYiEbRD5mQaPAs";
// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
