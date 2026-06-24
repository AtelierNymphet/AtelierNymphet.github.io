type QuoteReference = {
  canonical_ref: string;
  canonical_url: string;
  fragment: string;
  github_owner: string;
  github_repo: string;
  github_ref: string;
  github_path: string;
  content_sha: string | null;
  char_start: number | null;
  char_end: number | null;
  quote_max_chars: number;
  canonical_epub_id: string | null;
  canonical_tdw_id: string | null;
  epub_available: boolean;
  delivery_mode: string;
  source_lane_slug: string | null;
  tdw_start: string | null;
  tdw_finish: string | null;
  metadata: Record<string, unknown>;
};

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "GET, POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "content-type": "application/json",
    },
  });
}

function env(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function requestRef(req: Request): Promise<string | null> {
  const url = new URL(req.url);
  const queryRef = url.searchParams.get("ref") || url.searchParams.get("canonical_ref");
  if (queryRef) return queryRef;
  if (req.method === "POST") {
    const body = await req.json().catch(() => ({}));
    return body.ref || body.canonical_ref || null;
  }
  return null;
}

async function lookupQuoteReference(canonicalRef: string, authorization: string | null): Promise<QuoteReference | null> {
  const supabaseUrl = env("SUPABASE_URL").replace(/\/$/, "");
  const anonKey = env("SUPABASE_ANON_KEY");
  const encoded = encodeURIComponent(canonicalRef);
  const response = await fetch(
    `${supabaseUrl}/rest/v1/quote_references?canonical_ref=eq.${encoded}&select=*`,
    {
      headers: {
        apikey: anonKey,
        authorization: authorization || `Bearer ${anonKey}`,
      },
    },
  );

  if (response.status === 401 || response.status === 403) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Supabase quote lookup failed: ${response.status} ${await response.text()}`);
  }

  const rows = await response.json() as QuoteReference[];
  return rows[0] || null;
}

async function fetchGitHubText(ref: QuoteReference): Promise<{ text: string; sha: string | null }> {
  const token = env("GITHUB_QUOTE_TOKEN");
  const apiUrl = new URL(
    `https://api.github.com/repos/${ref.github_owner}/${ref.github_repo}/contents/${ref.github_path}`,
  );
  apiUrl.searchParams.set("ref", ref.github_ref);

  const response = await fetch(apiUrl, {
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github.raw",
      "user-agent": "ateliernymphet-quote-api",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub quote fetch failed: ${response.status} ${await response.text()}`);
  }

  return {
    text: await response.text(),
    sha: response.headers.get("etag"),
  };
}

async function fetchStorageText(ref: QuoteReference): Promise<{ text: string; sha: string | null } | null> {
  const bucket = ref.metadata?.storage_bucket;
  const objectPath = ref.metadata?.source_text_object_path;
  if (typeof bucket !== "string" || typeof objectPath !== "string") return null;
  const supabaseUrl = env("SUPABASE_URL").replace(/\/$/, "");
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");
  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${objectPath.split("/").map(encodeURIComponent).join("/")}`,
    {
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(`Supabase storage quote fetch failed: ${response.status} ${await response.text()}`);
  }
  return {
    text: await response.text(),
    sha: response.headers.get("etag"),
  };
}

function extractQuote(text: string, ref: QuoteReference): string {
  const start = ref.char_start ?? 0;
  const requestedEnd = ref.char_end ?? Math.min(text.length, start + ref.quote_max_chars);
  const safeStart = Math.max(0, Math.min(start, text.length));
  const safeEnd = Math.max(safeStart, Math.min(requestedEnd, text.length, safeStart + ref.quote_max_chars));
  return text.slice(safeStart, safeEnd);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const canonicalRef = await requestRef(req);
    if (!canonicalRef) {
      return jsonResponse({ error: "missing_ref" }, 400);
    }

    const quoteRef = await lookupQuoteReference(canonicalRef, req.headers.get("authorization"));
    if (!quoteRef) {
      return jsonResponse({ error: "not_found_or_not_entitled" }, 404);
    }

    const source = await fetchStorageText(quoteRef) ?? await fetchGitHubText(quoteRef);
    const quote = extractQuote(source.text, quoteRef);

    return jsonResponse({
      canonical_ref: quoteRef.canonical_ref,
      canonical_url: quoteRef.canonical_url,
      canonical_epub_id: quoteRef.canonical_epub_id,
      canonical_tdw_id: quoteRef.canonical_tdw_id,
      epub_available: quoteRef.epub_available,
      delivery_mode: quoteRef.delivery_mode,
      fragment: quoteRef.fragment,
      source_lane_slug: quoteRef.source_lane_slug,
      tdw_start: quoteRef.tdw_start,
      tdw_finish: quoteRef.tdw_finish,
      quote,
      quote_length: quote.length,
      github: {
        owner: quoteRef.github_owner,
        repo: quoteRef.github_repo,
        ref: quoteRef.github_ref,
        path: quoteRef.github_path,
        content_sha: quoteRef.content_sha,
        fetched_etag: source.sha,
      },
      metadata: quoteRef.metadata,
    });
  } catch (error) {
    return jsonResponse(
      {
        error: "quote_lookup_failed",
        message: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});
