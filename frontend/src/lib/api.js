/**
 * GlobeX AI – Central API Client
 * Automatically injects the stored JWT token into every request.
 */

const BASE = 'https://globex-ai-2.onrender.com/api/v1';

function getToken() {
  return localStorage.getItem('globex_token');
}

function authHeaders() {
  const token = getToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

async function request(method, path, body = null, timeoutMs = 30000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  const opts = {
    method,
    headers: authHeaders(),
    signal: controller.signal
  };
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(`${BASE}${path}`, opts);
    clearTimeout(id);

    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      const msg = data?.message || data?.error || `Request failed: ${res.status}`;
      throw new Error(msg);
    }

    // Backend wraps responses in { success, data, message }
    return data?.data ?? data;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs / 1000} seconds`);
    }
    throw error;
  }
}

// ─── Auth ──────────────────────────────────────────────
export const authApi = {
  signup: (body) => request('POST', '/auth/signup', body),
  login: (body) => request('POST', '/auth/login', body),
  getProfile: () => request('GET', '/auth/profile'),
};

// ─── Dashboard ─────────────────────────────────────────
export const dashboardApi = {
  getSummary: () => request('GET', '/dashboard/'),
};

// ─── Buyers ────────────────────────────────────────────
export const buyersApi = {
  search: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/buyers/?${qs}`);
  },
  getById: (id) => request('GET', `/buyers/${id}`),
};

// ─── Market Intelligence ───────────────────────────────
export const marketApi = {
  getOpportunities: () => request('GET', '/market/opportunities'),
  analyze: (body) => request('POST', '/market/analyze', body),
};

// ─── Compliance ────────────────────────────────────────
export const complianceApi = {
  getByCountry: (country) => request('GET', `/compliance/${country}`),
  getAllCountries: () => request('GET', '/compliance/countries'),
};

// ─── Outreach ──────────────────────────────────────────
export const outreachApi = {
  getHistory: () => request('GET', '/outreach/history'),
  generate: (body) => request('POST', '/outreach/generate', body),
};

// ─── Leads ─────────────────────────────────────────────
export const leadsApi = {
  getAll: () => request('GET', '/leads/'),
};

// ─── Chat ──────────────────────────────────────────────
export const chatApi = {
  send: (message, session_id = null) =>
    request('POST', '/chat/', { message, session_id }),
};

// ─── Trade Data (Datasets) ──────────────────────────────
export const tradeDataApi = {
  getSimulationLogs: (agentType) => request('GET', `/tradedata/simulation-logs/${agentType}`),
  getStats: () => request('GET', '/tradedata/stats'),
  getTopDestinations: () => request('GET', '/tradedata/destinations'),
  getTradePartners: () => request('GET', '/tradedata/partners'),
  getMarketOpportunities: () => request('GET', '/tradedata/opportunities'),
};
