const API_URL = "http://localhost:8080/properties";

// 📌 Cargar propiedades al inicio
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("property-list")) fetchProperties(); // Si estamos en index.html
    if (document.getElementById("search-results")) setupSearch();   // Si estamos en buscar.html
    if (document.getElementById("edit-list")) fetchEditableProperties(); // Si estamos en editar.html
});

// 📌 Agregar nueva propiedad (index.html)
const propertyForm = document.getElementById("property-form");
if (propertyForm) {
    propertyForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const property = {
            address: document.getElementById("address").value,
            price: document.getElementById("price").value,
            size: document.getElementById("size").value,
            description: document.getElementById("description").value
        };

        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(property)
        });

        propertyForm.reset();
        fetchProperties();
    });
}

// 📌 Obtener propiedades y mostrarlas (index.html)
async function fetchProperties() {
    const response = await fetch(API_URL);
    const properties = await response.json();

    const list = document.getElementById("property-list");
    list.innerHTML = "";

    properties.forEach(prop => {
        const li = document.createElement("li");
        li.innerHTML = `${prop.address} - $${prop.price}, ${prop.size}m² 
            <button onclick="deleteProperty(${prop.id})">Eliminar</button>`;
        list.appendChild(li);
    });
}

// 📌 Eliminar propiedad (index.html)
async function deleteProperty(id) {
    if (confirm("¿Eliminar propiedad?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchProperties();
    }
}

// 📌 Configurar búsqueda (buscar.html)
function setupSearch() {
    document.getElementById("search").addEventListener("input", async () => {
        const searchQuery = document.getElementById("search").value.toLowerCase();

        const response = await fetch(API_URL);
        const properties = await response.json();

        const filteredProperties = properties.filter(prop =>
            prop.address.toLowerCase().includes(searchQuery)
        );

        const list = document.getElementById("search-results");
        list.innerHTML = "";

        filteredProperties.forEach(prop => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${prop.address}</strong> - $${prop.price}, ${prop.size}m²`;
            list.appendChild(li);
        });
    });
}

// 📌 Obtener propiedades para edición (editar.html)
async function fetchEditableProperties() {
    const response = await fetch(API_URL);
    const properties = await response.json();

    const list = document.getElementById("edit-list");
    list.innerHTML = "";

    properties.forEach(prop => {
        const li = document.createElement("li");
        li.innerHTML = `${prop.address} - $${prop.price}, ${prop.size}m²
            <button onclick="fillEditForm(${prop.id}, '${prop.address}', ${prop.price}, ${prop.size}, '${prop.description}')">Editar</button>`;
        list.appendChild(li);
    });
}

// 📌 Llenar formulario de edición (editar.html)
function fillEditForm(id, address, price, size, description) {
    document.getElementById("edit-id").value = id;
    document.getElementById("edit-address").value = address;
    document.getElementById("edit-price").value = price;
    document.getElementById("edit-size").value = size;
    document.getElementById("edit-description").value = description;
}

// 📌 Editar propiedad (editar.html)
const editForm = document.getElementById("edit-form");
if (editForm) {
    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = document.getElementById("edit-id").value;
        const property = {
            address: document.getElementById("edit-address").value,
            price: document.getElementById("edit-price").value,
            size: document.getElementById("edit-size").value,
            description: document.getElementById("edit-description").value
        };

        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(property)
        });

        fetchEditableProperties();
        editForm.reset();
    });
}
