import PocketBase from "pocketbase";

// Para desarrollo local, usa: http://127.0.0.1:8090
const pocketbaseUrl = import.meta.env.VITE_POCKETBASE_URL || "https://pocketbase-production-9c36.up.railway.app";

if (!pocketbaseUrl) {
  console.warn("Missing PocketBase environment variables");
}

export const pb = new PocketBase(pocketbaseUrl);

// Optional: Disable auto-cancellation to allow multiple pending requests
pb.autoCancellation(false);

export default pb;
