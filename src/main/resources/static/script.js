document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("property-form");
    const propertyList = document.getElementById("property-list");

    // ✅ Enviar datos al backend
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita que la página se recargue

        const propertyData = {
            address: document.getElementById("address").value,
            price: parseFloat(document.getElementById("price").value),
            size: parseFloat(document.getElementById("size").value),
            description: document.getElementById("description").value
        };

        try {
            const response = await fetch("http://localhost:8080/properties", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(propertyData)
            });

            if (!response.ok) throw new Error("Error en la respuesta del servidor");

            const newProperty = await response.json();
            console.log("Propiedad agregada:", newProperty);

            // ✅ Volver a cargar la lista de propiedades
            loadProperties();
            form.reset(); // Limpiar formulario
        } catch (error) {
            console.error("Error al agregar la propiedad:", error);
        }
    });

    // ✅ Obtener y mostrar la lista de propiedades
    async function loadProperties() {
        try {
            const response = await fetch("http://localhost:8080/properties");
            if (!response.ok) throw new Error("Error al obtener datos");

            const properties = await response.json();
            propertyList.innerHTML = ""; // Limpiar lista antes de agregar nuevos datos

            properties.forEach((property) => {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${property.address}</strong> - $${property.price} - ${property.size}m² <br> ${property.description}`;
                propertyList.appendChild(li);
            });
        } catch (error) {
            console.error("Error al cargar las propiedades:", error);
        }
    }

    // ✅ Cargar propiedades al inicio
    loadProperties();
});
