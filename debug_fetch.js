
import PocketBase from 'pocketbase';

const PB_URL = 'https://pocketbase-production-9d94.up.railway.app';
const pb = new PocketBase(PB_URL);

async function debugFetch() {
  console.log(`🔌 Conectando a ${PB_URL}...`);
  
  try {
    // 1. Prueba básica sin sort
    console.log("\n1. Intentando fetch a 'media_gallery' SIN sort...");
    try {
        const list1 = await pb.collection('media_gallery').getList(1, 1, { sort: '' });
        console.log("✅ Éxito sin sort. Items:", list1.items.length);
    } catch (e) {
        console.error("❌ Falló sin sort:", e.status, e.message);
    }

    // 2. Prueba con sort -created
    console.log("\n2. Intentando fetch a 'media_gallery' CON sort='-created'...");
    try {
        const list2 = await pb.collection('media_gallery').getList(1, 1, { sort: '-created' });
        console.log("✅ Éxito con sort. Items:", list2.items.length);
    } catch (e) {
        console.error("❌ Falló con sort:", e.status, e.message);
    }

    // 3. Prueba de autenticación simple (por si acaso)
    console.log("\n3. Verificando estado de reglas (intentando leer 'services')...");
    try {
         const list3 = await pb.collection('services').getList(1, 1);
         console.log("✅ Services legible. Total:", list3.totalItems);
    } catch (e) {
        console.error("❌ Falló services (probablemente reglas):", e.status, e.message);
    }

  } catch (err) {
    console.error("❌ Error general:", err);
  }
}

debugFetch();
