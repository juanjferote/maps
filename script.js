let map;

var ubicacionesLeon = [
    { nombre: "Catedral de León", coords: [42.59943637274811, -5.567163096813226], icono: "images/iglesia.png" },
    { nombre: "Plaza del Grano", coords: [42.595410928145235, -5.568417560127307], icono: "images/plaza.png" },
    { nombre: "Estadio Reino de León", coords: [42.5875316570269, -5.5765973750251305], icono: "images/estadio.png" },
    { nombre: "MUSAC", coords: [42.606945228487135, -5.582963732549703], icono: "images/museo.png" }
];

var ubicacionesDublin = [
    { nombre: "Saint Patrick's Cathedral", coords: [53.339338551876864, -6.271477488352375], icono: "images/iglesia.png" },
    { nombre: "Guinness Storehouse", coords: [53.341660844013205, -6.286729584797648], icono: "images/museo.png" },
    { nombre: "Merrion Square", coords: [53.339671465695965, -6.249214863875289], icono: "images/plaza.png" },
    { nombre: "Aviva Stadium", coords: [53.33519217208558, -6.228356503200634], icono: "images/estadio.png" }
];

var ubicacionesBogota = [
    { nombre: "Monserrate", coords: [4.6056709346216635, -74.05552546529547], icono: "images/iglesia.png" },
    { nombre: "Plaza de Bolívar", coords: [4.59811900018886, -74.07604544272148], icono: "images/plaza.png" },
    { nombre: "Estadio El Campín", coords: [4.648237724469841, -74.07628800506689], icono: "images/estadio.png" },
    { nombre: "Museo de Botero", coords: [4.596695656004228, -74.07335097552621], icono: "images/museo.png" }
];

var ubicacionesVarsovia = [
    { nombre: "Katedra Metropolitalna Św. Marii Magdaleny - Metropolitan Cathedral St. Mary Magdalene", coords: [52.25487833532197, 21.033264855624385], icono: "images/iglesia.png" },
    { nombre: "Plac Zamkowy - Market Square", coords: [52.247745035089174, 21.013782596728497], icono: "images/plaza.png" },
    { nombre: "PGE Narodowy Warszawy - National Stadium of Warsaw", coords: [52.239255266681354, 21.045336537832334], icono: "images/estadio.png" },
    { nombre: "Muzeum Fryderyka Chopina - Museum of Fryderyk Chopin", coords: [52.2365384064863, 21.02293318515884], icono: "images/museo.png" }
];

var ubicacionesTokio = [
    { nombre: "浅草寺 - Senso-ji Temple", coords: [35.71476207814363, 139.79665596635758], icono: "images/iglesia.png" },
    { nombre: "渋谷スクランブル交差点 - Shibuya Scramble Crossing", coords: [35.659480065727514, 139.70055825469848], icono: "images/plaza.png" },
    { nombre: "国立競技場 - National Stadium of Japan", coords: [35.67782271085561, 139.71454156635596], icono: "images/estadio.png" },
    { nombre: "国立博物館 - National Museum of Tokio", coords: [35.71883262271108, 139.77652149580555], icono: "images/museo.png" }
];

