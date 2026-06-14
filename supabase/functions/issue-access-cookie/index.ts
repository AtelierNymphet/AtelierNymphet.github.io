// Placeholder Edge Function for protected publishing.
//
// Future job:
// - verify Supabase Auth user
// - check entitlements for a work/release prefix
// - issue either Supabase signed URLs or CDN signed cookies
// - redirect reader back to the requested book path

Deno.serve(() => {
  return new Response(
    JSON.stringify({
      status: "not_implemented",
      message: "Access-cookie issuer scaffold. Wire entitlements before use.",
    }),
    {
      status: 501,
      headers: { "content-type": "application/json" },
    },
  );
});
