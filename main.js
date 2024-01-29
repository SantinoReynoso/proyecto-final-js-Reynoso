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
        for (const producto of productosEnStock) {
            const li = document.createElement("li");
            li.innerHTML = `<br> Producto ${producto.nombre}<br>
                            Tiene un precio de lista de: $${producto.precio.toFixed(2)}.<br>
                            Cantidad de stock: ${producto.stock}.<br>
                            Proveedor: ${producto.proveedor}<br>`;
            listaProductos.appendChild(li);
        }
    }
    

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
    

    // Función que calcula el precio con IVA y ganancia de todos los productos juntos
    function calcularPrecio() {
        resultado.innerHTML = "";
        for (const producto of productosEnStock) {
            const precioConIVA = producto.precio * 1.21;
            const precioConGanancia = precioConIVA * 1.25;

            const productoInfo = document.createElement("p");
            productoInfo.textContent = `Producto: ${producto.nombre} - Precio de lista: $${producto.precio.toFixed(2)} - Precio con IVA y ganancia: $${precioConGanancia.toFixed(2)}`;

            resultado.appendChild(productoInfo);
        }
    }

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
        actualizarListaProductos();
    }

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

            productoAEditarIndex = productosEnStock.indexOf(productoEncontrado);
        } else {
            mostrarMensajeBusqueda("No se encontró el producto con ese nombre.");
        }
    }

    // Función para guardar los cambios en el producto editado
    function guardarCambiosEdicion() {
        const nuevoNombre = document.getElementById("nuevoNombreProducto").value;
        const nuevoPrecio = document.getElementById("nuevoPrecioProducto").value;

        if (nuevoNombre !== "" && nuevoPrecio !== "" && productoAEditarIndex !== null) {
            // Actualizar los datos del producto
            productosEnStock[productoAEditarIndex].nombre = nuevoNombre;
            productosEnStock[productoAEditarIndex].precio = parseFloat(nuevoPrecio);

            ocultarFormularioEdicionProducto();

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

        // Restablecer la variable
        productoAEditarIndex = null;
    }

    // Función para mostrar mensajes de búsqueda
    function mostrarMensajeBusqueda(mensaje) {
        const mensajeBusqueda = document.getElementById("mensajeBusqueda");
        mensajeBusqueda.textContent = mensaje;
        mensajeBusqueda.style.display = "block";
    }
    // ------------- AREA DE FUNCIONES--------------------



    // Event Listeners
    document.getElementById("btnAgregarProducto").addEventListener("click", function () {
        agregarProducto();
    });

    document.getElementById("btnBuscarYCalcularPrecio").addEventListener("click", function () {
        buscarProductoYCalcularPrecio();
    });

    document.getElementById("btnCalcularPrecio").addEventListener("click", function () {
        calcularPrecio();
    });

    document.getElementById("btnBorrarProductos").addEventListener("click", function () {
        borrarProductos();
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
});
