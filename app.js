function irMateriales(event) {
    if (event) {
        event.stopPropagation();
    }

    alert("Materiales");
}

function irFlores(event) {
    if (event) {
        event.stopPropagation();
    }

    alert("Flores");
}

function irCotizador(event) {

    localStorage.removeItem("seleccionadosCotizador");

    if (event) {
        event.stopPropagation();
    }

    window.location.href = "cotizador.html";
}

function irMateriales(event) {

    if (event) {
        event.stopPropagation();
    }

    window.location.href = "materiales.html";
}


function volverInicio() {

    window.location.href = "index.html";
}


function agregarMaterial() {

    alert("Aquí agregaremos un nuevo material.");
}

function irFlores() {

    window.location.href = "flores.html";

}

function agregarFlor() {

    const modal =
        document.getElementById("modalNuevaFlor");

    if (!modal) {
        return;
    }

    // Limpiar nombre
    const nombre =
        document.getElementById("nombreFlor");

    if (nombre) {
        nombre.value = "";
    }

    // Limpiar fotografía
    const foto =
        document.getElementById("fotoFlor");

    if (foto) {
        foto.value = "";
    }

    // Reiniciar costo
    const costo =
        document.getElementById("costoTotalFlor");

    if (costo) {
        costo.textContent = "S/ 0.00";
    }

    // Cargar nuevamente los materiales
    cargarMaterialesParaFlor();

    // Abrir ventana
    modal.style.display = "flex";
}

function cerrarNuevaFlor() {

    const modal = document.getElementById("modalNuevaFlor");

    if (!modal) {
        return;
    }

    modal.style.display = "none";
}

function cargarMaterialesParaFlor() {

    const lista = document.getElementById("listaMaterialesFlor");

    if (!lista) {
        return;
    }

    const materiales =
        JSON.parse(localStorage.getItem("materiales")) || [];

    lista.innerHTML = "";

    if (materiales.length === 0) {

        lista.innerHTML = `
            <div style="padding:20px; text-align:center;">
                No hay materiales registrados.
            </div>
        `;

        return;
    }

    materiales.forEach((material, index) => {

        const item = document.createElement("div");

        item.className = "material-opcion-flor";

        item.innerHTML = `
            
            <span class="nombre-material-flor">
                ${material.nombre}
            </span>

            <input
                type="number"
                min="0"
                value="0"
                class="cantidad-flor"
                data-index="${index}"
                data-costo="${material.costoUnitario}"
            >

            <span
                class="precio-flor"
                id="precioFlor${index}">
                S/ 0.00
            </span>

        `;

        lista.appendChild(item);
        const cantidadInput = item.querySelector(".cantidad-flor");

cantidadInput.addEventListener("input", function () {

    const cantidad = parseFloat(this.value) || 0;

    const costoUnitario = parseFloat(this.dataset.costo) || 0;

    const precio = cantidad * costoUnitario;

    const precioElemento = item.querySelector(".precio-flor");

    precioElemento.textContent = `S/ ${precio.toFixed(2)}`;
});
    });
}

// =========================================
// NUEVO MATERIAL
// =========================================

function abrirNuevoMaterial() {
    window.location.href = "nuevo-material.html";
}


function cerrarNuevoMaterial() {
    window.location.href = "index.html";
}


// CALCULAR COSTO UNITARIO

function calcularMaterial() {

    const precio = parseFloat(
        document.getElementById("precioMaterial").value
    );

    const cantidad = parseFloat(
        document.getElementById("cantidadMaterial").value
    );

    if (!precio || !cantidad || cantidad <= 0) {

        alert("Ingresa un precio y una cantidad válida.");

        return;
    }

    const costo = precio / cantidad;

    document.getElementById("costoUnitario").textContent =
        "S/ " + costo.toFixed(2);
}


// MOSTRAR IMAGEN

function mostrarImagen(event) {

    const archivo = event.target.files[0];

    if (!archivo) {
        return;
    }

    const lector = new FileReader();

    lector.onload = function(e) {

        document.getElementById("contenedorImagen").innerHTML = `
            <img src="${e.target.result}" alt="Imagen del material">
        `;

    };

    lector.readAsDataURL(archivo);
}

function guardarDatosMaterial(
    nombre,
    precio,
    cantidad,
    costoUnitario,
    imagen
) {

    const materiales =
        JSON.parse(
            localStorage.getItem("materiales")
        ) || [];

    const nuevoMaterial = {

        id: Date.now(),

        nombre: nombre,

        precio: precio,

        cantidad: cantidad,

        costoUnitario: costoUnitario,

        imagen: imagen

    };

    materiales.push(nuevoMaterial);

    try {

        localStorage.setItem(
            "materiales",
            JSON.stringify(materiales)
        );

        // Ir a Mis materiales
        window.location.href = "materiales.html";

    } catch (error) {

        console.error(
            "Error al guardar material:",
            error
        );

        alert(
            "No se pudo guardar el material. " +
            "El almacenamiento del navegador está lleno."
        );
    }
}

// GUARDAR

