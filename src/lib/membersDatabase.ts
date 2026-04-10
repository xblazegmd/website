import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../supabase.ts";

import { SUPABASE_URL, SUPABASE_KEY } from "$env/static/private";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);