const API = '/api/v1';

// ===============================
//  PRODUCTOS
// ===============================
async function cargarProductos() {
  try {
    const res = await fetch(`${API}/products`);
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
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.stock}</td>
        <td>${product.category?.name || 'Sin categoría'}</td>
        <td>$${product.salePrice}</td>
        <td>${formatDate(product.createdAt)}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Error al cargar productos:', err);
  }
}

async function addProduct(product) {
  try {
    const res = await fetch(`${API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al crear producto');
    }

    const created = await res.json();
    cargarProductos(); // recarga la tabla
    return created;
  } catch (err) {
    console.error('Error al agregar producto:', err);
    alert('Error al agregar producto. Revisa los datos ingresados.');
  }
}

// ===============================
//  CATEGORÍAS
// ===============================
async function renderCategories() {
  try {
    const res = await fetch(`${API}/categories`);
    const categories = await res.json();

    const select = document.getElementById('categoria');
    const list = document.getElementById('categoryList');

    if (select) {
      select.innerHTML = `
        <option disabled selected value="">Selecciona una categoría</option>
        ${categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
      `;
    }

    if (list) {
      list.innerHTML = categories.map(cat => `
        <li class="flex justify-between items-center py-1">
          <span>
            <strong>${cat.name}</strong><br/>
            <small class="text-gray-500">${cat.description}</small>
          </span>
          <button onclick="deleteCategory(${cat.id})" class="text-red-500">Eliminar</button>
        </li>
      `).join('');
    }
  } catch (err) {
    console.error('Error al cargar categorías:', err);
  }
}

async function addCategory(name, description) {
  try {
    const res = await fetch(`${API}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( name, description ) // ✅ CORREGIDO se retiró las llaves para que pueda funcionar, recuerda
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al crear categoría');
    }

    renderCategories();
  } catch (err) {
    console.error('Error al agregar categoría:', err);
    alert('Error al agregar categoría. Verifica los campos.');
  }
}

async function deleteCategory(id) {
  if (!confirm('¿Deseas eliminar esta categoría?')) return;
  try {
    await fetch(`${API}/categories/${id}`, {
      method: 'DELETE'
    });
    renderCategories();
  } catch (err) {
    console.error('Error al eliminar categoría:', err);
  }
}

// ===============================
//  UTILS
// ===============================
function formatDate(date) {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
}

// ===============================
//  EVENTOS DOM
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  // Categorías
  const addCategoryBtn = document.getElementById('addCategoryBtn');
  const categoryNameInput = document.getElementById('newCategory');
  const categoryDescInput = document.getElementById('categoryDescription');

  if (addCategoryBtn && categoryNameInput && categoryDescInput) {
    addCategoryBtn.addEventListener('click', async function () {
      const name = categoryNameInput.value.trim();
      const description = categoryDescInput.value.trim();

      if (name && description) {
        await addCategory(name, description);
        categoryNameInput.value = '';
        categoryDescInput.value = '';
      } else {
        alert('Por favor completa ambos campos: nombre y descripción.');
      }
    });
  }

  // Producto
  const addProductBtn = document.getElementById('addProductBtn');
  const productName = document.getElementById('productName');
  const productStock = document.getElementById('productStock');
  const productPrice = document.getElementById('productPrice');
  const productCategory = document.getElementById('categoria');

  if (addProductBtn && productName && productStock && productPrice && productCategory) {
    addProductBtn.addEventListener('click', async function () {
      const name = productName.value.trim();
      const stock = parseInt(productStock.value);
      const salePrice = parseFloat(productPrice.value);
      const categoryId = parseInt(productCategory.value);

      if (!name || isNaN(stock) || isNaN(salePrice) || isNaN(categoryId)) {
        alert('Por favor completa todos los campos correctamente.');
        return;
      }

      const product = {
        name,
        stock,
        salePrice,
        purchasePrice: salePrice * 0.8, // lógica temporal
        categoryId
      };

      await addProduct(product);

      // Limpiar campos
      productName.value = '';
      productStock.value = '';
      productPrice.value = '';
      productCategory.value = '';
    });
  }

  // Cargar inicial
  cargarProductos();
  renderCategories();
});