function guardarMaterial() {

    const nombre =
        document.getElementById("nombreMaterial").value.trim();

    const precio =
        parseFloat(
            document.getElementById("precioMaterial").value
        );

    const cantidad =
        parseFloat(
            document.getElementById("cantidadMaterial").value
        );

    const imagenInput =
        document.getElementById("imagenMaterial");

    // VALIDAR DATOS
    if (!nombre || isNaN(precio) || isNaN(cantidad) || cantidad <= 0) {

        alert("Completa todos los campos correctamente.");

        return;
    }

    const costoUnitario = precio / cantidad;

    const archivo = imagenInput.files[0];

    // =====================================
    // SIN IMAGEN
    // =====================================

    if (!archivo) {

        guardarDatosMaterial(
            nombre,
            precio,
            cantidad,
            costoUnitario,
            ""
        );

        return;
    }

    // =====================================
    // CON IMAGEN
    // =====================================

    const lector = new FileReader();

    lector.onload = function(event) {

        const imagen = new Image();

        imagen.onload = function() {

            // Crear canvas para reducir la imagen
            const canvas =
                document.createElement("canvas");

            const MAXIMO = 400;

            let ancho = imagen.width;
            let alto = imagen.height;

            // Mantener proporción
            if (ancho > alto) {

                if (ancho > MAXIMO) {

                    alto =
                        alto * (MAXIMO / ancho);

                    ancho = MAXIMO;
                }

            } else {

                if (alto > MAXIMO) {

                    ancho =
                        ancho * (MAXIMO / alto);

                    alto = MAXIMO;
                }
            }

            canvas.width = Math.round(ancho);
            canvas.height = Math.round(alto);

            const contexto =
                canvas.getContext("2d");

            contexto.drawImage(
                imagen,
                0,
                0,
                canvas.width,
                canvas.height
            );

            // Comprimir imagen
            const imagenReducida =
                canvas.toDataURL(
                    "image/jpeg",
                    0.60
                );

            // Guardar material
            guardarDatosMaterial(
                nombre,
                precio,
                cantidad,
                costoUnitario,
                imagenReducida
            );

        };

        imagen.onerror = function() {

            alert("No se pudo procesar la imagen.");

        };

        imagen.src = event.target.result;
    };

    lector.onerror = function() {

        alert("No se pudo leer la imagen.");

    };

    lector.readAsDataURL(archivo);
}

function mostrarMateriales() {

    const lista = document.getElementById("listaMateriales");

    if (!lista) {
        return;
    }

    const materiales =
        JSON.parse(localStorage.getItem("materiales")) || [];

    lista.innerHTML = "";

    // Si no hay materiales
    if (materiales.length === 0) {

        lista.innerHTML = `
            <div class="sin-materiales">

                <div class="icono-vacio">📦</div>

                <p>No hay materiales registrados</p>

                <span>Agrega tu primer material</span>

            </div>
        `;

        return;
    }

    // Mostrar cada material
    materiales.forEach((material, index) => {

        const bloque = document.createElement("div");

        bloque.className = "material-card";

        bloque.innerHTML = `

            <div class="material-imagen">

                ${
                    material.imagen
                    ? `<img src="${material.imagen}" alt="${material.nombre}">`
                    : `<div class="imagen-vacia">📦</div>`
                }

            </div>

            <div class="material-info">

                <h3>${material.nombre}</h3>

                <p>
                    Precio: S/ ${Number(material.precio).toFixed(2)}
                </p>

                <p>
                    Cantidad: ${material.cantidad}
                </p>

                <strong>
                    Costo unitario
                </strong>

                <div class="costo-unitario">
                    S/ ${Number(material.costoUnitario).toFixed(2)}
                </div>

            </div>

            <!-- TACHITO -->
            <button
                class="eliminar-material"
                onclick="eliminarMaterial(${index})"
                title="Eliminar material"
            >
                🗑️
            </button>

        `;

        lista.appendChild(bloque);

    });
}

function eliminarMaterial(index) {

    let materiales =
        JSON.parse(localStorage.getItem("materiales")) || [];

    // Confirmación
    const confirmar = confirm(
        "¿Seguro que quieres eliminar este material?"
    );

    if (!confirmar) {
        return;
    }

    // Eliminar solamente el material seleccionado
    materiales.splice(index, 1);

    // Guardar nuevamente
    localStorage.setItem(
        "materiales",
        JSON.stringify(materiales)
    );

    // Actualizar la pantalla
    mostrarMateriales();
}

document.addEventListener("DOMContentLoaded", function() {

    mostrarMateriales();
    mostrarFlores();
    mostrarFloresCotizador();
    mostrarNuevoRamo();

});

function calcularFlor() {

    const precios = document.querySelectorAll(".precio-flor");

    let total = 0;

    precios.forEach(function(precioElemento) {

        const texto = precioElemento.textContent;

        const precio = parseFloat(
            texto.replace("S/", "").trim()
        ) || 0;

        total += precio;
    });

    const resultado = document.getElementById("costoTotalFlor");

    if (resultado) {
        resultado.textContent = `S/ ${total.toFixed(2)}`;
    }
}

function guardarFlor() {

    const nombre =
        document.getElementById("nombreFlor").value.trim();

    const costoTexto =
        document.getElementById("costoTotalFlor").textContent;

    const costoTotal =
        parseFloat(
            costoTexto.replace("S/", "").trim()
        ) || 0;

    const fotoInput =
        document.getElementById("fotoFlor");

    if (!nombre) {
        alert("Escribe el nombre de la flor.");
        return;
    }

    if (costoTotal <= 0) {
        alert("Primero calcula el costo de la flor.");
        return;
    }

    const archivo = fotoInput.files[0];

    // Si NO hay foto
    if (!archivo) {

        guardarDatosFlor(
            nombre,
            costoTotal,
            ""
        );

        return;
    }

    // Si SÍ hay foto
    const lector = new FileReader();

    lector.onload = function(event) {

        const imagen = new Image();

        imagen.onload = function() {

            const canvas = document.createElement("canvas");

            const maximo = 500;

            let ancho = imagen.width;
            let alto = imagen.height;

            if (ancho > alto) {

                if (ancho > maximo) {
                    alto = alto * (maximo / ancho);
                    ancho = maximo;
                }

            } else {

                if (alto > maximo) {
                    ancho = ancho * (maximo / alto);
                    alto = maximo;
                }
            }

            canvas.width = ancho;
            canvas.height = alto;

            const contexto =
                canvas.getContext("2d");

            contexto.drawImage(
                imagen,
                0,
                0,
                ancho,
                alto
            );

            // Convertir la imagen a una versión más liviana
            const fotoReducida =
                canvas.toDataURL(
                    "image/jpeg",
                    0.75
                );

            guardarDatosFlor(
                nombre,
                costoTotal,
                fotoReducida
            );

        };

        imagen.src = event.target.result;
    };

    lector.readAsDataURL(archivo);
}

