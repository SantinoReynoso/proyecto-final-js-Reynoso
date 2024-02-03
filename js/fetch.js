//  Prueba Fetch

// Función para cargar los datos del archivo JSON
function cargarProductosDesdeJSON() {
    // Ruta del archivo JSON
    const rutaJSON = './datos/datos.json';

    // Hacer una solicitud para obtener los datos del archivo JSON
    fetch(rutaJSON)
        .then(response => {
            // Verificar si la solicitud fue exitosa
            if (!response.ok) {
                throw new Error('Ocurrió un error al cargar los datos.');
            }
            // Convertir la respuesta a formato JSON
            return response.json();
        })
        .then(data => {
            // Verificar si se recibieron datos válidos
            if (!data || data.length === 0) {
                throw new Error('No se encontraron datos en el archivo.');
            }
            // Agregar los productos al arreglo productosEnStock
            productosEnStock = data;
            actualizarListaProductos();
            // Mostrar un Sweet Alert indicando que los productos se cargaron correctamente
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Datos de la dietetica cargados exitosamente",
                showConfirmButton: false,
                timer: 1500
              });
        })
        .catch(error => {
            // Mostrar un Sweet Alert indicando que ocurrió un error al cargar los productos
            Swal.fire({
                title: "¡Error!",
                text: error.message,
                icon: "error"
            });
        });
}