function procesarXML(url) {

    // Obtener el archivo XML y procesarlo
    fetch(url)
        .then(response => response.text())  // Leer el XML como texto
        .then(xmlString => {
            // Usar DOMParser para convertir el XML en un objeto Document
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "application/xml");

            // El espacio de nombres del XML
            const namespace = "http://www.w3.org/2003/01/geo/wgs84_pos#"; 

            // Obtener elementos 'geo:lat', 'geo:long' y 'title'
            const latitudes = xmlDoc.getElementsByTagNameNS(namespace, "lat");
            const longitudes = xmlDoc.getElementsByTagNameNS(namespace, "long");
            const titles = xmlDoc.getElementsByTagName("title");

            // Eliminar marcadores anteriores
            if (window.terremotosMarkers) {
                window.terremotosMarkers.forEach(marker => marker.setMap(null));
                window.terremotosMarkers = [];
            }

            // Iterar sobre los elementos para agregar marcadores
            for (let i = 0; i < latitudes.length; i++) {
                const latitud = parseFloat(latitudes[i].textContent);
                const longitud = parseFloat(longitudes[i].textContent);

                // Obtener el contenido del título
                const titleText = titles[i] ? titles[i].textContent : "";

                // Comprobar si el título tiene el formato esperado
                if (titleText.includes("-Info.terremoto:")) {
                    // Extraer la fecha y hora
                    const dateText = titleText.split(':')[1]?.trim();  // Obtener la fecha y hora después de ":"
                    
                    if (dateText) {
                        const day = parseInt(dateText.split(' ')[0].split('/')[0]);

                        // Determinar el icono basado en la quincena
                        let iconUrl;
                        if (day <= 15) {
                            iconUrl = "images/terremoto_quincena1.webp";  // Primer quincena
                        } else {
                            iconUrl = "images/terremoto_quincena2.webp";  // Segunda quincena
                        }

                        // Crear el marcador
                        const marker = new google.maps.Marker({
                            position: { lat: latitud, lng: longitud },
                            map: map,
                            icon: {
                                url: iconUrl,
                                scaledSize: new google.maps.Size(32, 32)
                            }
                        });

                        // Guardar el marcador en el array
                        window.terremotosMarkers.push(marker);
                    } else {
                        console.error("No se pudo extraer la fecha correctamente de titleText:", titleText);
                    }
                } else {
                    console.error("Formato de titleText no esperado:", titleText);
                }
            }
        })
        .catch(error => {
            console.error("Error al cargar el archivo XML:", error);
        });
}


function cargarCapitales() {
    fetch('capitales.xml')
        .then(response => response.text())
        .then(str => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(str, 'application/xml');
            const ciudades = xmlDoc.getElementsByTagName('City');

            for (let i = 0; i < ciudades.length; i++) {
                const ciudad = ciudades[i];
                const nombre = ciudad.getElementsByTagName('Name')[0].textContent;
                const pais = ciudad.getElementsByTagName('Country')[0].textContent;
                const latitud = parseFloat(ciudad.getElementsByTagName('Latitude')[0].textContent);
                const longitud = parseFloat(ciudad.getElementsByTagName('Longitude')[0].textContent);

                const marker = new google.maps.Marker({
                    position: { lat: latitud, lng: longitud },
                    map: map,
                    title: `${nombre}, ${pais}`,
                    icon: {
                        url: 'images/punto.webp',
                        scaledSize: new google.maps.Size(32, 32)
                    },
                    visible: false // Ocultar por defecto
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `<strong>${nombre}, ${pais}</strong>`
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });
                
                // Guardar el marcador en un array para poder mostrarlo/ocultarlo después
                if (!window.marcadoresLugaresVisitados) {
                    window.marcadoresLugaresVisitados = [];
                }
                window.marcadoresLugaresVisitados.push(marker);
            }
        })
        .catch(error => console.error("Error al cargar capitales:", error));
}


// Función para actualizar la leyenda
function actualizarLeyenda() {
    const contenido = document.getElementById('contenido-leyenda');
    contenido.innerHTML = ''; // Limpiar contenido anterior

    // Definir los tipos de lugares con sus imágenes locales
    const tiposLugares = [
        { tipo: 'Plazas', icono: 'images/plaza2.webp' },
        { tipo: 'Monumentos Religiosos', icono: 'images/iglesia2.webp' },
        { tipo: 'Estadios', icono: 'images/estadio2.webp' },
        { tipo: 'Museos', icono: 'images/museo2.webp' },
        { tipo: 'Marcador', icono: 'images/mapa2.webp' },
        { tipo: 'Lugar Visitado', icono: 'images/punto.webp' },
        { tipo: 'Movimientos sísmicos primera quincena', icono: 'images/terremoto_quincena1.webp' },
        { tipo: 'Movimientos sísmicos segunda quincena', icono: 'images/terremoto_quincena2.webp' } 
    ];

    // Añadir cada tipo a la leyenda
    tiposLugares.forEach(tipo => {
        const item = document.createElement('div');
        item.className = 'item-leyenda';
        item.innerHTML = `
            <img src="${tipo.icono}" alt="${tipo.tipo}" class="icono-leyenda">
            <span>${tipo.tipo}</span>
        `;
        contenido.appendChild(item);
    });
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Eliminar notificaciones anteriores
    const notificacionesAnteriores = document.querySelectorAll('.notificacion');
    notificacionesAnteriores.forEach(notif => notif.remove());
    
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.textContent = mensaje;
    
    // Agregar al documento
    document.body.appendChild(notificacion);
    
    // Mostrar con animación
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 10);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

