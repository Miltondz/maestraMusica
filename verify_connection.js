
async function verifyConnection() {
  const baseUrl = "https://pocketbase-production-9c36.up.railway.app";
  console.log(`Checking connection to: ${baseUrl}`);

  try {
    // 1. Check Health
    console.log("\n1. Pinging Health Endpoint...");
    const healthRes = await fetch(`${baseUrl}/api/health`);
    if (healthRes.ok) {
      const healthData = await healthRes.json();
      console.log("✅ Health Check Passed:", healthData);
    } else {
      console.error("❌ Health Check Failed:", healthRes.status, healthRes.statusText);
    }

    // 2. Check a Collection (e.g., 'services') to verify data access
    // Note: This relies on the 'services' collection being public (reading enabled).
    console.log("\n2. Trying to fetch 'services' collection...");
    const servicesRes = await fetch(`${baseUrl}/api/collections/services/records?perPage=1`);
    
    if (servicesRes.ok) {
      const servicesData = await servicesRes.json();
      console.log(`✅ Success! Found ${servicesData.totalItems} items in 'services' collection.`);
      if (servicesData.items.length > 0) {
        console.log("Sample item:", servicesData.items[0].id);
      }
    } else {
      if (servicesRes.status === 404) {
         console.warn("⚠️ Collection 'services' not found (404). This might be expected if migration hasn't run.");
      } else if (servicesRes.status === 403) {
         console.warn("⚠️ Access Forbidden (403). API Rules might prevent public access.");
      } else {
         console.error("❌ Failed to fetch services:", servicesRes.status, servicesRes.statusText);
      }
    }

  } catch (error) {
    console.error("❌ Connection Error:", error.message);
  }
}

verifyConnection();
