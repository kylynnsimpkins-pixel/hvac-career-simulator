import type { SaveProfile } from "@/types/saveProfile";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const cloudEnabled = Boolean(URL && KEY && !URL.includes("your-project"));

const headers = () => ({
  apikey: KEY as string,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
});

/** Upserts the whole profile as JSON into the cloud_saves table (PostgREST). */
export async function pushToCloud(p: SaveProfile): Promise<boolean> {
  if (!cloudEnabled) return false;
  const res = await fetch(`${URL}/rest/v1/cloud_saves?on_conflict=player_name`, {
    method: "POST",
    headers: { ...headers(), Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({ player_name: p.playerName.toLowerCase(), data: p, updated_at: new Date().toISOString() }),
  });
  return res.ok;
}

export async function pullFromCloud(playerName: string): Promise<SaveProfile | null> {
  if (!cloudEnabled) return null;
  const res = await fetch(
    `${URL}/rest/v1/cloud_saves?player_name=eq.${encodeURIComponent(playerName.toLowerCase())}&select=data`,
    { headers: headers() },
  );
  if (!res.ok) return null;
  const rows = (await res.json()) as { data: SaveProfile }[];
  return rows[0]?.data ?? null;
}
