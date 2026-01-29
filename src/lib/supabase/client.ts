import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Return a mock client for build time / missing config
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithOAuth: async () => ({ data: null, error: null }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({
          order: () => ({ data: null, error: null }),
          eq: () => ({
            single: () => ({ data: null, error: null }),
          }),
        }),
      }),
      rpc: async () => ({ data: null, error: null }),
    } as unknown as ReturnType<typeof createBrowserClient>;
  }

  if (!client) {
    client = createBrowserClient(url, key);
  }

  return client;
}
