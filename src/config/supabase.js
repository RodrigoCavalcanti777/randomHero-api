// src/config/supabase.js
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SECRET_KEY } from './env.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);