function guardarDatosFlor(nombre, costoTotal, foto) {

    // Obtener las flores que ya existen
    let flores =
        JSON.parse(localStorage.getItem("flores")) || [];

    // Crear la nueva flor
    const nuevaFlor = {
        id: Date.now(),
        nombre: nombre,
        costoTotal: costoTotal,
        foto: foto
    };

    // Agregarla a la lista
    flores.push(nuevaFlor);

    // Guardarla en el navegador
    localStorage.setItem(
        "flores",
        JSON.stringify(flores)
    );

    // Cerrar la ventana Nueva flor
    cerrarNuevaFlor();

    // Actualizar inmediatamente la lista
    mostrarFlores();
}

function mostrarFlores() {

    const lista = document.getElementById("listaFlores");

    if (!lista) {
        return;
    }

    const flores =
        JSON.parse(localStorage.getItem("flores")) || [];

    lista.innerHTML = "";

    if (flores.length === 0) {

        lista.innerHTML = `
            <div class="sin-materiales">

                <div class="icono-vacio">
                    🌸
                </div>

                <p>No hay flores registradas</p>

                <span>
                    Agrega tu primera flor
                </span>

            </div>
        `;

        return;
    }

    flores.forEach(function(flor, index) {

        const tarjeta = document.createElement("div");

        tarjeta.className = "tarjeta-flor";

        tarjeta.innerHTML = `

            <div class="imagen-flor-tarjeta">

                ${
                    flor.foto
                    ? `<img src="${flor.foto}" alt="${flor.nombre}">`
                    : `<div class="flor-sin-foto">🌸</div>`
                }

            </div>

            <div class="datos-flor">

                <h3>${flor.nombre}</h3>

                <p>
                    S/ ${Number(flor.costoTotal).toFixed(2)}
                </p>

            </div>

            <button
                class="eliminar-flor"
                onclick="eliminarFlor(${index})"
                title="Eliminar flor"
            >
                🗑️
            </button>

        `;

        lista.appendChild(tarjeta);

    });
}

function eliminarFlor(index) {

    let flores =
        JSON.parse(localStorage.getItem("flores")) || [];

    const confirmar = confirm(
        "¿Seguro que quieres eliminar esta flor?"
    );

    if (!confirmar) {
        return;
    }

    flores.splice(index, 1);

    localStorage.setItem(
        "flores",
        JSON.stringify(flores)
    );

    mostrarFlores();
}

function mostrarFloresCotizador() {

    document.getElementById("botonFlores")
    .classList.add("tipo-seleccionado");

document.getElementById("botonMateriales")
    .classList.remove("tipo-seleccionado");

    const seleccionados =
    JSON.parse(
        localStorage.getItem("seleccionadosCotizador")
    ) || [];

    const lista = document.getElementById("listaCotizador");
    const titulo = document.getElementById("tituloListaCotizador");

    if (!lista) {
        return;
    }

    const flores =
        JSON.parse(localStorage.getItem("flores")) || [];

    titulo.textContent = "Selecciona una flor";

    lista.innerHTML = "";

    if (flores.length === 0) {

        lista.innerHTML = `
            <div class="sin-materiales">
                <div class="icono-vacio">🌸</div>
                <p>No hay flores registradas</p>
                <span>Primero agrega una flor</span>
            </div>
        `;

        return;
    }

    flores.forEach(function(flor, index) {

        const tarjeta = document.createElement("div");

        tarjeta.className = "item-cotizador";

        tarjeta.innerHTML = `

            <div class="imagen-item-cotizador">

                ${
                    flor.foto
                    ? `<img src="${flor.foto}" alt="${flor.nombre}">`
                    : `<span>🌸</span>`
                }

            </div>

            <div class="info-item-cotizador">

                <h3>${flor.nombre}</h3>

                <p>
                    Costo: S/
                    ${Number(flor.costoTotal).toFixed(2)}
                </p>

                <p class="cantidad-item">
                   Cantidad: 0
                </p>

                <p class="subtotal-item">
                     Subtotal: S/ 0.00
                </p>

            </div>

            <button
                class="boton-sumar-cotizador"
                onclick="sumarProductoCotizador('flor', ${index})"
            >
                +
            </button>

        `;

        lista.appendChild(tarjeta);

    });
}

function sumarProductoCotizador(tipo, index) {

    const clave = "seleccionadosCotizador";

    let seleccionados =
        JSON.parse(localStorage.getItem(clave)) || [];

    const id = tipo + "_" + index;

    const existente = seleccionados.find(
        producto => producto.id === id
    );

    if (existente) {

        existente.cantidad++;

    } else {

        let productos = [];

        if (tipo === "flor") {

            productos =
                JSON.parse(localStorage.getItem("flores")) || [];

        } else {

            productos =
                JSON.parse(localStorage.getItem("materiales")) || [];

        }

        const producto = productos[index];

        if (!producto) {
            return;
        }

        seleccionados.push({

            id: id,
            tipo: tipo,
            nombre: producto.nombre,

            precio:
                tipo === "flor"
                ? Number(producto.costoTotal)
                : Number(producto.costoUnitario),

            foto:
                tipo === "flor"
                ? producto.foto
                : producto.imagen,

            cantidad: 1
        });
    }

    localStorage.setItem(
        clave,
        JSON.stringify(seleccionados)
    );

    actualizarCantidadesCotizador();
}

