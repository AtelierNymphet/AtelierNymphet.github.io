type RagSearchRequest = {
  query?: string;
  match_count?: number;
  min_similarity?: number;
  work_slug?: string | null;
  include_tdw?: boolean;
};

declare const Supabase: {
  ai: {
    Session: new (model: string) => {
      run(
        input: string,
        options: { mean_pool: boolean; normalize: boolean },
      ): Promise<number[]>;
    };
  };
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
    headers: {
      ...corsHeaders,
      "content-type": "application/json",
    },
  });
}

function env(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function requestPayload(req: Request): Promise<RagSearchRequest> {
  const url = new URL(req.url);
  if (req.method === "GET") {
    return {
      query: url.searchParams.get("q") || url.searchParams.get("query") ||
        undefined,
      match_count: Number(url.searchParams.get("match_count") || 12),
      min_similarity: Number(url.searchParams.get("min_similarity") || 0.2),
      work_slug: url.searchParams.get("work_slug"),
      include_tdw: url.searchParams.get("include_tdw") === "true",
    };
  }
  return await req.json().catch(() => ({}));
}

async function embedQuery(query: string): Promise<number[]> {
  const session = new Supabase.ai.Session("gte-small");
  return await session.run(query, {
    mean_pool: true,
    normalize: true,
  }) as number[];
}

async function matchChunks(
  payload: Required<Pick<RagSearchRequest, "query">> & RagSearchRequest,
  embedding: number[],
  authorization: string | null,
) {
  const supabaseUrl = env("SUPABASE_URL").replace(/\/$/, "");
  const anonKey = env("SUPABASE_ANON_KEY");
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/match_rag_chunks`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      authorization: authorization || `Bearer ${anonKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query_embedding: embedding,
      match_count: payload.match_count ?? 12,
      min_similarity: payload.min_similarity ?? 0.2,
      filter_work_slug: payload.work_slug ?? null,
      include_tdw: payload.include_tdw ?? false,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `RAG search failed: ${response.status} ${await response.text()}`,
    );
  }
  return await response.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const payload = await requestPayload(req);
    const query = payload.query?.trim();
    if (!query) return jsonResponse({ error: "missing_query" }, 400);
    if (query.length > 2000) {
      return jsonResponse({ error: "query_too_long" }, 400);
    }

    const embedding = await embedQuery(query);
    const matches = await matchChunks(
      { ...payload, query },
      embedding,
      req.headers.get("authorization"),
    );

    return jsonResponse({
      query,
      match_count: matches.length,
      matches,
    });
  } catch (error) {
    return jsonResponse(
      {
        error: "rag_search_failed",
        message: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});
