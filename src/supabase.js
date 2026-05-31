import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://doswzyuumcwxjmltcgeh.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvc3d6eXV1bWN3eGptbHRjZ2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NTMwNzUsImV4cCI6MjA5NTEyOTA3NX0.y0CUPEoH7QZl0VbBBiugoHb2qHwx7m1olXM3GDlrPCc";

export const supabase =
  createClient(
    supabaseUrl,
    supabaseAnonKey
  );