function actualizarCantidadesCotizador() {

    const seleccionados =
        JSON.parse(
            localStorage.getItem("seleccionadosCotizador")
        ) || [];

        if (seleccionados.length === 0) {

    const seccionFlores =
        contenedorFlores.closest(".seccion-ramo");

    const seccionMateriales =
        contenedorMateriales.closest(".seccion-ramo");


    if (seccionFlores) {
        seccionFlores.style.display = "none";
    }


    if (seccionMateriales) {
        seccionMateriales.style.display = "none";
    }


    return;
}

    const items =
        document.querySelectorAll(".item-cotizador");

    items.forEach(function(item) {

        const boton =
            item.querySelector(".boton-sumar-cotizador");

        if (!boton) {
            return;
        }

        const onclick =
            boton.getAttribute("onclick");

        const coincidencia =
            onclick.match(/'([^']+)',\s*(\d+)/);

        if (!coincidencia) {
            return;
        }

        const tipo = coincidencia[1];

        const indice =
            Number(coincidencia[2]);

        const id =
            tipo + "_" + indice;

        const producto =
            seleccionados.find(
                item => item.id === id
            );

        const cantidadElemento =
            item.querySelector(".cantidad-item");

        const subtotalElemento =
    item.querySelector(".subtotal-item");

       if (producto) {

    cantidadElemento.textContent =
        "Cantidad: " + producto.cantidad;

    const subtotal =
        producto.precio * producto.cantidad;

    subtotalElemento.textContent =
        "Subtotal: S/ " + subtotal.toFixed(2);

} else {

    cantidadElemento.textContent =
        "Cantidad: 0";

    subtotalElemento.textContent =
        "Subtotal: S/ 0.00";

}

    });
}

calcularTotalCotizador();

function calcularTotalCotizador() {

    const seleccionados =
        JSON.parse(
            localStorage.getItem("seleccionadosCotizador")
        ) || [];

    let total = 0;

    seleccionados.forEach(function(producto) {

        total += producto.precio * producto.cantidad;

    });

    const totalElemento =
        document.getElementById("totalCotizador");

    if (totalElemento) {

        totalElemento.textContent =
            "S/ " + total.toFixed(2);

    }
}

function mostrarMaterialesCotizador() {

    document.getElementById("botonMateriales")
    .classList.add("tipo-seleccionado");

document.getElementById("botonFlores")
    .classList.remove("tipo-seleccionado");

    const lista = document.getElementById("listaCotizador");
    const titulo = document.getElementById("tituloListaCotizador");

    if (!lista) {
        return;
    }

    const materiales =
        JSON.parse(localStorage.getItem("materiales")) || [];

    titulo.textContent = "Selecciona un material";

    lista.innerHTML = "";

    if (materiales.length === 0) {

        lista.innerHTML = `
            <div class="sin-materiales">
                <div class="icono-vacio">📦</div>

                <p>No hay materiales registrados</p>

                <span>
                    Primero agrega un material
                </span>
            </div>
        `;

        return;
    }

    materiales.forEach(function(material, index) {

        const tarjeta = document.createElement("div");

        tarjeta.className = "item-cotizador";

        tarjeta.innerHTML = `

            <div class="imagen-item-cotizador">

                ${
                    material.imagen
                    ? `<img
                        src="${material.imagen}"
                        alt="${material.nombre}">
                      `
                    : `<span>📦</span>`
                }

            </div>

            <div class="info-item-cotizador">

                <h3>${material.nombre}</h3>

                <p>
                    Costo: S/
                    ${Number(material.costoUnitario).toFixed(2)}
                </p>

                <p class="cantidad-item">
                    Cantidad: 0
                </p>

                <p class="subtotal-item">
                  Subtotal: S/ 0.00
                </p>

            </div>

            <button
                class="boton-sumar-cotizador"
                onclick="sumarProductoCotizador('material', ${index})">
                +
            </button>

        `;

        lista.appendChild(tarjeta);

    });

    actualizarCantidadesCotizador();

    document.getElementById("botonMateriales")
        ?.classList.add("tipo-seleccionado");

    document.getElementById("botonFlores")
        ?.classList.remove("tipo-seleccionado");

        document.getElementById("botonFlores")
    ?.classList.add("tipo-seleccionado");

document.getElementById("botonMateriales")
    ?.classList.remove("tipo-seleccionado");
}

function cancelarCotizador() {

    localStorage.removeItem("seleccionadosCotizador");

    window.location.href = "index.html";
}

function guardarCotizacion() {

    const seleccionados =
        JSON.parse(localStorage.getItem("seleccionadosCotizador")) || [];

    if (seleccionados.length === 0) {
        alert("Selecciona al menos una flor o material.");
        return;
    }

    localStorage.setItem(
        "cotizacionActual",
        JSON.stringify(seleccionados)
    );

    window.location.href = "nuevo-ramo.html";
}

// =========================================
// MOSTRAR NUEVO RAMO
// =========================================

