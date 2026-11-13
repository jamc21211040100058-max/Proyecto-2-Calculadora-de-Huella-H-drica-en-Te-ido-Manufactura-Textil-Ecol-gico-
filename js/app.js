/**
 * Clase que representa un lote de tela dentro del proceso de teñido.
 * Aplicamos Programación Orientada a Objetos (POO) para encapsular propiedades y cálculos.
 */
class LoteTela {
    constructor(id, tipoFibra, kilogramos) {
        this.id = id;
        this.tipoFibra = tipoFibra;
        this.kilogramos = parseFloat(kilogramos);
    }

    calcularAgua() {
        if (this.tipoFibra.toLowerCase() === "algodon") {
            return this.kilogramos * 10000;
        } else if (this.tipoFibra.toLowerCase() === "poliester") {
            return this.kilogramos * 300;
        }
        return 0;
    }
}
// CAPTURA DE ELEMENTOS DEL DOM (Interfaz HTML)
const inputFibra = document.getElementById("tipoFibra");
const inputKg = document.getElementById("kilosTela");
const btn = document.getElementById("btnCalcular");
const lista = document.getElementById("historialLotes");
const totalConsumo = document.getElementById("aguaTotal");

// EVENTOS PRINCIPALES
// Al terminar de cargar el HTML, recupera y muestra los lotes guardados previamente
document.addEventListener("DOMContentLoaded", cargarLotes);
btn.addEventListener("click", agregarLote);

// FUNCIONES DE LÓGICA Y PERSISTENCIA (LocalStorage)
/**
 * Valida los datos ingresados, genera un ID automático, instancia el objeto LoteTela,
 * lo guarda en localStorage y actualiza la vista.
 */
function agregarLote() {
    const fibra = inputFibra.value.trim();
    const kg = inputKg.value.trim();

    if (kg === "" || isNaN(kg) || Number(kg) <= 0) {
        return alert("Por favor ingresa una cantidad válida de kilogramos");
    }

    const lotes = obtenerLotes();
    
    // Generamos un ID automático secuencial (ej. LOTE-1, LOTE-2, etc.) basándonos en la cantidad de elementos
    const idGenerado = "LOTE-" + (lotes.length + 1);

    // Instanciamos la clase pasando el ID automático, la fibra y los kilos
    const nuevoLote = new LoteTela(idGenerado, fibra, kg);
    
    lotes.push(nuevoLote);
    localStorage.setItem("lotesTeñido", JSON.stringify(lotes));
    
    mostrarLotes();
    inputKg.value = "";
}

/**
 * Recupera el historial de lotes almacenados en el navegador.
 * Arreglo de objetos con los datos de los lotes, o arreglo vacío si no hay datos.
 */
function obtenerLotes() {
    const datos = localStorage.getItem("lotesTeñido");
    // JSON.parse convierte la cadena de texto almacenada de vuelta a un arreglo de JavaScript
    return datos ? JSON.parse(datos) : [];
}

/**
 * Renderiza la lista de lotes en el DOM, aplica alertas visuales si se supera el límite
 * ecológico y actualiza el contador total acumulado de agua.
 */
function mostrarLotes() {
    const lotes = obtenerLotes();
    lista.innerHTML = "";
    let acumuladoTotal = 0;

    lotes.forEach((loteData, index) => {
        // Reconstruimos el objeto utilizando el ID que ya venía guardado
        const lote = new LoteTela(loteData.id, loteData.tipoFibra, loteData.kilogramos);
        const aguaConsumida = lote.calcularAgua();
        acumuladoTotal += aguaConsumida;

        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        
        const esAlerta = aguaConsumida > 50000;
        if (esAlerta) {
            li.style.backgroundColor = "#ffdddd";
            li.style.color = "#000";
        }

        // Visualizamos el ID generado junto con los demás datos en la pantalla
        li.innerHTML = `<span>ID: <strong>${lote.id}</strong> | Fibra: <strong>${lote.tipoFibra.toUpperCase()}</strong> | ${lote.kilogramos}kg | Agua: <strong>${aguaConsumida}L</strong> ${esAlerta ? '⚠️ [ALERTA]' : ''}</span>`;
        
        // Creamos el botón individual para eliminar este registro
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "❌";
        btnEliminar.className = "btn btn-sm btn-danger";
        btnEliminar.onclick = function() {
            eliminarLote(index);
        };
        // Añadimos el botón al <li> y el <li> a la lista <ul> en el DOM
        li.appendChild(btnEliminar);
        lista.appendChild(li);
    });

    // Actualizamos el texto del total acumulado en el DOM con separadores de miles
    totalConsumo.textContent = acumuladoTotal.toLocaleString();
}

/**
 * Elimina un lote específico según su posición (índice) y actualiza el localStorage.
 * Si no quedan elementos, limpia por completo la clave en localStorage.
 * index - Posición del lote dentro del arreglo.
 */
function eliminarLote(index) {
    const lotes = obtenerLotes();
    // Remueve 1 elemento en la posición 'index'
    lotes.splice(index, 1);

    // Si el arreglo quedó vacío, eliminamos la llave del navegador; si no, guardamos el resto
    if (lotes.length === 0) {
        localStorage.removeItem("lotesTeñido");
    } else {
        localStorage.setItem("lotesTeñido", JSON.stringify(lotes));
    }

    mostrarLotes();
}

function cargarLotes() {
    mostrarLotes();
}