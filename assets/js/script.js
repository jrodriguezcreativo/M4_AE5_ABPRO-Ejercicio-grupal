// Referencias a elementos HTML
const formBusqueda = document.getElementById("formBusqueda");
const inputAutor = document.getElementById("inputAutor");
const contenedorResultados = document.getElementById("contenedorResultados");
const contadorResultados = document.getElementById("contadorResultados");

// Función principal que realiza la búsqueda en la API
async function buscarLibrosPorAutor(autor) {
  try {
    // URL de la API con el autor ingresado
    const url = `https://openlibrary.org/search.json?author=${autor}`;

    // Hacer la petición y esperar la respuesta
    const respuesta = await fetch(url);

    // Verificar que la respuesta sea correcta
    if (!respuesta.ok) {
      throw new Error("Error en la respuesta de la API");
    }

    // Convertir la respuesta a formato JSON
    const datos = await respuesta.json();

    return datos; // Retornar los datos para ser procesados
  } catch (error) {
    // En caso de error, relanzarlo para que se maneje fuera
    throw error;
  }
}

// Función para mostrar los resultados en pantalla
function mostrarResultados(datos) {
  const docs = datos.docs;
  const total = datos.numFound;

  // Mostrar contador con total de resultados encontrados
  contadorResultados.textContent = `Total de resultados: ${total}`;

  // Si no hay resultados, mostrar mensaje y salir
  if (docs.length === 0) {
    contenedorResultados.innerHTML = `
      <p class="text-center text-warning">
        No se encontraron resultados para esa búsqueda.
      </p>`;
    return;
  }

  // Obtener los primeros 10 libros o menos si hay menos de 10
  const primerosDiez = docs.slice(0, 10);

  // Crear el HTML para mostrar cada libro con título, año y autores
  const htmlLibros = primerosDiez.map(libro => {
    const titulo = libro.title ? libro.title : "Título no disponible";
    const año = libro.first_publish_year ? libro.first_publish_year : "Año no disponible";
    const autores = libro.author_name ? libro.author_name.join(", ") : "Autor(es) no disponible(s)";

    return `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${titulo}</h5>
          <p class="card-text"><strong>Año:</strong> ${año}</p>
          <p class="card-text"><strong>Autor(es):</strong> ${autores}</p>
        </div>
      </div>
    `;
  }).join("");

  // Insertar el HTML generado en el contenedor de resultados
  contenedorResultados.innerHTML = htmlLibros;
}

// Función para mostrar mensajes de error en pantalla
function mostrarError(mensaje) {
  // Limpiar contador y mostrar mensaje de error centrado y en rojo
  contadorResultados.textContent = "";
  contenedorResultados.innerHTML = `
    <p class="text-center text-danger">${mensaje}</p>
  `;
}

// Evento submit del formulario para controlar la búsqueda
formBusqueda.addEventListener("submit", async function(event) {
  event.preventDefault(); // Evitar que la página recargue

  // Leer y limpiar el texto ingresado en el input
  const autor = inputAutor.value.trim();

  // Validar que el campo no esté vacío
  if (!autor) {
    alert("Por favor ingresa un nombre de autor");
    return;
  }

  // Mostrar mensaje de carga mientras esperamos la respuesta
  contenedorResultados.innerHTML = `
    <p class="text-center">Cargando resultados...</p>
  `;
  contadorResultados.textContent = "";

  try {
    // Llamar a la función que consulta la API y esperar datos
    const datos = await buscarLibrosPorAutor(autor);

    // Mostrar los resultados en pantalla
    mostrarResultados(datos);
  } catch (error) {
    // En caso de error, mostrar mensaje amigable
    mostrarError("Error al buscar libros. Intenta nuevamente más tarde.");
    console.error("Error en fetch:", error);
  }
});