function mostrarNuevoRamo() {

    const contenedorFlores =
        document.getElementById("floresSeleccionadas");

    const contenedorMateriales =
        document.getElementById("materialesSeleccionados");

    if (!contenedorFlores || !contenedorMateriales) {
        return;
    }

    const seleccionados =
        JSON.parse(
            localStorage.getItem("seleccionadosCotizador")
        ) || [];

        const mensajeVacio =
    document.getElementById("ramoVacio");

if (mensajeVacio) {

    mensajeVacio.style.display =
        seleccionados.length === 0
        ? "block"
        : "none";
}


    // Limpiar antes de mostrar
    contenedorFlores.innerHTML = "";
    contenedorMateriales.innerHTML = "";


    // =====================================
    // SEPARAR FLORES Y MATERIALES
    // =====================================

    const flores =
        seleccionados.filter(
            producto => producto.tipo === "flor"
        );

    const materiales =
        seleccionados.filter(
            producto => producto.tipo === "material"
        );


    // =====================================
    // MOSTRAR FLORES
    // =====================================

    flores.forEach(function(flor) {

        const subtotal =
            flor.precio * flor.cantidad;

        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "tarjeta-producto-ramo";

        tarjeta.innerHTML = `

            <div class="imagen-producto-ramo">

                ${
                    flor.foto
                    ? `
                        <img
                            src="${flor.foto}"
                            alt="${flor.nombre}"
                        >
                    `
                    : `
                        <span>🌸</span>
                    `
                }

            </div>


            <div class="datos-producto-ramo">

                <h3>
                    ${flor.nombre}
                </h3>

                <p>
                    Cantidad:
                    <strong>${flor.cantidad}</strong>
                </p>

                <strong class="subtotal-producto-ramo">
                    S/ ${subtotal.toFixed(2)}
                </strong>

            </div>


            <div class="controles-producto-ramo">

                <button
                    onclick="disminuirProductoRamo('${flor.id}')"
                >
                    −
                </button>

                <button
                    onclick="sumarProductoRamo('${flor.id}')"
                >
                    +
                </button>

            </div>

        `;

        contenedorFlores.appendChild(tarjeta);

    });


    // =====================================
    // MOSTRAR MATERIALES
    // =====================================

    materiales.forEach(function(material) {

        const subtotal =
            material.precio * material.cantidad;

        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "tarjeta-producto-ramo";

        tarjeta.innerHTML = `

            <div class="imagen-producto-ramo">

                ${
                    material.foto
                    ? `
                        <img
                            src="${material.foto}"
                            alt="${material.nombre}"
                        >
                    `
                    : `
                        <span>📦</span>
                    `
                }

            </div>


            <div class="datos-producto-ramo">

                <h3>
                    ${material.nombre}
                </h3>

                <p>
                    Cantidad:
                    <strong>${material.cantidad}</strong>
                </p>

                <strong class="subtotal-producto-ramo">
                    S/ ${subtotal.toFixed(2)}
                </strong>

            </div>


            <div class="controles-producto-ramo">

                <button
                    onclick="disminuirProductoRamo('${material.id}')"
                >
                    −
                </button>

                <button
                    onclick="sumarProductoRamo('${material.id}')"
                >
                    +
                </button>

            </div>

        `;

        contenedorMateriales.appendChild(tarjeta);

    });


    // =====================================
    // OCULTAR SECCIONES VACÍAS
    // =====================================

    const seccionFlores =
        contenedorFlores.closest(".seccion-ramo");

    const seccionMateriales =
        contenedorMateriales.closest(".seccion-ramo");


    if (seccionFlores) {

        seccionFlores.style.display =
            flores.length > 0
            ? "block"
            : "none";

    }


    if (seccionMateriales) {

        seccionMateriales.style.display =
            materiales.length > 0
            ? "block"
            : "none";

    }


    // Actualizar resumen
    calcularResumenRamo();

}

// =========================================
// SUMAR PRODUCTO EN NUEVO RAMO
// =========================================

function sumarProductoRamo(id) {

    let seleccionados =
        JSON.parse(
            localStorage.getItem("seleccionadosCotizador")
        ) || [];


    const producto =
        seleccionados.find(
            item => item.id === id
        );


    if (!producto) {
        return;
    }


    producto.cantidad++;


    localStorage.setItem(
        "seleccionadosCotizador",
        JSON.stringify(seleccionados)
    );


    mostrarNuevoRamo();

}


// =========================================
// DISMINUIR PRODUCTO EN NUEVO RAMO
// =========================================

function disminuirProductoRamo(id) {

    let seleccionados =
        JSON.parse(
            localStorage.getItem("seleccionadosCotizador")
        ) || [];


    const producto =
        seleccionados.find(
            item => item.id === id
        );


    if (!producto) {
        return;
    }


    // Reducir cantidad
    producto.cantidad--;


    // Si llega a cero, eliminarlo
    if (producto.cantidad <= 0) {

        seleccionados =
            seleccionados.filter(
                item => item.id !== id
            );

    }


    // Guardar cambios
    localStorage.setItem(
        "seleccionadosCotizador",
        JSON.stringify(seleccionados)
    );


    // Actualizar pantalla
    mostrarNuevoRamo();

}

// =========================================
// CALCULAR RESUMEN DEL RAMO
// =========================================

function calcularResumenRamo() {

    const seleccionados =
        JSON.parse(
            localStorage.getItem("seleccionadosCotizador")
        ) || [];


    let subtotalFlores = 0;
    let subtotalMateriales = 0;


    seleccionados.forEach(function(producto) {

        const subtotal =
            Number(producto.precio) *
            Number(producto.cantidad);


        if (producto.tipo === "flor") {

            subtotalFlores += subtotal;

        } else {

            subtotalMateriales += subtotal;

        }

    });


    // Mano de obra
const manoDeObra =
    Number(
        document.getElementById("costoManoObra")?.value
    ) || 0;

    // Costo total
    const costoTotal =
        subtotalFlores +
        subtotalMateriales +
        manoDeObra;


    // Ganancia
    const porcentajeGanancia = 0.40;


    const ganancia =
        costoTotal * porcentajeGanancia;


    // Precio final
    const precioCobrar =
        costoTotal + ganancia;


    // Mostrar flores
    const elementoFlores =
        document.getElementById("subtotalFlores");

    if (elementoFlores) {

        elementoFlores.textContent =
            "S/ " + subtotalFlores.toFixed(2);

    }


    // Mostrar materiales
    const elementoMateriales =
        document.getElementById("subtotalMateriales");

    if (elementoMateriales) {

        elementoMateriales.textContent =
            "S/ " + subtotalMateriales.toFixed(2);

    }


    // Mostrar costo total
    const elementoTotal =
        document.getElementById("costoTotalRamo");

    if (elementoTotal) {

        elementoTotal.textContent =
            "S/ " + costoTotal.toFixed(2);

    }


    // Mostrar precio a cobrar
    const elementoPrecio =
        document.getElementById("precioCobrar");

    if (elementoPrecio) {

        elementoPrecio.textContent =
            "S/ " + precioCobrar.toFixed(2);

    }

}