function mostrarError(mensaje) {
    mostrarNotificacion(mensaje, 'error');
}

function mostrarExito(mensaje) {
    mostrarNotificacion(mensaje, 'exito');
}

// Función para alternar la visibilidad de la leyenda
function toggleLeyenda() {
    const leyenda = document.getElementById('leyenda');
    const boton = document.getElementById('toggleLeyenda');
    
    // Si está oculto, mostrarlo
    if (leyenda.classList.contains('leyenda-oculta')) {
        leyenda.classList.remove('leyenda-oculta');
        leyenda.classList.add('leyenda-visible');
        boton.textContent = 'Ocultar Leyenda';
    } else {
        // Si está visible, ocultarlo
        leyenda.classList.remove('leyenda-visible');
        leyenda.classList.add('leyenda-oculta');
        boton.textContent = 'Mostrar Leyenda';
    }
}

// Función para limpiar marcadores de búsqueda
function limpiarBusqueda() {
    if (window.busquedaMarker) {
        window.busquedaMarker.setMap(null);
        window.busquedaMarker = null;
    }
}

const iconosCategoria = {
    plaza: 'images/plaza.png',
    iglesia: 'images/iglesia.png',
    estadio: 'images/estadio.png',
    museo: 'images/museo.png',
    punto: 'images/punto.png',
    marcador: 'images/mapa.png', // predeterminado
    '': 'images/mapa.png' // por si acaso
};

// Añade este objeto global para guardar los marcadores personalizados por dirección
window.marcadoresPersonalizados = {};

