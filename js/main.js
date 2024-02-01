document.addEventListener("DOMContentLoaded", function () {
    // Variables
    const listaProductos = document.getElementById("listaProductos");
    const resultado = document.getElementById("resultado");
    let productosEnStock = [];
    let productoAEditarIndex = null; // Variable para almacenar el índice del producto que se está editando

    // Cargar productos almacenados en localStorage al iniciar la página
    if (localStorage.getItem("productosEnStock")) {
        productosEnStock = JSON.parse(localStorage.getItem("productosEnStock"));
        actualizarListaProductos();
    }

    // ------------- AREA DE FUNCIONES--------------------

    // Función que actualiza la lista de productos en la página web
    function actualizarListaProductos() {
        listaProductos.innerHTML = "";
        const maxProductosPorPagina = 5;
        const totalProductos = productosEnStock.length;
        const numPaginas = Math.ceil(totalProductos / maxProductosPorPagina);

        for (let pagina = 0; pagina < numPaginas; pagina++) {
            const startIndex = pagina * maxProductosPorPagina;
            const endIndex = Math.min(startIndex + maxProductosPorPagina, totalProductos);
            const paginaProductos = productosEnStock.slice(startIndex, endIndex);

            const paginaLista = document.createElement("div");
            paginaLista.classList.add("pagina-lista");

            for (const producto of paginaProductos) {
                const li = document.createElement("li");
                li.innerHTML = `<br> - PRODUCTO: ${producto.nombre}<br>
                                - PRECIO LISTA: $${producto.precio.toFixed(2)}.<br>
                                - CANTIDAD DE STOCK: ${producto.stock}.<br>
                                - PROVEEDOR: ${producto.proveedor}<br>
                                _____________________________________`;
                paginaLista.appendChild(li);
            }

            listaProductos.appendChild(paginaLista);
        }

        if (numPaginas > 1) {
            agregarBarraNavegacion(numPaginas);
        }
    }

    // Función para agregar la barra de navegación
    function agregarBarraNavegacion(numPaginas) {
        const barraNavegacion = document.createElement("div");
        barraNavegacion.classList.add("barra-navegacion");

        for (let i = 0; i < numPaginas; i++) {
            const botonPagina = document.createElement("button");
            botonPagina.textContent = i + 1;
            botonPagina.addEventListener("click", function() {
                mostrarPagina(i);
            });
            barraNavegacion.appendChild(botonPagina);
        }

        listaProductos.appendChild(barraNavegacion);
    }

    // Función para mostrar la página seleccionada
    function mostrarPagina(pagina) {
        const paginas = document.querySelectorAll(".pagina-lista");
        paginas.forEach((paginaLista, index) => {
            if (index === pagina) {
                paginaLista.style.display = "block";
            } else {
                paginaLista.style.display = "none";
            }
        });
    }

    // Función que ordena en base al selector
    function ordenarProductos() {
        const selectOrden = document.getElementById("sort-select");
        const opcionSeleccionada = selectOrden.value;

        switch (opcionSeleccionada) {
            case "default":
                // Orden predeterminado: el último producto agregado primero
                productosEnStock.reverse();
                break;
            case "price-desc":
                // Precio: Alto a Bajo
                productosEnStock.sort((a, b) => b.precio - a.precio);
                break;
            case "price-asc":
                // Precio: Bajo a Alto
                productosEnStock.sort((a, b) => a.precio - b.precio);
                break;
            case "title-asc":
                // Nombre: A-Z
                productosEnStock.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            default:
                // Orden predeterminado si no se selecciona ninguna opción válida
                productosEnStock.reverse();
                break;
        }

        // Actualizar la lista de productos con el nuevo orden
        actualizarListaProductos();
    }

    // Event listener para el cambio en el selector de orden
    document.getElementById("sort-select").addEventListener("change", function () {
        ordenarProductos();
    });

    // Función que agrega un producto al stock y lo guarda en localStorage
    function agregarProducto() {
        const nombreProducto = document.getElementById("nombreProducto").value;
        const precioProducto = document.getElementById("precioProducto").value;
        const stockProducto = document.getElementById("stockProducto").value;
        const proveedorProducto = document.getElementById("proveedorProducto").value;

        // Valido que no estén vacíos los campos
        if (nombreProducto !== "" && precioProducto !== "" && stockProducto !== "" && proveedorProducto !== "") {
            const nuevoProducto = {
                nombre: nombreProducto,
                precio: parseFloat(precioProducto),
                stock: parseInt(stockProducto),
                proveedor: proveedorProducto
            };
            productosEnStock.push(nuevoProducto);
            // Guardar productos en localStorage
            localStorage.setItem("productosEnStock", JSON.stringify(productosEnStock));
            actualizarListaProductos();
        }
    }

    // Función para calcular el precio con IVA y ganancia de todos los productos juntos
    function calcularPrecio() {
        resultado.innerHTML = "";
        for (const producto of productosEnStock) {
            const precioConIVA = producto.precio * 1.21;
            const precioConGanancia = precioConIVA * 1.25;

            const productoInfo = document.createElement("p");
            productoInfo.textContent = `Producto: ${producto.nombre} (PROVEEDOR: ${producto.proveedor}) - Precio de lista: $${producto.precio.toFixed(2)} - Precio con IVA y ganancia: $${precioConGanancia.toFixed(2)}`;

            resultado.appendChild(productoInfo);
        }
    }

    // Función para calcular la ganancia total de todos los productos
function calcularGananciaTotal() {
    let gananciaTotal = 0;
    for (const producto of productosEnStock) {
        const precioConIVA = producto.precio * 1.21;
        const precioConGanancia = precioConIVA * 1.25;
        const gananciaProducto = precioConGanancia - precioConIVA;
        gananciaTotal += gananciaProducto;
    }
    return gananciaTotal;
}
// Event listener para el botón "Calcular ganancia"
document.getElementById("btnCalcularGanancia").addEventListener("click", function () {
    const gananciaTotal = calcularGananciaTotal();
    const cantidadProductos = productosEnStock.length;
    resultado.innerHTML = `La cantida de productos - ${cantidadProductos} - genera una ganancia de $${gananciaTotal.toFixed(2)}`;
});

// Función para calcular el valor neto de cada producto
function calcularValorNeto() {
    resultado.innerHTML = ""; // Limpiar el contenido anterior del resultado

    for (const producto of productosEnStock) {
        const valorNeto = producto.precio * producto.stock;

        const productoInfo = document.createElement("p");
        productoInfo.textContent = `El producto "${producto.nombre}" suma el valor neto de $${valorNeto.toFixed(2)}`;
        
        resultado.appendChild(productoInfo);
    }
}

// Event listener para el botón "Calcular valor neto"
document.getElementById("btnCalcularValorNeto").addEventListener("click", function () {
    calcularValorNeto();
});


    // Función para calcular en base al nombre del producto que quieras
    function buscarProductoYCalcularPrecio() {
        const nombreBusqueda = document.getElementById("nombreBusqueda").value;
        const productoEncontrado = productosEnStock.find(producto => producto.nombre === nombreBusqueda);

        if (productoEncontrado) {
            const precioConIVA = productoEncontrado.precio * 1.21;
            const precioConGanancia = precioConIVA * 1.25;
            resultado.textContent = `El precio de ${productoEncontrado.nombre} con IVA y ganancia es: $${precioConGanancia.toFixed(2)}`;
        } else {
            resultado.textContent = "Ningún producto tiene ese nombre.";
        }
    }

    // Función que borra todos los productos del stock y actualiza la lista y guarda en localStorage
    function borrarProductos() {
        // Borra todos los productos del stock
        productosEnStock = [];
        // Actualiza la lista y guarda en localStorage
        localStorage.setItem("productosEnStock", JSON.stringify(productosEnStock));
        actualizarListaProductos(); // Agregamos esta línea para actualizar la lista de productos en la página
    }

    // Event Listener para el botón de borrar productos
    document.getElementById("btnBorrarProductos").addEventListener("click", function () {
        borrarProductos();
    });
// Función para mostrar el formulario de búsqueda y edición de producto
function mostrarFormularioBusquedaEdicion() {
    const formularioBusquedaEdicion = document.getElementById("formularioBusquedaEdicion");
    formularioBusquedaEdicion.style.display = "block";
}

// Función para ocultar el formulario de búsqueda y edición de producto
function ocultarFormularioBusquedaEdicion() {
    const formularioBusquedaEdicion = document.getElementById("formularioBusquedaEdicion");
    formularioBusquedaEdicion.style.display = "none";

    document.getElementById("nombreBusquedaEdicion").value = "";
}

// Función para abrir el formulario de edición de producto
function abrirFormularioEdicionProducto() {
    const formularioEdicionProducto = document.getElementById("formularioEdicionProducto");
    formularioEdicionProducto.style.display = "block";
}

// Función para buscar un producto por nombre y mostrar el formulario de edición si se encuentra
function buscarYMostrarFormularioEdicion() {
    const nombreBusquedaEdicion = document.getElementById("nombreBusquedaEdicion").value;
    const productoEncontrado = productosEnStock.find(producto => producto.nombre === nombreBusquedaEdicion);

    if (productoEncontrado) {
        abrirFormularioEdicionProducto();

        document.getElementById("nombreBusquedaEdicion").value = "";

        document.getElementById("nuevoNombreProducto").value = productoEncontrado.nombre;
        document.getElementById("nuevoPrecioProducto").value = productoEncontrado.precio;
        document.getElementById("nuevoStockProducto").value = productoEncontrado.stock;
        document.getElementById("nuevoProveedorProducto").value = productoEncontrado.proveedor;

        productoAEditarIndex = productosEnStock.indexOf(productoEncontrado);
    } else {
        mostrarMensajeBusqueda("No se encontró el producto con ese nombre.");
    }
}

// Función para guardar los cambios en el producto editado
function guardarCambiosEdicion() {
    const nuevoNombre = document.getElementById("nuevoNombreProducto").value;
    const nuevoPrecio = document.getElementById("nuevoPrecioProducto").value;
    const nuevoStock = document.getElementById("nuevoStockProducto").value;
    const nuevoProveedor = document.getElementById("nuevoProveedorProducto").value;

    if (nuevoNombre !== "" && nuevoPrecio !== "" && nuevoStock !== "" && nuevoProveedor !== "" && productoAEditarIndex !== null) {
        // Actualizar los datos del producto
        productosEnStock[productoAEditarIndex].nombre = nuevoNombre;
        productosEnStock[productoAEditarIndex].precio = parseFloat(nuevoPrecio);
        productosEnStock[productoAEditarIndex].stock = parseInt(nuevoStock);
        productosEnStock[productoAEditarIndex].proveedor = nuevoProveedor;

        ocultarFormularioEdicionProducto();

        // Ocultar también el formulario de búsqueda y edición
        ocultarFormularioBusquedaEdicion();

        // Actualizar la lista y guardar en localStorage
        localStorage.setItem("productosEnStock", JSON.stringify(productosEnStock));
        actualizarListaProductos();
    } else {
        mostrarMensajeBusqueda("Por favor, completa todos los campos.");
    }
}


// Función para ocultar el formulario de edición de producto
function ocultarFormularioEdicionProducto() {
    const formularioEdicionProducto = document.getElementById("formularioEdicionProducto");
    formularioEdicionProducto.style.display = "none";

    document.getElementById("nuevoNombreProducto").value = "";
    document.getElementById("nuevoPrecioProducto").value = "";
    document.getElementById("nuevoStockProducto").value = "";
    document.getElementById("nuevoProveedorProducto").value = "";

    // Restablecer la variable
    productoAEditarIndex = null;
}
    // Función para mostrar mensajes de búsqueda
    function mostrarMensajeBusqueda(mensaje) {
        const mensajeBusqueda = document.getElementById("mensajeBusqueda");
        mensajeBusqueda.textContent = mensaje;
        mensajeBusqueda.style.display = "block";
    }

    // Obtener referencia al botón de ordenar
    const botonOrdenar = document.querySelector('.sort-by button');

    // ------------- AREA DE FUNCIONES--------------------

    // Agregar event listener para el clic en el botón de ordenar
    botonOrdenar.addEventListener('click', function() {
        ordenarProductos();
    });

    // Event Listeners
    document.getElementById("btnBuscarYCalcularPrecio").addEventListener("click", function () {
        buscarProductoYCalcularPrecio();
    });

    document.getElementById("btnCalcularPrecio").addEventListener("click", function () {
        calcularPrecio();
    });

    //  PARA mostrar el formulario de búsqueda y edición
    document.getElementById("btnMostrarFormularioBusqueda").addEventListener("click", function () {
        mostrarFormularioBusquedaEdicion();
    });

    //  PARA ocultar el formulario de búsqueda y edición
    document.getElementById("btnOcultarFormularioEdicion").addEventListener("click", function () {
        ocultarFormularioBusquedaEdicion();
    });

    //  ESCUCHA el botón "Buscar y Editar" en el formulario de búsqueda y edición
    document.getElementById("btnBuscarYEditar").addEventListener("click", function () {
        buscarYMostrarFormularioEdicion();
    });

    //  ESCUCHA el botón "Guardar Cambios" en el formulario de edición
    document.getElementById("btnGuardarCambios").addEventListener("click", function () {
        guardarCambiosEdicion();
    });

    //  Event listener para el cambio en el selector de orden
    document.getElementById("sort-select").addEventListener("change", function () {
        ordenarProductos();
    });

    //  ESCUCHA el clic en el botón de agregar producto
    document.getElementById("btnAgregarProducto").addEventListener("click", function () {
        agregarProducto();
    });
});