// =========================================
// CARGAR NUEVO RAMO
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    if (document.getElementById("floresSeleccionadas")) {

        mostrarNuevoRamo();

    }

});


// =========================================
// MOSTRAR NUEVO RAMO
// =========================================

function mostrarNuevoRamo() {

    const flores =
        document.getElementById("floresSeleccionadas");

    const materiales =
        document.getElementById("materialesSeleccionados");

    if (!flores || !materiales) {
        return;
    }


    const seleccionados =
        JSON.parse(
            localStorage.getItem("seleccionadosCotizador")
        ) || [];


    flores.innerHTML = "";
    materiales.innerHTML = "";


    const productosFlores =
        seleccionados.filter(
            producto => producto.tipo === "flor"
        );


    const productosMateriales =
        seleccionados.filter(
            producto => producto.tipo === "material"
        );


    const seccionFlores =
        document.getElementById("seccionFlores");

    const seccionMateriales =
        document.getElementById("seccionMateriales");


    if (seccionFlores) {

        seccionFlores.style.display =
            productosFlores.length > 0
            ? "block"
            : "none";

    }


    if (seccionMateriales) {

        seccionMateriales.style.display =
            productosMateriales.length > 0
            ? "block"
            : "none";

    }


    // FLORES

    productosFlores.forEach(function(flor) {

        const subtotal =
            Number(flor.precio) *
            Number(flor.cantidad);


        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "tarjeta-producto-ramo";


        tarjeta.innerHTML = `

            <div class="imagen-producto-ramo">

                ${
                    flor.foto
                    ? `<img
                            src="${flor.foto}"
                            alt="${flor.nombre}"
                       >`
                    : `<span>🌸</span>`
                }

            </div>


            <div class="datos-producto-ramo">

                <h3>
                    ${flor.nombre}
                </h3>

                <p>
                    Cantidad:
                    <strong>${flor.cantidad}</strong>
                </p>

                <strong class="subtotal-producto-ramo">
                    S/ ${subtotal.toFixed(2)}
                </strong>

            </div>


            <div class="controles-producto-ramo">

                <button
                    onclick="disminuirProductoRamo('${flor.id}')"
                >
                    −
                </button>

                <button
                    onclick="sumarProductoRamo('${flor.id}')"
                >
                    +
                </button>

            </div>

        `;


        flores.appendChild(tarjeta);

    });


    // MATERIALES

    productosMateriales.forEach(function(material) {

        const subtotal =
            Number(material.precio) *
            Number(material.cantidad);


        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "tarjeta-producto-ramo";


        tarjeta.innerHTML = `

            <div class="imagen-producto-ramo">

                ${
                    material.foto
                    ? `<img
                            src="${material.foto}"
                            alt="${material.nombre}"
                       >`
                    : `<span>📦</span>`
                }

            </div>


            <div class="datos-producto-ramo">

                <h3>
                    ${material.nombre}
                </h3>

                <p>
                    Cantidad:
                    <strong>${material.cantidad}</strong>
                </p>

                <strong class="subtotal-producto-ramo">
                    S/ ${subtotal.toFixed(2)}
                </strong>

            </div>


            <div class="controles-producto-ramo">

                <button
                    onclick="disminuirProductoRamo('${material.id}')"
                >
                    −
                </button>

                <button
                    onclick="sumarProductoRamo('${material.id}')"
                >
                    +
                </button>

            </div>

        `;


        materiales.appendChild(tarjeta);

    });


    calcularResumenRamo();

}


// =========================================
// SUMAR
// =========================================

function sumarProductoRamo(id) {

    let seleccionados =
        JSON.parse(
            localStorage.getItem("seleccionadosCotizador")
        ) || [];


    const producto =
        seleccionados.find(
            producto => producto.id === id
        );


    if (!producto) {
        return;
    }


    producto.cantidad++;


    localStorage.setItem(
        "seleccionadosCotizador",
        JSON.stringify(seleccionados)
    );


    mostrarNuevoRamo();

}


// =========================================
// RESTAR
// =========================================

function disminuirProductoRamo(id) {

    let seleccionados =
        JSON.parse(
            localStorage.getItem("seleccionadosCotizador")
        ) || [];


    const producto =
        seleccionados.find(
            producto => producto.id === id
        );


    if (!producto) {
        return;
    }


    producto.cantidad--;


    if (producto.cantidad <= 0) {

        seleccionados =
            seleccionados.filter(
                producto => producto.id !== id
            );

    }


    localStorage.setItem(
        "seleccionadosCotizador",
        JSON.stringify(seleccionados)
    );


    mostrarNuevoRamo();

}


// =========================================
// RESUMEN
// =========================================

