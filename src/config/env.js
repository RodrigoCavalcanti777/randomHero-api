// src/config/env.js
import dotenv from 'dotenv';

dotenv.config();

export const PORT = parseInt(process.env.PORT, 10) || 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error('Variáveis de ambiente SUPABASE_URL e SUPABASE_SECRET_KEY devem ser definidas');
}

export const SUPABASE_URL = supabaseUrl;
export const SUPABASE_SECRET_KEY = supabaseSecretKey;