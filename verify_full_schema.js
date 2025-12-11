
async function verifyAllCollections() {
  const baseUrl = "https://pocketbase-production-9d94.up.railway.app";
  const collections = [
    'services', 
    'testimonials', 
    'blog_posts', 
    'appointments', 
    'payments', 
    'media_gallery', 
    'contact_messages', 
    'site_content',
    'media_uploads' 
  ];

  console.log(`Checking collections on: ${baseUrl}\n`);

  for (const col of collections) {
    try {
      // Intentamos listar 1 items. Si recibimos 200 (incluso con 0 items), la colección existe y es pública.
      // Si recibimos 403, existe pero es privada.
      // Si recibimos 404, NO existe.
      const res = await fetch(`${baseUrl}/api/collections/${col}/records?perPage=1`);
      
      if (res.ok) {
        const data = await res.json();
        console.log(`✅  ${col.padEnd(20)}: OK (Public) - ${data.totalItems} items found`);
      } else {
        if (res.status === 403) {
           console.log(`🔒  ${col.padEnd(20)}: OK (Private/Protected) - Exists but requires auth`);
        } else if (res.status === 404) {
           console.error(`❌  ${col.padEnd(20)}: NOT FOUND`);
        } else {
           console.error(`⚠️  ${col.padEnd(20)}: Error ${res.status}`);
        }
      }
    } catch (e) {
      console.error(`❌  ${col.padEnd(20)}: Connection Error`);
    }
  }
}

verifyAllCollections();
