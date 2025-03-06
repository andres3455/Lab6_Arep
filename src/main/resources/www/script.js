const API_URL = "http://52.23.233.40:8080/properties";



//  Cargar propiedades al inicio
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("property-list")) fetchProperties();
  if (document.getElementById("search-results")) setupSearch();
  if (document.getElementById("edit-list")) fetchEditableProperties();
});

//  Agregar nueva propiedad
const propertyForm = document.getElementById("property-form");
if (propertyForm) {
  propertyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const address = document.getElementById("address").value.trim();
    const price = document.getElementById("price").value.trim();
    const size = document.getElementById("size").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!address || !price || !size || !description) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const property = { address, price, size, description };

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(property),
      });

      propertyForm.reset();
      fetchProperties();
    } catch (error) {
      alert("Error al agregar la propiedad.");
      console.error(error);
    }
  });
}

// 📌 Obtener propiedades y mostrarlas
async function fetchProperties() {
  try {
    const response = await fetch(API_URL);
    const properties = await response.json();

    const list = document.getElementById("property-list");
    list.innerHTML = "";

    properties.forEach((prop) => {
      const li = document.createElement("li");
      li.innerHTML = `
                <strong>${prop.address}</strong> $${prop.price}, ${prop.size}m²
        <div class="buttons">
            <button onclick="showDescription('${prop.description}')">Ver descripción</button>
            <button class="delete-btn" onclick="deleteProperty(${prop.id}, this)">Eliminar</button>
        </div>`;
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Error al obtener propiedades:", error);
  }
}

async function deleteProperty(id, button) {
  if (!confirm("¿Eliminar propiedad?")) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    button.closest("li").remove(); // Elimina la propiedad del DOM sin recargar la página
  } catch (error) {
    alert("Error al eliminar la propiedad.");
    console.error(error);
  }
}

// Mostrar descripcion propiedad
function showDescription(description) {
  alert(`Descripción: ${description}`);
}

//  Configurar búsqueda (buscar.html)
async function buscarPropiedad() {
  const searchQuery = document
    .getElementById("search")
    .value.trim()
    .toLowerCase();

  if (!searchQuery) {
    alert("Ingresa una dirección para buscar.");
    return;
  }

  try {
    const response = await fetch(API_URL);
    const properties = await response.json();

    const filteredProperties = properties.filter((prop) =>
      prop.address.toLowerCase().includes(searchQuery)
    );

    const list = document.getElementById("search-results");
    list.innerHTML = "";

    if (filteredProperties.length === 0) {
      alert("No se encontró ninguna propiedad con esa dirección.");
    } else {
      filteredProperties.forEach((prop) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${prop.address}</strong> $${prop.price}, ${prop.size}m²
          <div class="buttons">
            <button class="delete-btn" onclick="deleteProperty(${prop.id}, this)">Eliminar</button>
          </div>`;
        list.appendChild(li);
      });
    }
  } catch (error) {
    alert("Error en la búsqueda.");
    console.error(error);
  }
}

//  Eliminar propiedad
async function deleteProperty(id, button) {
  if (!confirm("¿Eliminar propiedad?")) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    button.closest("li").remove(); // Elimina la propiedad del DOM sin recargar la página
  } catch (error) {
    alert("Error al eliminar la propiedad.");
    console.error(error);
  }
}

//  Obtener propiedades para edición
async function fetchEditableProperties() {
  try {
    const response = await fetch(API_URL);
    const properties = await response.json();

    const list = document.getElementById("edit-list");
    list.innerHTML = "";

    properties.forEach((prop) => {
      const li = document.createElement("li");
      li.innerHTML = `
                <strong>${prop.address}</strong> $${prop.price}, ${prop.size}m²
                <div class="buttons">
                    <button onclick="fillEditForm(${prop.id}, '${prop.address}', ${prop.price}, ${prop.size}, '${prop.description}')">Editar</button>
                </div>`;
      list.appendChild(li);
    });
  } catch (error) {
    alert("Error al obtener propiedades para edición.");
    console.error(error);
  }
}

//  Llenar formulario de edición
function fillEditForm(id, address, price, size, description) {
  document.getElementById("edit-id").value = id;
  document.getElementById("edit-address").value = address;
  document.getElementById("edit-price").value = price;
  document.getElementById("edit-size").value = size;
  document.getElementById("edit-description").value = description;
}

// Editar propiedad
const editForm = document.getElementById("edit-form");
if (editForm) {
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("edit-id").value;
    const address = document.getElementById("edit-address").value.trim();
    const price = document.getElementById("edit-price").value.trim();
    const size = document.getElementById("edit-size").value.trim();
    const description = document
      .getElementById("edit-description")
      .value.trim();

    if (!id || !address || !price || !size || !description) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const property = { address, price, size, description };

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(property),
      });

      fetchEditableProperties();
      editForm.reset();
    } catch (error) {
      alert("Error al actualizar la propiedad.");
      console.error(error);
    }
  });
}
