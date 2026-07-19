import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  supabasePublishableKey,
  supabaseUrl,
} from "@/lib/supabaseConfig";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // O proxy renova a sessao quando Server Components nao podem gravar cookies.
        }
      },
    },
  });
}
