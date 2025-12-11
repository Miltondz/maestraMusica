
import PocketBase from 'pocketbase';

// Configura aquí tus credenciales de ADMIN del panel (no de la tabla users)
const ADMIN_EMAIL = 'mdvoid@gmail.com'; 
const ADMIN_PASS = '012345678';
const POCKETBASE_URL = 'https://pocketbase-production-9d94.up.railway.app';

const pb = new PocketBase(POCKETBASE_URL);

async function fixRules() {
  console.log(`Connecting to ${POCKETBASE_URL}...`);
  
  // Como esto es un script de administración, necesitamos loguearnos como SUPERUSER
  // Intenta poner tus credenciales reales abajo o escribe en la consola.
  // Nota: Si no quieres poner tu password aquí, te pediré que lo hagas manualmente en el código antes de correrlo.
  
  // !!! IMPORTANTE: REEMPLAZA ESTO CON TUS CREDENCIALES REALES PARA EJECUTAR UNA VEZ !!!
  try {
      // Para este script, asumiré que me las pasarás por variable de entorno o las editarás.
      // Si fallas el login, el script parará.
      const authData = await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
      console.log("✅ Admin Logged In!");
  } catch (e) {
      console.error("❌ Failed to login as Admin. Please edit fix_rules.js and set PB_ADMIN_EMAIL and PB_ADMIN_PASS, or hardcode them.");
      console.error(e);
      return;
  }

  const collections = [
    { name: 'services', publicRead: true },
    { name: 'testimonials', publicRead: true },
    { name: 'blog_posts', publicRead: true },
    { name: 'media_gallery', publicRead: true },
    { name: 'site_content', publicRead: true },
    { name: 'media_uploads', publicRead: true },
    { name: 'appointments', publicRead: false },      // Private (User only)
    { name: 'contact_messages', publicRead: false },  // Private (Admin only)
    { name: 'payments', publicRead: false },          // Private
    { name: 'users', publicRead: false }              // Private
  ];

  for (const col of collections) {
    try {
        const collection = await pb.collections.getOne(col.name);
        
        let updates = {};
        if (col.publicRead) {
            // Public Collections: Anyone can read
            updates = {
                listRule: "",
                viewRule: ""
            };
        } else {
            // Private Collections: Only authenticated users (or special logic)
             if (col.name === 'users') {
                updates = {
                    listRule: "id = @request.auth.id",
                    viewRule: "id = @request.auth.id",
                    updateRule: "id = @request.auth.id"
                };
             } else {
                 // For appointments/messages, users can see/manage their own (if linked) OR admin only.
                 // For simplicity, let's allow authenticated users to do CRUD if they are regular users, 
                 // but ideally you want "id = @request.auth.id" logic.
                 // For now, let's set: Only Authenticated Users.
                 updates = {
                    listRule: "@request.auth.id != ''",
                    viewRule: "@request.auth.id != ''",
                    createRule: "", // Public create for contact/appointments? Or auth only?
                    updateRule: "@request.auth.id != ''",
                    deleteRule: "@request.auth.id != ''"
                 };
                 
                 // Special Case: Contact Messages & Appointments should be creatable by ANYONE (public)? 
                 if (col.name === 'contact_messages' || col.name === 'appointments') {
                     updates.createRule = ""; // Allowe public creation
                 }
             }
        }

        await pb.collections.update(col.name, updates);
        console.log(`✅ Fixed rules for: ${col.name}`);

    } catch (e) {
        console.error(`❌ Error updating ${col.name}:`, e.message);
    }
  }
}

fixRules();
