type QuoteReference = {
  canonical_ref: string;
  work_id: string;
  source_lane_slug: string | null;
  canonical_tdw_id: string | null;
  canonical_url: string;
  fragment: string;
  github_owner: string;
  github_repo: string;
  github_ref: string;
  github_path: string;
  char_start: number | null;
  char_end: number | null;
  visibility: "public" | "subscriber" | "private" | "forthcoming";
  tdw_start: string | null;
  tdw_finish: string | null;
  metadata: Record<string, unknown>;
  works?: {
    slug: string;
    title: string;
  };
};

type RagDocument = {
  id: string;
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
    headers: { ...corsHeaders, "content-type": "application/json" },
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

async function fetchQuoteReferences(limit: number, afterRef: string | null) {
  const params = new URLSearchParams();
  params.set(
    "select",
    "canonical_ref,work_id,source_lane_slug,canonical_tdw_id,canonical_url,fragment,github_owner,github_repo,github_ref,github_path,char_start,char_end,visibility,tdw_start,tdw_finish,metadata,works(slug,title)",
  );
  params.set("delivery_mode", "eq.quote_api_only");
  params.set("epub_available", "eq.false");
  params.set("canonical_tdw_id", "not.is.null");
  params.set("order", "canonical_ref.asc");
  params.set("limit", String(Math.min(Math.max(limit, 1), 100)));
  if (afterRef) {
    params.set("canonical_ref", `gt.${afterRef}`);
  }
  const response = await supabaseRest(`quote_references?${params}`);
  return await response.json() as QuoteReference[];
}

function storageCoordinates(ref: QuoteReference): { bucket: string; objectPath: string } {
  const bucket = ref.metadata?.storage_bucket;
  const objectPath = ref.metadata?.source_text_object_path;
  if (typeof bucket !== "string" || typeof objectPath !== "string") {
    throw new Error(`Missing storage metadata for ${ref.canonical_ref}`);
  }
  return { bucket, objectPath };
}

async function fetchStorageText(bucket: string, objectPath: string): Promise<string> {
  const supabaseUrl = env("SUPABASE_URL").replace(/\/$/, "");
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");
  const encodedPath = objectPath.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${encodedPath}`,
    {
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(`Storage fetch failed: ${response.status} ${await response.text()}`);
  }
  return await response.text();
}

function extractContent(sourceText: string, ref: QuoteReference): string {
  const start = Math.max(0, Math.min(ref.char_start ?? 0, sourceText.length));
  const end = Math.max(start, Math.min(ref.char_end ?? sourceText.length, sourceText.length));
  return sourceText.slice(start, end).trim().slice(0, 12000);
}

async function embedContent(content: string): Promise<number[]> {
  const session = new Supabase.ai.Session("gte-small");
  return await session.run(content, {
    mean_pool: true,
    normalize: true,
  }) as number[];
}

async function upsertDocument(ref: QuoteReference): Promise<RagDocument> {
  const response = await supabaseRest("rag_documents?on_conflict=canonical_url", {
    method: "POST",
    body: JSON.stringify({
      canonical_url: ref.canonical_url,
      work_id: ref.work_id,
      release_unit_id: null,
      title: `${ref.works?.title || ref.works?.slug || "TDW"}: ${ref.source_lane_slug || "source"}`,
      document_kind: "source_lane",
      canonical_epub_id: null,
      canonical_tdw_id: ref.canonical_tdw_id,
      epub_available: false,
      delivery_mode: "quote_api_only",
      github_owner: ref.github_owner,
      github_repo: ref.github_repo,
      github_ref: ref.github_ref,
      github_path: ref.github_path,
      visibility: ref.visibility,
      metadata: {
        storage_bucket: ref.metadata?.storage_bucket,
        source_text_object_path: ref.metadata?.source_text_object_path,
        generated_by: "index-tdw-rag-from-source",
      },
    }),
  });
  const rows = await response.json() as RagDocument[];
  if (!rows[0]) throw new Error(`Document upsert returned no row for ${ref.canonical_url}`);
  return rows[0];
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

    const body = await req.json().catch(() => ({}));
    const limit = Number(body.limit || 25);
    const afterRef = typeof body.after_ref === "string" ? body.after_ref : null;
    const refs = await fetchQuoteReferences(limit, afterRef);
    const sourceCache = new Map<string, string>();
    const documentCache = new Map<string, RagDocument>();
    let indexed = 0;
    let skipped = 0;
    const errors: { canonical_ref: string; message: string }[] = [];
    let lastRef = afterRef;

    for (const ref of refs) {
      lastRef = ref.canonical_ref;
      try {
        const coords = storageCoordinates(ref);
        const cacheKey = `${coords.bucket}/${coords.objectPath}`;
        if (!sourceCache.has(cacheKey)) {
          sourceCache.set(cacheKey, await fetchStorageText(coords.bucket, coords.objectPath));
        }
        const content = extractContent(sourceCache.get(cacheKey) || "", ref);
        if (!content) {
          skipped += 1;
          continue;
        }
        if (!documentCache.has(ref.canonical_url)) {
          documentCache.set(ref.canonical_url, await upsertDocument(ref));
        }
        const document = documentCache.get(ref.canonical_url);
        if (!document) throw new Error(`Missing document for ${ref.canonical_url}`);
        const embedding = await embedContent(content);
        await supabaseRest("rag_chunks?on_conflict=canonical_ref", {
          method: "POST",
          body: JSON.stringify({
            document_id: document.id,
            canonical_ref: ref.canonical_ref,
            work_id: ref.work_id,
            release_unit_id: null,
            source_lane_slug: ref.source_lane_slug,
            chunk_index: 0,
            section_title: ref.source_lane_slug,
            fragment: ref.fragment,
            content,
            token_count: content.split(/\s+/).filter(Boolean).length,
            embedding_model: "gte-small",
            embedding,
            github_owner: ref.github_owner,
            github_repo: ref.github_repo,
            github_ref: ref.github_ref,
            github_path: ref.github_path,
            char_start: ref.char_start,
            char_end: ref.char_end,
            visibility: ref.visibility,
            canonical_epub_id: null,
            canonical_tdw_id: ref.canonical_tdw_id,
            epub_available: false,
            delivery_mode: "quote_api_only",
            tdw_start: ref.tdw_start,
            tdw_finish: ref.tdw_finish,
            metadata: {
              ...ref.metadata,
              generated_by: "index-tdw-rag-from-source",
            },
          }),
        });
        indexed += 1;
      } catch (error) {
        errors.push({
          canonical_ref: ref.canonical_ref,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return jsonResponse({
      indexed,
      skipped,
      errors,
      requested_limit: limit,
      fetched: refs.length,
      last_ref: lastRef,
      done: refs.length === 0,
    });
  } catch (error) {
    return jsonResponse(
      {
        error: "tdw_rag_index_failed",
        message: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});