// Modifica la función agregarMarcadorPersonalizado:
function agregarMarcadorPersonalizado(ubicacion, esPersonalizado = true, iconoPersonalizado = null) {
    // Elimina el marcador anterior de esta dirección si existe
    if (esPersonalizado && window.marcadoresPersonalizados) {
        const clave = ubicacion.nombre.trim().toLowerCase();
        if (window.marcadoresPersonalizados[clave]) {
            window.marcadoresPersonalizados[clave].setMap(null);
            delete window.marcadoresPersonalizados[clave];
        }
    }

    const marker = new google.maps.Marker({
        position: { lat: ubicacion.coords[0], lng: ubicacion.coords[1] },
        map: map,
        title: ubicacion.nombre,
        icon: {
            url: iconoPersonalizado || (esPersonalizado ? 'images/mapa.png' : ubicacion.icono),
            scaledSize: new google.maps.Size(32, 32)
        }
    });

    // Crear ventana de información
    const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>${ubicacion.nombre}</strong>${esPersonalizado ? '<br>Ubicación personalizada' : ''}</div>`
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });

    if (!window.markers) window.markers = [];
    window.markers.push(marker);

    // Guarda el marcador personalizado por dirección
    if (esPersonalizado && window.marcadoresPersonalizados) {
        const clave = ubicacion.nombre.trim().toLowerCase();
        window.marcadoresPersonalizados[clave] = marker;
    }

    return marker;
}

function initMap() {
    // Inicializar el mapa
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 40.4165, lng: -3.70256 },
        zoom: 8,
        styles: [
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{"visibility": "off"}]
            }
        ]
    });
        
    cargarCapitales();

    // Asegurarse de que el formulario empiece centrado
    document.body.classList.remove('city-selected', 'search-performed');

    // Configurar el evento del botón de la leyenda
    const toggleBtn = document.getElementById('toggleLeyenda');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleLeyenda);
    }
    
    // Inicializar el historial de direcciones desde localStorage
    let historialDirecciones = JSON.parse(localStorage.getItem('historialDirecciones')) || [];
    const historialContainer = document.getElementById('historialDirecciones');
    const listaDirecciones = document.getElementById('listaDirecciones');
    const toggleHistorialBtn = document.getElementById('toggleHistorial');
    let historialVisible = false;

    // Añadir array para marcadores de historial
    window.historialMarkers = [];
    
    // Variable para rastrear si los marcadores de lugares visitados están visibles
    let lugaresVisitadosVisibles = false;
    
    // Configurar el evento del botón de lugares visitados
    const toggleLugaresBtn = document.getElementById('toggleLugaresVisitados');
    if (toggleLugaresBtn) {
        toggleLugaresBtn.addEventListener('click', function() {
            // Mover el formulario a la esquina superior izquierda
            document.body.classList.add('search-performed');
            
            // Alternar la visibilidad
            lugaresVisitadosVisibles = !lugaresVisitadosVisibles;
            
            // Mostrar u ocultar los marcadores de lugares visitados
            if (window.marcadoresLugaresVisitados) {
                window.marcadoresLugaresVisitados.forEach(marker => {
                    marker.setVisible(lugaresVisitadosVisibles);
                });
            }
            
            // Actualizar el texto del botón
            toggleLugaresBtn.textContent = lugaresVisitadosVisibles ? 
                'Ocultar Lugares Visitados' : 'Mostrar Lugares Visitados';
        });
    }

    // Función para actualizar la visualización del historial
    function actualizarHistorial() {
        listaDirecciones.innerHTML = '';

        // Eliminar marcadores de historial anteriores
        if (window.historialMarkers) {
            window.historialMarkers.forEach(m => m.setMap(null));
            window.historialMarkers = [];
        }

        // Mostrar mensaje si no hay direcciones
        if (historialDirecciones.length === 0) {
            const mensaje = document.createElement('div');
            document.getElementById("borrarHistorial").style.display = "none"
            mensaje.className = 'sin-resultados';
            mensaje.textContent = 'No hay direcciones guardadas';
            listaDirecciones.appendChild(mensaje);
            return;
        }
        else {
            document.getElementById("borrarHistorial").style.display = "block"
        }

        historialDirecciones.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = item.direccion;
            li.dataset.index = index;

            // Usa el icono de la categoría guardada
            const icono = iconosCategoria[item.categoria || 'marcador'];

            const marker = new google.maps.Marker({
                position: item.coordenadas,
                map: map,
                title: item.direccion,
                icon: {
                    url: icono,
                    scaledSize: new google.maps.Size(32, 32)
                }
            });

            window.historialMarkers.push(marker);

            const span = document.createElement('span');
            span.className = 'borrar-direccion';
            span.innerHTML = '&times;';
            span.onclick = (e) => {
                e.stopPropagation();
                eliminarDelHistorial(index);
            };

            li.appendChild(span);

            // Al hacer clic en una dirección del historial
            li.onclick = () => {
                const direccion = item.direccion;
                const direccionInput = document.getElementById('direccion');
                direccionInput.value = direccion;

                document.body.classList.add('search-performed');
                document.body.classList.add('city-selected');

                map.setCenter(item.coordenadas);

                if (window.markers) {
                    window.markers.forEach(marker => marker.setMap(null));
                    window.markers = [];
                }

                agregarMarcadorPersonalizado({
                    nombre: direccion,
                    coords: [item.coordenadas.lat, item.coordenadas.lng]
                }, true, icono);

                mostrarExito(`Ubicación cargada: ${direccion}`);
            };

            listaDirecciones.appendChild(li);
        });  


    }

    // Función para eliminar una dirección del historial (solo una)
    function eliminarDelHistorial(index) {
        // Obtener la dirección que se va a eliminar
        const direccionAEliminar = historialDirecciones[index];
        
        // Eliminar el marcador del array de marcadores de historial si existe
        if (window.historialMarkers && window.historialMarkers[index]) {
            window.historialMarkers[index].setMap(null);
            window.historialMarkers.splice(index, 1);
        }
        
        // Función para comparar posiciones con cierta tolerancia
        const posicionesIguales = (pos1, pos2) => {
            const precision = 0.000001; // Tolerancia para comparación de coordenadas
            return Math.abs(pos1.lat - pos2.lat) < precision && 
                   Math.abs(pos1.lng - pos2.lng) < precision;
        };
        
        // Eliminar cualquier marcador que coincida con las coordenadas (de cualquier tipo)
        if (window.markers) {
            // Crear una copia del array para poder modificarlo mientras iteramos
            const marcadoresAEliminar = [];
            
            // Primero identificar los marcadores a eliminar
            window.markers.forEach((marker, i) => {
                const pos = marker.getPosition();
                if (pos && pos.lat && pos.lng) {
                    const posMarcador = { lat: pos.lat(), lng: pos.lng() };
                    if (posicionesIguales(posMarcador, direccionAEliminar.coordenadas)) {
                        marcadoresAEliminar.push(i);
                    }
                }
            });
            
            // Eliminar los marcadores en orden inverso para no afectar los índices
            marcadoresAEliminar.sort((a, b) => b - a).forEach(i => {
                if (window.markers[i]) {
                    window.markers[i].setMap(null);
                    window.markers.splice(i, 1);
                }
            });
        }
        
        // Eliminar la dirección del historial
        historialDirecciones.splice(index, 1);
        localStorage.setItem('historialDirecciones', JSON.stringify(historialDirecciones));
        
        // Actualizar la vista del historial
        actualizarHistorial();
    }

    //Función que elimina todas las direcciones del historial
    function borrarHistorial() {
       document.querySelectorAll('img').forEach(img => {
            if (img.src.toLowerCase().endsWith('.png')) {
                img.remove();
            }
        });
        historialDirecciones.splice(0, historialDirecciones.length);
        localStorage.setItem('historialDirecciones', JSON.stringify(historialDirecciones));
        actualizarHistorial();
    }

    // Cambia la función para agregar al historial:
    function agregarAlHistorial(direccion, coordenadas, categoria) {
        // Busca si ya existe la dirección (ignorando mayúsculas/minúsculas)
        const index = historialDirecciones.findIndex(item =>
            item.direccion.toLowerCase() === direccion.toLowerCase()
        );

        if (index !== -1) {
            // Si existe, actualiza la categoría y coordenadas
            historialDirecciones[index].categoria = categoria;
            historialDirecciones[index].coordenadas = coordenadas;
            historialDirecciones[index].fecha = new Date().toISOString();
        } else {
            // Si no existe, añade nueva
            historialDirecciones.unshift({
                direccion: direccion,
                coordenadas: coordenadas,
                categoria: categoria,
                fecha: new Date().toISOString()
            });

            // Mantener solo las últimas 10 búsquedas
            if (historialDirecciones.length > 10) {
                historialDirecciones = historialDirecciones.slice(0, 10);
            }
        }

        localStorage.setItem('historialDirecciones', JSON.stringify(historialDirecciones));
        actualizarHistorial();
    }

    // Toggle para mostrar/ocultar el historial
    toggleHistorialBtn.addEventListener('click', () => {
        historialVisible = !historialVisible;
        if (historialVisible) {
            historialContainer.style.display = 'block';
            toggleHistorialBtn.textContent = 'Ocultar';
            actualizarHistorial();
        } else {
            historialContainer.style.display = 'none';
            toggleHistorialBtn.textContent = 'Historial';
        }
    });

    //Botón que elimina todas las búsquedas del historial
    document.getElementById("borrarHistorial").addEventListener("click", function() {
        borrarHistorial();
    });

    // mostrar/ocultar terremotos
    const toggleTerremotosBtn = document.getElementById('toggleTerremotos');
    let terremotosVisible = false;
    let terremotosLayer = null;
    window.terremotosMarkers = [];  // Array para almacenar los marcadores de terremotos

    toggleTerremotosBtn.addEventListener('click', () => {
        const url = "https://www.ign.es/ign/RssTools/sismologia.xml";  
        terremotosVisible = !terremotosVisible;
        
        if (terremotosVisible) {
            // Si se está mostrando, procesar el XML para mostrar los terremotos
            procesarXML(url);
            toggleTerremotosBtn.textContent = 'Ocultar Movimientos Sísmicos';
        } else {
            // Si se está ocultando, eliminar los marcadores de terremotos
            if (window.terremotosMarkers) {
                window.terremotosMarkers.forEach(marker => {
                    if (marker) {
                        marker.setMap(null);
                    }
                });
                window.terremotosMarkers = [];
            }
            toggleTerremotosBtn.textContent = 'Mostrar Movimientos Sísmicos';
        }
        
        // Mover el formulario a la esquina superior izquierda
        document.body.classList.add('search-performed');
        document.body.classList.add('city-selected');
    });

    // Modifica el evento del botón buscar para pasar la categoría:
    document.getElementById("buscarDireccion").addEventListener("click", function() {
        const direccion = document.getElementById('direccion').value;
        const categoria = document.getElementById('categoria').value || 'marcador';
        obtenerCoordenadas(direccion, categoria);
    });

    // Modifica obtenerCoordenadas para aceptar la categoría:
    function obtenerCoordenadas(direccion, categoria) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}&addressdetails=1&limit=1&lang=es`;

        // Mostrar indicador de carga
        const buscarBtn = document.getElementById('buscarDireccion');
        const originalText = buscarBtn.innerHTML;
        buscarBtn.disabled = true;
        buscarBtn.innerHTML = '<span class="spinner"></span> Buscando...';
        
        fetch(url, {
            headers: {
                "User-Agent": "MapApp/1.0 (contacto@tudominio.com)"
            }
        })
            .then(response => response.json())
            .then(data => {
                // Restaurar el botón
                buscarBtn.disabled = false;
                buscarBtn.innerHTML = originalText;
                
                if (data && data.length > 0) {
                    // Obtener las coordenadas (latitud y longitud) de la primera ubicación
                    const lat = parseFloat(data[0].lat);
                    const lng = parseFloat(data[0].lon);
    
                    // Centrar el mapa en las coordenadas obtenidas
                    map.setCenter({ lat, lng });
                    
                    // Mover el formulario a la esquina superior izquierda
                    document.body.classList.add('search-performed');
                    document.body.classList.add('city-selected');
    
                    // Añadir marcador en la ubicación obtenida
                    agregarMarcadorPersonalizado(
                        { nombre: direccion, coords: [lat, lng] },
                        true,
                        iconosCategoria[categoria]
                    );
                    
                    // Guardar la dirección, coordenadas y categoría en el historial (actualiza si ya existe)
                    agregarAlHistorial(direccion, { lat, lng }, categoria);
                    
                    // Mostrar notificación de éxito
                    mostrarExito('Ubicación encontrada y guardada en el historial');
                } else {
                    // Si no se encuentran resultados
                    mostrarError("No se encontraron resultados para la dirección ingresada.");
                }
            })
            .catch(error => {
                // Restaurar el botón en caso de error
                buscarBtn.disabled = false;
                buscarBtn.innerHTML = originalText;
                
                // Manejo de errores en caso de que falle la solicitud
                console.error("Error al obtener la geolocalización:", error);
                mostrarError("Hubo un problema al realizar la búsqueda.");
            });
    }

    // Cargar la leyenda inicialmente (pero mantenerla oculta)
    actualizarLeyenda()

    document.getElementById("ciudad").addEventListener('change', function() {
        const ciudad = document.getElementById("ciudad").value;
        document.body.classList.add('city-selected');
        var ciudadSeleccionada;
        let lugaresInteres = [];
        

        window.markers = [];
        
        switch (ciudad) {
            case "leon":
                ciudadSeleccionada = { lat: 42.60002, lng: -5.57032 };
                lugaresInteres = ubicacionesLeon;
                map.setZoom(15);
                break; 
            case "dublin":
                ciudadSeleccionada = { lat: 53.3498, lng: -6.2603 };
                lugaresInteres = ubicacionesDublin;
                map.setZoom(13);
                break;
            case "bogota":
                ciudadSeleccionada = { lat: 4.7110, lng: -74.0721 };
                lugaresInteres = ubicacionesBogota;
                map.setZoom(12);
                break;
            case "varsovia":
                ciudadSeleccionada = { lat: 52.2297, lng: 21.0122 };
                lugaresInteres = ubicacionesVarsovia;
                map.setZoom(13);
                break;
            case "tokio":
                ciudadSeleccionada = { lat: 35.6895, lng: 139.6917 };
                lugaresInteres = ubicacionesTokio;
                map.setZoom(11);
                break;
        }
        
        // Crear marcadores
        lugaresInteres.forEach(ubicacion => {
            agregarMarcadorPersonalizado(ubicacion, false);
        });

        map.panTo(ciudadSeleccionada);
    
    });
}