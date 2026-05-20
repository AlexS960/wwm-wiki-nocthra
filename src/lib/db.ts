export interface DbAccount {
  id: string;
  username: string;
  role: string;
  picture?: string;
  game_nickname?: string;
  password_hash: string;
  created_at: string;
}

const DB_ACCOUNTS_KEY = 'wwm_db_accounts';
const DB_SITE_DATA_KEY = 'wwm_site_data';
const DB_PROGRESS_KEY = 'wwm_progress_data';
const DB_ONLINE_KEY = 'wwm_online_statuses';

// ---- Accounts ----
function getAccounts(): DbAccount[] {
  try {
    const raw = localStorage.getItem(DB_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveAccounts(accounts: DbAccount[]) {
  localStorage.setItem(DB_ACCOUNTS_KEY, JSON.stringify(accounts));
  sessionStorage.setItem(DB_ACCOUNTS_KEY, JSON.stringify(accounts));
}

export async function dbInit(): Promise<void> {
  // Ensure defaults exist
  const accts = getAccounts();
  if (!accts.find(a => a.username === 'admin')) {
    accts.push({ id: 'admin_root', username: 'admin', password_hash: 'admin', role: 'admin', picture: '', game_nickname: 'AdminNight', created_at: new Date().toLocaleDateString('ru-RU') });
  }
  if (!accts.find(a => a.username === 'editor')) {
    accts.push({ id: 'editor_1', username: 'editor', password_hash: 'editor', role: 'editor', picture: '', game_nickname: 'InkScribe', created_at: new Date().toLocaleDateString('ru-RU') });
  }
  if (!accts.find(a => a.username === 'user')) {
    accts.push({ id: 'user_1', username: 'user', password_hash: 'user', role: 'user', picture: '', game_nickname: 'FoxBlade', created_at: new Date().toLocaleDateString('ru-RU') });
  }
  saveAccounts(accts);
}

export async function dbGetAccountByUsername(username: string): Promise<DbAccount | null> {
  const accounts = getAccounts();
  return accounts.find(a => a.username.toLowerCase() === username.toLowerCase()) || null;
}

export async function dbCreateAccount(username: string, password: string, gameNickname: string): Promise<DbAccount | { error: string }> {
  const accounts = getAccounts();
  if (accounts.find(a => a.username.toLowerCase() === username.toLowerCase())) {
    return { error: 'Пользователь уже существует' };
  }
  const account: DbAccount = {
    id: 'user_' + crypto.randomUUID().slice(0, 8),
    username,
    password_hash: password,
    role: 'user',
    picture: '',
    game_nickname: gameNickname,
    created_at: new Date().toLocaleDateString('ru-RU'),
  };
  accounts.push(account);
  saveAccounts(accounts);
  return account;
}

export async function dbUpdateAccount(id: string, updates: Partial<DbAccount>): Promise<void> {
  const accounts = getAccounts();
  const idx = accounts.findIndex(a => a.id === id);
  if (idx >= 0) {
    accounts[idx] = { ...accounts[idx], ...updates };
    saveAccounts(accounts);
  }
}

export async function dbDeleteAccount(id: string): Promise<void> {
  const accounts = getAccounts();
  saveAccounts(accounts.filter(a => a.id !== id));
}

export async function dbListAccounts(): Promise<DbAccount[]> {
  return getAccounts();
}

// ---- Site Data ----
function loadAllSiteData(): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(DB_SITE_DATA_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function saveAllSiteData(data: Record<string, unknown>) {
  localStorage.setItem(DB_SITE_DATA_KEY, JSON.stringify(data));
  sessionStorage.setItem(DB_SITE_DATA_KEY, JSON.stringify(data));
}

export async function dbLoadSiteData<T>(key: string, fallback?: T): Promise<T> {
  const all = loadAllSiteData();
  return (all[key] as T) ?? (fallback as T);
}

export async function dbSaveSiteData(key: string, value: unknown): Promise<void> {
  const all = loadAllSiteData();
  all[key] = value;
  saveAllSiteData(all);
}

// ---- Progress ----
function loadProgress(): Record<string, Record<string, unknown>> {
  try {
    const raw = localStorage.getItem(DB_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function saveProgressData(data: Record<string, Record<string, unknown>>) {
  localStorage.setItem(DB_PROGRESS_KEY, JSON.stringify(data));
}

export async function dbLoadProgress(userId: string): Promise<Record<string, unknown> | null> {
  const all = loadProgress();
  return all[userId] || null;
}

export async function dbSaveProgress(userId: string, progress: Record<string, unknown>): Promise<void> {
  const all = loadProgress();
  all[userId] = progress;
  saveProgressData(all);
}

// ---- Online Statuses ----
function loadOnline(): Record<string, number> {
  try {
    const raw = localStorage.getItem(DB_ONLINE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function saveOnline(data: Record<string, number>) {
  localStorage.setItem(DB_ONLINE_KEY, JSON.stringify(data));
}

export async function dbSetOnline(userId: string): Promise<void> {
  const all = loadOnline();
  all[userId] = Date.now();
  saveOnline(all);
}

export async function dbGetOnlineStatuses(): Promise<Record<string, number>> {
  return loadOnline();
}
