type IndexChunkRequest = {
  document: {
    canonical_url: string;
    work_slug: string;
    release_slug?: string | null;
    title: string;
    document_kind?: "work" | "source_lane" | "manifest" | "critical_note";
    canonical_epub_id?: string | null;
    canonical_tdw_id?: string | null;
    epub_available?: boolean;
    delivery_mode?: "reader" | "quote_api_only";
    github_owner?: string;
    github_repo: string;
    github_ref?: string;
    github_path?: string | null;
    visibility?: "public" | "subscriber" | "private" | "forthcoming";
    metadata?: Record<string, unknown>;
  };
  chunk: {
    canonical_ref: string;
    source_lane_slug?: string | null;
    chunk_index: number;
    section_title?: string | null;
    fragment: string;
    content: string;
    token_count?: number | null;
    github_path?: string | null;
    char_start?: number | null;
    char_end?: number | null;
    visibility?: "public" | "subscriber" | "private" | "forthcoming";
    tdw_start?: string | null;
    tdw_finish?: string | null;
    metadata?: Record<string, unknown>;
  };
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
    "authorization, x-client-info, apikey, content-type, x-rag-ingest-secret",
  "access-control-allow-methods": "POST, OPTIONS",
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

async function supabaseRest(path: string, init: RequestInit = {}) {
  const supabaseUrl = env("SUPABASE_URL").replace(/\/$/, "");
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      "content-type": "application/json",
      prefer: "return=representation,resolution=merge-duplicates",
      ...(init.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(
      `Supabase REST failed: ${response.status} ${await response.text()}`,
    );
  }
  return response;
}

async function one<T>(path: string): Promise<T> {
  const response = await supabaseRest(path);
  const rows = await response.json() as T[];
  if (!rows[0]) throw new Error(`No row returned for ${path}`);
  return rows[0];
}

async function embedContent(content: string): Promise<number[]> {
  const session = new Supabase.ai.Session("gte-small");
  return await session.run(content, {
    mean_pool: true,
    normalize: true,
  }) as number[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, 405);
  }

  try {
    const expectedSecret = env("ATELIER_RAG_INGEST_SECRET");
    if (req.headers.get("x-rag-ingest-secret") !== expectedSecret) {
      return jsonResponse({ error: "unauthorized" }, 401);
    }

    const payload = await req.json() as IndexChunkRequest;
    if (
      !payload.document?.canonical_url || !payload.document?.work_slug ||
      !payload.document?.github_repo
    ) {
      return jsonResponse({ error: "invalid_document" }, 400);
    }
    if (
      !payload.chunk?.canonical_ref || !payload.chunk?.fragment ||
      !payload.chunk?.content
    ) {
      return jsonResponse({ error: "invalid_chunk" }, 400);
    }
    if (payload.chunk.content.length > 12000) {
      return jsonResponse({ error: "chunk_too_large" }, 400);
    }

    const work = await one<{ id: string }>(
      `works?slug=eq.${
        encodeURIComponent(payload.document.work_slug)
      }&select=id`,
    );
    const releaseUnit = payload.document.release_slug
      ? await one<{ id: string }>(
        `release_units?work_id=eq.${work.id}&slug=eq.${
          encodeURIComponent(payload.document.release_slug)
        }&select=id`,
      )
      : null;

    const documentMode = payload.document.delivery_mode ?? "reader";
    const canonicalEpubId = payload.document.canonical_epub_id ?? null;
    const canonicalTdwId = payload.document.canonical_tdw_id ?? null;
    if (!canonicalEpubId && !canonicalTdwId) {
      return jsonResponse({ error: "missing_canonical_identity" }, 400);
    }
    if (
      documentMode === "quote_api_only" &&
      payload.document.epub_available !== false
    ) {
      return jsonResponse(
        { error: "tdw_chunks_must_not_be_epub_available" },
        400,
      );
    }

    const documentRowsResponse = await supabaseRest(
      "rag_documents?on_conflict=canonical_url",
      {
        method: "POST",
        body: JSON.stringify({
          canonical_url: payload.document.canonical_url,
          work_id: work.id,
          release_unit_id: releaseUnit?.id ?? null,
          title: payload.document.title,
          document_kind: payload.document.document_kind ?? "work",
          canonical_epub_id: canonicalEpubId,
          canonical_tdw_id: canonicalTdwId,
          epub_available: payload.document.epub_available ?? true,
          delivery_mode: documentMode,
          github_owner: payload.document.github_owner ?? "AtelierNymphet",
          github_repo: payload.document.github_repo,
          github_ref: payload.document.github_ref ?? "main",
          github_path: payload.document.github_path ?? null,
          visibility: payload.document.visibility ?? "private",
          metadata: payload.document.metadata ?? {},
        }),
      },
    );
    const documentRows = await documentRowsResponse.json() as { id: string }[];
    const document = documentRows[0];

    const embedding = await embedContent(payload.chunk.content);
    await supabaseRest("rag_chunks?on_conflict=canonical_ref", {
      method: "POST",
      body: JSON.stringify({
        document_id: document.id,
        canonical_ref: payload.chunk.canonical_ref,
        work_id: work.id,
        release_unit_id: releaseUnit?.id ?? null,
        source_lane_slug: payload.chunk.source_lane_slug ?? null,
        chunk_index: payload.chunk.chunk_index,
        section_title: payload.chunk.section_title ?? null,
        fragment: payload.chunk.fragment,
        content: payload.chunk.content,
        token_count: payload.chunk.token_count ?? null,
        embedding_model: "gte-small",
        embedding,
        github_owner: payload.document.github_owner ?? "AtelierNymphet",
        github_repo: payload.document.github_repo,
        github_ref: payload.document.github_ref ?? "main",
        github_path: payload.chunk.github_path ??
          payload.document.github_path ?? null,
        char_start: payload.chunk.char_start ?? null,
        char_end: payload.chunk.char_end ?? null,
        visibility: payload.chunk.visibility ?? payload.document.visibility ??
          "private",
        canonical_epub_id: canonicalEpubId,
        canonical_tdw_id: canonicalTdwId,
        epub_available: payload.document.epub_available ?? true,
        delivery_mode: documentMode,
        tdw_start: payload.chunk.tdw_start ?? null,
        tdw_finish: payload.chunk.tdw_finish ?? null,
        metadata: payload.chunk.metadata ?? {},
      }),
    });

    return jsonResponse({
      indexed: true,
      canonical_ref: payload.chunk.canonical_ref,
      canonical_url: payload.document.canonical_url,
    });
  } catch (error) {
    return jsonResponse(
      {
        error: "rag_index_failed",
        message: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});
