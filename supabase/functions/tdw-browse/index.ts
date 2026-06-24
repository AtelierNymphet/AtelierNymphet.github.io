type BrowseRequest = {
  query?: string;
  work_slug?: string | null;
  source_lane_slug?: string | null;
  limit?: number;
};

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers":
    "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "GET, POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
}

function env(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function requestPayload(req: Request): Promise<BrowseRequest> {
  const url = new URL(req.url);
  if (req.method === "GET") {
    return {
      query: url.searchParams.get("q") || url.searchParams.get("query") || "",
      work_slug: url.searchParams.get("work_slug"),
      source_lane_slug: url.searchParams.get("source_lane_slug"),
      limit: Number(url.searchParams.get("limit") || 20),
    };
  }
  return await req.json().catch(() => ({}));
}

async function requireAuthorizedEmail(authorization: string | null): Promise<string> {
  if (!authorization) throw new Error("missing_authorization");
  const supabaseUrl = env("SUPABASE_URL").replace(/\/$/, "");
  const anonKey = env("SUPABASE_ANON_KEY");
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      authorization,
    },
  });
  if (!response.ok) throw new Error("invalid_authorization");
  const user = await response.json();
  const email = String(user.email || "").toLowerCase();
  const allowlist = env("ATELIER_TDW_ADMIN_EMAILS")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  if (!email || !allowlist.includes(email)) {
    throw new Error("not_tdw_authorized");
  }
  return email;
}

function snippet(content: string, query: string, maxLength = 900): string {
  const compact = content.replace(/\s+/g, " ").trim();
  if (!query) return compact.slice(0, maxLength);
  const index = compact.toLowerCase().indexOf(query.toLowerCase());
  if (index < 0) return compact.slice(0, maxLength);
  const start = Math.max(0, index - Math.floor(maxLength / 3));
  return compact.slice(start, start + maxLength);
}

async function browse(payload: BrowseRequest) {
  const supabaseUrl = env("SUPABASE_URL").replace(/\/$/, "");
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");
  const limit = Math.min(Math.max(Number(payload.limit || 20), 1), 50);
  const select = [
    "canonical_ref",
    "work_id",
    "source_lane_slug",
    "section_title",
    "content",
    "tdw_start",
    "tdw_finish",
    "metadata",
    "rag_documents!inner(canonical_url,title)",
    "works!inner(slug,title)",
  ].join(",");
  const params = new URLSearchParams();
  params.set("select", select);
  params.set("delivery_mode", "eq.quote_api_only");
  params.set("order", "tdw_start.asc,canonical_ref.asc");
  params.set("limit", String(limit));
  if (payload.query?.trim()) {
    params.set("content", `ilike.*${payload.query.trim().replaceAll("*", "")}*`);
  }
  if (payload.work_slug) {
    params.set("works.slug", `eq.${payload.work_slug}`);
  }
  if (payload.source_lane_slug) {
    params.set("source_lane_slug", `eq.${payload.source_lane_slug}`);
  }
  const response = await fetch(`${supabaseUrl}/rest/v1/rag_chunks?${params}`, {
    headers: {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
    },
  });
  if (!response.ok) {
    throw new Error(`tdw browse failed: ${response.status} ${await response.text()}`);
  }
  const rows = await response.json();
  return rows.map((row: Record<string, unknown>) => ({
    canonical_ref: row.canonical_ref,
    work: row.works,
    source_lane_slug: row.source_lane_slug,
    section_title: row.section_title,
    snippet: snippet(String(row.content || ""), payload.query || ""),
    tdw_start: row.tdw_start,
    tdw_finish: row.tdw_finish,
    metadata: row.metadata,
  }));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const email = await requireAuthorizedEmail(req.headers.get("authorization"));
    const payload = await requestPayload(req);
    const results = await browse(payload);
    return jsonResponse({
      authorized_as: email,
      count: results.length,
      results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = ["missing_authorization", "invalid_authorization", "not_tdw_authorized"].includes(message) ? 403 : 500;
    return jsonResponse({ error: "tdw_browse_failed", message }, status);
  }
});
