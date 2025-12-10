
async function verifyUsers() {
  const baseUrl = "https://pocketbase-production-9c36.up.railway.app";
  
  // 3. Trying users collection
  console.log("\n3. Trying to fetch 'users' collection (public/auth check)...");
  // Users collection usually requires auth to list, so 403 is expected if it exists but is protected.
  // 404 means it doesn't exist (unlikely for users) or correct URL is wrong.
  const usersRes = await fetch(`${baseUrl}/api/collections/users/records?perPage=1`);
  
  console.log(`Users Response: ${usersRes.status} ${usersRes.statusText}`);
  if (usersRes.ok) {
     console.log("✅ Users collection accessible.");
  } else if (usersRes.status === 403) {
     console.log("✅ Users collection Exists (403 Forbidden - Protected as expected).");
  } else if (usersRes.status === 404) {
     console.log("⚠️ Users collection NOT FOUND (404). Very strange for PocketBase.");
  }
}

verifyUsers();
