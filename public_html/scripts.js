function togglePassword() {
  const input = document.getElementById('password');
  const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
  input.setAttribute('type', type);
}

// Generar ID automático
function generateProductId() {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const lastId = products.length ? products[products.length - 1].id : 'P0';
  const newId = `P${parseInt(lastId.slice(1)) + 1}`;
  return newId;
}

// Función para renderizar categorías
function renderCategories() {
  const categories = JSON.parse(localStorage.getItem('categories')) || [];
  const categorySelect = document.getElementById('categoria');
  const categoryList = document.getElementById('categoryList');

  if (categorySelect) {
    categorySelect.innerHTML = `
      <option value="" disabled selected>Seleccionar categoría</option>
      ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
    `;
  }

  if (categoryList) {
    categoryList.innerHTML = categories.map((cat, index) => `
      <li class="flex justify-between items-center">
        <span>${cat}</span>
        <button class="text-red-500" onclick="deleteCategory(${index})">Eliminar</button>
      </li>
    `).join('');
  }
}

// Función para eliminar una categoría
function deleteCategory(index) {
  const categories = JSON.parse(localStorage.getItem('categories')) || [];
  categories.splice(index, 1);
  localStorage.setItem('categories', JSON.stringify(categories));
  renderCategories();
}

// Función para agregar una categoría
function addCategory(category) {
  const categories = JSON.parse(localStorage.getItem('categories')) || [];
  if (!categories.includes(category)) {
    categories.push(category);
    localStorage.setItem('categories', JSON.stringify(categories));
    renderCategories();
  } else {
    alert('La categoría ya existe.');
  }
}

// Función para registrar una entrada o salida de inventario separada por meses
function updateInventoryData(type, quantity, date) {
  const inventoryData = JSON.parse(localStorage.getItem('inventoryData')) || {};
  const dateObj = new Date(date);
  const monthYear = `${dateObj.toLocaleString('default', { month: 'long' })} ${dateObj.getFullYear()}`;

  if (!inventoryData[monthYear]) {
    inventoryData[monthYear] = { entradas: 0, salidas: 0 };
  }

  if (type === 'entrada') {
    inventoryData[monthYear].entradas += quantity; // Sumar la cantidad a las entradas del mes correspondiente
  } else if (type === 'salida') {
    inventoryData[monthYear].salidas += quantity; // Sumar la cantidad a las salidas del mes correspondiente
  }

  localStorage.setItem('inventoryData', JSON.stringify(inventoryData)); // Guardar en localStorage
}

// Función para formatear fechas al formato YYYY-MM-DD
function formatDate(date) {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Mes con dos dígitos
  const day = String(dateObj.getDate()).padStart(2, '0'); // Día con dos dígitos
  return `${year}-${month}-${day}`;
}

// Modificar la función addProduct para formatear la fecha
function addProduct(product) {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  product.date = formatDate(product.date); // Formatear la fecha antes de guardar
  products.push(product);
  localStorage.setItem('products', JSON.stringify(products));
  updateInventoryData('entrada', product.quantity, product.date); // Registrar la entrada con fecha
  renderTable();
}

// Función para renderizar la tabla de productos
function renderTable() {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const tbody = document.getElementById('productsTbody');
  if (!tbody) return; // Verificar que el contenedor de la tabla exista

  tbody.innerHTML = ''; // Limpiar la tabla antes de renderizar

  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-gray-500 py-4">No hay productos disponibles.</td>
      </tr>
    `;
    return;
  }

  products.forEach((product, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-4 py-3">${product.id}</td>
      <td class="px-4 py-3">${product.name}</td>
      <td class="px-4 py-3">${product.quantity}</td>
      <td class="px-4 py-3">${product.category}</td>
      <td class="px-4 py-3">${product.price}</td>
      <td class="px-4 py-3">${formatDate(product.date)}</td> <!-- Mostrar fecha formateada -->
      <td class="px-4 py-3">
        <button class="text-red-500" onclick="deleteProduct(${index})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Función para renderizar lista de productos en modificar.html
function renderList() {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const listContainer = document.getElementById('listContainer');
  if (listContainer) {
    listContainer.innerHTML = products.map((product, index) => `
      <div class="flex justify-between items-center border-b py-2">
        <span>${product.name} (${product.id})</span>
        <button class="text-blue-500" onclick="editProduct(${index})">Editar</button>
      </div>
    `).join('');
  }
}

// Función para renderizar lista de productos en eliminar.html
function renderDeleteList() {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const list = document.getElementById('list');
  if (list) {
    list.innerHTML = products.map((product, index) => `
      <div class="flex justify-between items-center border-b py-2">
        <span>${product.name} (${product.id})</span>
        <button class="text-red-500" onclick="deleteProduct(${index})">Eliminar</button>
      </div>
    `).join('');
  }
}

// Función para eliminar un producto
function deleteProduct(index) {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const removedProduct = products.splice(index, 1)[0];
  removedProduct.date = formatDate(removedProduct.date); // Formatear la fecha antes de usarla
  localStorage.setItem('products', JSON.stringify(products));
  updateInventoryData('salida', removedProduct.quantity, removedProduct.date); // Registrar la salida con fecha
  renderTable();
  renderDeleteList();
}

// Función para exportar los datos de productos a un archivo Excel
function exportToExcel() {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  if (products.length === 0) {
    alert('No hay productos disponibles para exportar.');
    return;
  }

  // Crear una hoja de cálculo con los datos de los productos
  const worksheet = XLSX.utils.json_to_sheet(products);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

  // Descargar el archivo Excel
  XLSX.writeFile(workbook, 'productos.xlsx');
}