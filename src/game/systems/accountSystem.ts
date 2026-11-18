const ACCOUNTS_KEY = "hvac-accounts";

export interface StudentAccount {
  username: string;
  salt: string;
  hash: string;
  createdAt: string;
}

type AccountDb = Record<string, StudentAccount>;

const norm = (u: string) => u.trim().toLowerCase();

function readDb(): AccountDb {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? "{}") as AccountDb;
  } catch {
    return {};
  }
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function hasAccount(username: string): boolean {
  return !!readDb()[norm(username)];
}

export function listAccounts(): StudentAccount[] {
  return Object.values(readDb()).sort((a, b) => a.username.localeCompare(b.username));
}

export async function registerAccount(username: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const name = username.trim();
  if (name.length < 2) return { ok: false, error: "Username must be at least 2 characters" };
  if (password.length < 4) return { ok: false, error: "Password must be at least 4 characters" };
  const db = readDb();
  if (db[norm(name)]) return { ok: false, error: "That username is already taken" };
  const salt = crypto.randomUUID();
  db[norm(name)] = { username: name, salt, hash: await sha256(salt + password), createdAt: new Date().toISOString() };
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(db));
  return { ok: true };
}

export async function verifyLogin(username: string, password: string): Promise<boolean> {
  const acct = readDb()[norm(username)];
  if (!acct) return false;
  return (await sha256(acct.salt + password)) === acct.hash;
}

export function deleteAccount(username: string): void {
  const db = readDb();
  delete db[norm(username)];
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(db));
}
