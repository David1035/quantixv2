// ===============================
//  FUNCIONES DE PRODUCTOS
// ===============================

// Obtener todos los productos y renderizar en tabla
async function cargarProductos() {
  try {
    const res = await fetch('/api/productos');
    const products = await res.json();

    const tbody = document.getElementById('productsTbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (products.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-gray-500 py-4">
            No hay productos disponibles.
          </td>
        </tr>`;
      return;
    }

    products.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-4 py-3">${product.id}</td>
        <td class="px-4 py-3">${product.nombre}</td>
        <td class="px-4 py-3">${product.cantidad}</td>
        <td class="px-4 py-3">${product.categoria}</td>
        <td class="px-4 py-3">${product.precio}</td>
        <td class="px-4 py-3">${formatDate(product.fecha)}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Error al cargar productos:', err);
  }
}

// Agregar producto
async function addProduct(product) {
  try {
    const res = await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return await res.json();
  } catch (err) {
    console.error('Error al agregar producto:', err);
  }
}

// Eliminar producto
async function deleteProduct(id) {
  if (!confirm('¿Está seguro de eliminar este producto?')) return;

  try {
    await fetch(`/api/productos/${id}`, { method: 'DELETE' });
    renderDeleteList();
    cargarProductos();
  } catch (err) {
    console.error('Error al eliminar producto:', err);
  }
}

// Editar producto
async function editProduct(id, newData) {
  try {
    await fetch(`/api/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    });
    renderList();
    cargarProductos();
  } catch (err) {
    console.error('Error al editar producto:', err);
  }
}

// ===============================
//  FUNCIONES DE CATEGORÍAS
// ===============================

async function renderCategories() {
  try {
    const res = await fetch('/api/categorias');
    const categories = await res.json();

    const categorySelect = document.getElementById('categoria');
    const categoryList = document.getElementById('categoryList');

    if (categorySelect) {
      categorySelect.innerHTML = `
        <option value="" disabled selected>Seleccionar categoría</option>
        ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
      `;
    }

    if (categoryList) {
      categoryList.innerHTML = categories.map((cat, i) => `
        <li class="flex justify-between items-center">
          <span>${cat}</span>
          <button class="text-red-500" onclick="deleteCategory(${i})">Eliminar</button>
        </li>
      `).join('');
    }
  } catch (err) {
    console.error('Error al renderizar categorías:', err);
  }
}

async function addCategory(category) {
  try {
    await fetch('/api/categorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoria: category }),
    });
    renderCategories();
  } catch (err) {
    console.error('Error al agregar categoría:', err);
  }
}

async function deleteCategory(index) {
  try {
    await fetch(`/api/categorias/${index}`, { method: 'DELETE' });
    renderCategories();
  } catch (err) {
    console.error('Error al eliminar categoría:', err);
  }
}

// ===============================
//  FUNCIONES DE VISTAS
// ===============================

// Listar productos para modificar
async function renderList() {
  try {
    const res = await fetch('/api/productos');
    const products = await res.json();
    const container = document.getElementById('listContainer');
    if (!container) return;

    container.innerHTML = products.map(p => `
      <div class="flex justify-between items-center border-b py-2">
        <span>${p.nombre} (${p.id})</span>
        <button class="text-blue-500" onclick="editProduct(${p.id}, { cantidad: prompt('Nueva cantidad:', ${p.cantidad}) })">Editar</button>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error al renderizar lista:', err);
  }
}

// Listar productos para eliminar
async function renderDeleteList() {
  try {
    const res = await fetch('/api/productos');
    const products = await res.json();
    const list = document.getElementById('list');
    if (!list) return;

    list.innerHTML = products.map(p => `
      <div class="flex justify-between items-center border-b py-2">
        <span>${p.nombre} (${p.id})</span>
        <button class="text-red-500" onclick="deleteProduct(${p.id})">Eliminar</button>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error al renderizar lista de eliminación:', err);
  }
}

// ===============================
//  FUNCIONES DE LOGIN
// ===============================
async function loginUser(e) {
  e.preventDefault();
  const usuario = document.getElementById('usuario').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password }),
    });

    if (res.ok) {
      window.location.href = 'index.html';
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  } catch (err) {
    console.error('Error en login:', err);
  }
}

// ===============================
//  FUNCIONES DE REPORTES
// ===============================
async function exportToExcel() {
  try {
    const res = await fetch('/api/productos');
    const products = await res.json();

    if (products.length === 0) {
      alert('No hay productos disponibles para exportar.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
    XLSX.writeFile(workbook, 'productos.xlsx');
  } catch (err) {
    console.error('Error al exportar a Excel:', err);
  }
}

// ===============================
//  UTILS
// ===============================
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}
