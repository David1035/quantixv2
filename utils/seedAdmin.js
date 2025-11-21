// utils/seedAdmin.js
// Se ejecuta automáticamente al iniciar el servidor (una sola vez)

const ADMIN_DATA = {
  email: 'admin@quantix.com',
  password: 'Quantix2025',
  role: 'administrador'
};

const API_URL = process.env.APP_URL 
  ? `${process.env.APP_URL}/api/v1/users`
  : 'http://localhost:3000/api/v1/users';

async function seedAdminUser() {
  // Pequeña espera para asegurar que Express ya registró todas las rutas
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('🔄 Verificando usuario administrador...');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Si tu ruta requiere token para crear usuarios, agrégalo aquí
        // 'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify(ADMIN_DATA)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ ¡ADMINISTRADOR CREADO AUTOMÁTICAMENTE!');
      console.log(`   📧 ${result.email}`);
      console.log(`   🔑 Contraseña: Quantix2025`);
      console.log(`   👑 Rol: ${result.role || 'administrador'}`);
      console.log('   ¡Ya puedes entrar al panel con admin@quantix.com! 🚀\n');
    } else {
      // Si ya existe el usuario (error esperado)
      const msg = result.message?.toLowerCase() || '';
      if (
        msg.includes('ya está registrado') ||
        msg.includes('duplicate') ||
        msg.includes('existe') ||
        response.status === 409 ||
        response.status === 400
      ) {
        console.log('ℹ️  El usuario admin@quantix.com ya existe. Todo perfecto, seguimos...');
      } else {
        console.log('⚠️  Error inesperado al crear admin:', result.message || result);
      }
    }
  } catch (error) {
    console.log('❌ No se pudo conectar al servidor (¿aún está iniciando?)');
    console.log('   → Se reintentará la próxima vez que levantes el servidor');
  }
}

module.exports = seedAdminUser;