function calcularResumenRamo() {

    const seleccionados =
        JSON.parse(
            localStorage.getItem("seleccionadosCotizador")
        ) || [];


    let subtotalFlores = 0;

    let subtotalMateriales = 0;


    seleccionados.forEach(function(producto) {

        const subtotal =
            Number(producto.precio) *
            Number(producto.cantidad);


        if (producto.tipo === "flor") {

            subtotalFlores += subtotal;

        } else {

            subtotalMateriales += subtotal;

        }

    });


    const manoDeObra = 5;


    const costoTotal =
        subtotalFlores +
        subtotalMateriales +
        manoDeObra;



    const floresElemento =
        document.getElementById("subtotalFlores");

    const materialesElemento =
        document.getElementById("subtotalMateriales");

    const totalElemento =
        document.getElementById("costoTotalRamo");

        const manoObraElemento =
    document.getElementById("resumenManoObra");

    const precioElemento =
        document.getElementById("precioCobrar");


    if (floresElemento) {

        floresElemento.textContent =
            "S/ " + subtotalFlores.toFixed(2);

    }

    if (manoObraElemento) {

    manoObraElemento.textContent =
        "S/ " + manoDeObra.toFixed(2);

}


    if (materialesElemento) {

        materialesElemento.textContent =
            "S/ " + subtotalMateriales.toFixed(2);

    }


    if (totalElemento) {

        totalElemento.textContent =
            "S/ " + costoTotal.toFixed(2);

    }


    if (precioElemento) {

        precioElemento.textContent =
            "S/ " + precioCobrar.toFixed(2);

    }

}


// =========================================
// CARGAR NUEVO RAMO
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        if (
            document.getElementById(
                "floresSeleccionadas"
            )
        ) {

            mostrarNuevoRamo();

        }

    }
);

function irANuevoRamo() {

    const seleccionados =
        JSON.parse(
            localStorage.getItem("seleccionadosCotizador")
        ) || [];

    if (seleccionados.length === 0) {

        alert("Selecciona al menos una flor o material.");

        return;
    }

    localStorage.setItem(
        "cotizacionActual",
        JSON.stringify(seleccionados)
    );

    window.location.href = "nuevo-ramo.html";
}

function cotizarRamo() {

    const input =
        document.getElementById("costoManoObra");

    const resumen =
        document.getElementById("resumenManoObra");

    const total =
        document.getElementById("costoTotalRamo");

    const manoObra =
        Number(input.value) || 0;


    const seleccionados =
        JSON.parse(
            localStorage.getItem("seleccionadosCotizador")
        ) || [];


    let subtotalFlores = 0;
    let subtotalMateriales = 0;


    seleccionados.forEach(function(producto) {

        const subtotal =
            Number(producto.precio) *
            Number(producto.cantidad);


        if (producto.tipo === "flor") {

            subtotalFlores += subtotal;

        } else {

            subtotalMateriales += subtotal;

        }

    });


    const costoTotal =
        subtotalFlores +
        subtotalMateriales +
        manoObra;


    resumen.textContent =
        "S/ " + manoObra.toFixed(2);


    total.textContent =
        "S/ " + costoTotal.toFixed(2);
}
// =========================================
// ABRIR VENTANA PARA GUARDAR RAMO
// =========================================

function guardarCotizacionFinal() {

    const seleccionados =
        JSON.parse(
            localStorage.getItem("seleccionadosCotizador")
        ) || [];

    if (seleccionados.length === 0) {

        alert("No hay productos seleccionados.");

        return;
    }

    const modal =
        document.getElementById("modalGuardarRamo");

    const nombre =
        document.getElementById("nombreRamo");

    const foto =
        document.getElementById("fotoRamo");

    const vista =
        document.getElementById("vistaFotoRamo");

    if (!modal) {
        return;
    }

    // Limpiar nombre
    if (nombre) {
        nombre.value = "";
    }

    // Limpiar foto
    if (foto) {
        foto.value = "";
    }

    // Restaurar vista
    if (vista) {
        vista.innerHTML = "🌷";
    }

    // Mostrar costo actual
    const total =
        document.getElementById("costoTotalRamo");

    const totalModal =
        document.getElementById("totalModalRamo");

    if (total && totalModal) {

        totalModal.textContent =
            total.textContent;

    }

    modal.style.display = "flex";
}


// =========================================
// CERRAR MODAL
// =========================================

function cerrarModalGuardarRamo() {

    const modal =
        document.getElementById("modalGuardarRamo");

    if (!modal) {
        return;
    }

    modal.style.display = "none";
}


// =========================================
// MOSTRAR FOTO DEL RAMO
// =========================================

function mostrarFotoRamo(event) {

    const archivo =
        event.target.files[0];

    const vista =
        document.getElementById("vistaFotoRamo");

    if (!archivo || !vista) {
        return;
    }

    const lector =
        new FileReader();

    lector.onload = function(e) {

        vista.innerHTML = `
            <img
                src="${e.target.result}"
                alt="Foto del ramo"
            >
        `;

    };

    lector.readAsDataURL(archivo);
}


// =========================================
// CONFIRMAR GUARDADO DEL RAMO
// =========================================

