import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function test() {
  console.log("Supabase URL:", url);
  console.log("Supabase Key:", key ? `${key.substring(0, 15)}...` : "NONE");

  // Try list buckets
  const res = await fetch(`${url}/storage/v1/bucket`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });

  console.log("Storage buckets response status:", res.status);
  const text = await res.text();
  console.log("Response text:", text);
}

test();