function confirmarGuardarRamo() {

    const nombreInput =
        document.getElementById("nombreRamo");

    const fotoInput =
        document.getElementById("fotoRamo");

    const nombre =
        nombreInput.value.trim();

    if (!nombre) {

        alert("Escribe un nombre para el ramo.");

        nombreInput.focus();

        return;
    }

    const seleccionados =
        JSON.parse(
            localStorage.getItem("seleccionadosCotizador")
        ) || [];

    if (seleccionados.length === 0) {

        alert("No hay productos seleccionados.");

        return;
    }


    // =====================================
    // CALCULAR TOTALES
    // =====================================

    let subtotalFlores = 0;

    let subtotalMateriales = 0;


    seleccionados.forEach(function(producto) {

        const subtotal =
            Number(producto.precio) *
            Number(producto.cantidad);

        if (producto.tipo === "flor") {

            subtotalFlores += subtotal;

        } else {

            subtotalMateriales += subtotal;

        }

    });


    // Mano de obra actual
    const inputManoObra =
        document.getElementById("costoManoObra");

    const manoDeObra =
        Number(inputManoObra?.value) || 0;


    const costoTotal =
        subtotalFlores +
        subtotalMateriales +
        manoDeObra;


    // =====================================
    // FUNCIÓN PARA GUARDAR
    // =====================================

    function guardarRamoConFoto(foto) {

        let ramos =
            JSON.parse(
                localStorage.getItem("ramos")
            ) || [];


        const nuevoRamo = {

            id: Date.now(),

            nombre: nombre,

            foto: foto,

            productos: seleccionados,

            subtotalFlores:
                subtotalFlores,

            subtotalMateriales:
                subtotalMateriales,

            manoDeObra:
                manoDeObra,

            costoTotal:
                costoTotal,

            fecha:
                new Date().toLocaleString()

        };


        ramos.push(nuevoRamo);


        try {

            localStorage.setItem(
                "ramos",
                JSON.stringify(ramos)
            );

        } catch (error) {

            console.error(
                "Error al guardar ramo:",
                error
            );

            alert(
                "No se pudo guardar el ramo. " +
                "El almacenamiento del navegador está lleno."
            );

            return;
        }


        // Limpiar cotización actual

        localStorage.removeItem(
            "seleccionadosCotizador"
        );

        localStorage.removeItem(
            "cotizacionActual"
        );


        cerrarModalGuardarRamo();


        alert(
            "🌸 Ramo guardado correctamente."
        );


        window.location.href =
            "index.html";

    }


    // =====================================
    // SIN FOTO
    // =====================================

    const archivo =
        fotoInput.files[0];

    if (!archivo) {

        guardarRamoConFoto("");

        return;
    }


    // =====================================
    // CON FOTO
    // =====================================

    const lector =
        new FileReader();


    lector.onload = function(event) {

        const imagen =
            new Image();


        imagen.onload = function() {

            const canvas =
                document.createElement("canvas");

            const MAXIMO = 500;


            let ancho =
                imagen.width;

            let alto =
                imagen.height;


            if (ancho > alto) {

                if (ancho > MAXIMO) {

                    alto =
                        alto * (MAXIMO / ancho);

                    ancho =
                        MAXIMO;
                }

            } else {

                if (alto > MAXIMO) {

                    ancho =
                        ancho * (MAXIMO / alto);

                    alto =
                        MAXIMO;
                }
            }


            canvas.width =
                Math.round(ancho);

            canvas.height =
                Math.round(alto);


            const contexto =
                canvas.getContext("2d");


            contexto.drawImage(
                imagen,
                0,
                0,
                canvas.width,
                canvas.height
            );


            const fotoReducida =
                canvas.toDataURL(
                    "image/jpeg",
                    0.70
                );


            guardarRamoConFoto(
                fotoReducida
            );

        };


        imagen.onerror = function() {

            alert(
                "No se pudo procesar la foto."
            );

        };


        imagen.src =
            event.target.result;

    };


    lector.onerror = function() {

        alert(
            "No se pudo leer la foto."
        );

    };


    lector.readAsDataURL(archivo);

}

// =========================================
// MIS RAMOS
// =========================================

function irMisRamos(event) {

    if (event) {
        event.stopPropagation();
    }

    window.location.href = "mis-ramos.html";

}

// =========================================
// MOSTRAR RAMOS GUARDADOS
// =========================================

function mostrarRamos() {

    const lista =
        document.getElementById("listaRamos");

    if (!lista) {
        return;
    }


    const ramos =
        JSON.parse(
            localStorage.getItem("ramos")
        ) || [];


    lista.innerHTML = "";


    // =====================================
    // NO HAY RAMOS
    // =====================================

    if (ramos.length === 0) {

        lista.innerHTML = `

            <div class="sin-ramos">

                <div class="icono-vacio">
                    🌸
                </div>

                <p>
                    Todavía no tienes ramos guardados.
                </p>

                <span>
                    Crea tu primer ramo y aparecerá aquí.
                </span>

            </div>

        `;

        return;
    }


    // =====================================
    // MOSTRAR RAMOS
    // =====================================

    ramos.forEach(function(ramo, index) {

        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "tarjeta-ramo";


        const cantidadProductos =
            ramo.productos
            ? ramo.productos.length
            : 0;


        tarjeta.innerHTML = `

            <div class="imagen-ramo">

                ${
                    ramo.foto

                    ? `
                        <img
                            src="${ramo.foto}"
                            alt="${ramo.nombre}"
                        >
                    `

                    : `
                        <div class="imagen-ramo-sin-foto">
                            🌸
                        </div>
                    `
                }

            </div>


            <div class="datos-ramo">

                <h3>
                    ${ramo.nombre}
                </h3>


                <p>
                    Productos:
                    ${cantidadProductos}
                </p>


                <p>
                    ${ramo.fecha || ""}
                </p>


                <div class="costo-ramo">

                    S/
                    ${Number(
                        ramo.costoTotal || 0
                    ).toFixed(2)}

                </div>

            </div>


            <button
                class="eliminar-ramo"
                onclick="eliminarRamo(${index})"
                title="Eliminar ramo"
            >
                🗑️
            </button>

        `;


        lista.appendChild(tarjeta);

    });

}


// =========================================
// ELIMINAR RAMO
// =========================================

function eliminarRamo(index) {

    let ramos =
        JSON.parse(
            localStorage.getItem("ramos")
        ) || [];


    const confirmar =
        confirm(
            "¿Seguro que quieres eliminar este ramo?"
        );


    if (!confirmar) {
        return;
    }


    ramos.splice(index, 1);


    localStorage.setItem(
        "ramos",
        JSON.stringify(ramos)
    );


    mostrarRamos();

}


// =========================================
// CARGAR MIS RAMOS
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        mostrarRamos();

    }
);