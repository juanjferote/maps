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


// Función para actualizar la leyenda
function actualizarLeyenda() {
    const contenido = document.getElementById('contenido-leyenda');
    contenido.innerHTML = ''; // Limpiar contenido anterior
    
    // Definir los tipos de lugares con sus imágenes locales
    const tiposLugares = [
        { tipo: 'Plazas', icono: 'images/plaza.png' },
        { tipo: 'Monumentos Religiosos', icono: 'images/iglesia.png' },
        { tipo: 'Estadios', icono: 'images/estadio.png' },
        { tipo: 'Museos', icono: 'images/museo.png' }
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

// Función para agregar un marcador personalizado
function agregarMarcadorPersonalizado(ubicacion, esPersonalizado = true) {
    const marker = new google.maps.Marker({
        position: { lat: ubicacion.coords[0], lng: ubicacion.coords[1] },
        map: map,
        title: ubicacion.nombre,
        icon: {
            url: esPersonalizado ? 'images/star.png' : ubicacion.icono,
            scaledSize: new google.maps.Size(32, 32)
        }
    });
    
    // Crear ventana de información
    const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>${ubicacion.nombre}</strong>${esPersonalizado ? '<br>Ubicación personalizada' : ''}</div>`
    });
    
    // Mostrar infoWindow al hacer clic
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
    
    if (!window.markers) window.markers = [];
    window.markers.push(marker);
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

    // Función para actualizar la visualización del historial
    function actualizarHistorial() {
        listaDirecciones.innerHTML = '';
        
        // Mostrar mensaje si no hay direcciones
        if (historialDirecciones.length === 0) {
            const mensaje = document.createElement('div');
            mensaje.className = 'sin-resultados';
            mensaje.textContent = 'No hay direcciones guardadas';
            listaDirecciones.appendChild(mensaje);
            return;
        }
        
        historialDirecciones.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = item.direccion;
            li.dataset.index = index;
            
            // Añadir botón de eliminar al lado de la ubi
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
                
                // Mover el formulario a la esquina
                document.body.classList.add('search-performed');
                document.body.classList.add('city-selected');
                
                // Usar las coordenadas guardadas en lugar de hacer una nueva búsqueda
                map.setCenter(item.coordenadas);
                
                // Limpiar marcadores anteriores
                if (window.markers) {
                    window.markers.forEach(marker => marker.setMap(null));
                    window.markers = [];
                }
                
                // Agregar el marcador de la dirección seleccionada
                agregarMarcadorPersonalizado({ 
                    nombre: direccion, 
                    coords: [item.coordenadas.lat, item.coordenadas.lng] 
                });
                
                // Mostrar notificación
                mostrarExito(`Ubicación cargada: ${direccion}`);
            };
            
            listaDirecciones.appendChild(li);
        });
    }

    // Función para eliminar una dirección del historial ( solo una)
    function eliminarDelHistorial(index) {
        historialDirecciones.splice(index, 1);
        localStorage.setItem('historialDirecciones', JSON.stringify(historialDirecciones));
        actualizarHistorial();
    }

    // Función para agregar una dirección al historial
    function agregarAlHistorial(direccion, coordenadas) {
        // Verificar si ya existe en el historial
        const existe = historialDirecciones.some(item => 
            item.direccion.toLowerCase() === direccion.toLowerCase()
        );
        
        if (!existe) {
            historialDirecciones.unshift({
                direccion: direccion,
                coordenadas: coordenadas,
                fecha: new Date().toISOString()
            });
            
            // Mantener solo las últimas 10 búsquedas
            if (historialDirecciones.length > 10) {
                historialDirecciones = historialDirecciones.slice(0, 10);
            }
            
            localStorage.setItem('historialDirecciones', JSON.stringify(historialDirecciones));
            actualizarHistorial();
        }
    }

    // Toggle para mostrar/ocultar el historial
    toggleHistorialBtn.addEventListener('click', () => {
        historialVisible = !historialVisible;
        if (historialVisible) {
            historialContainer.style.display = 'block';
            toggleHistorialBtn.textContent = 'Ocultar historial de direcciones';
            actualizarHistorial();
        } else {
            historialContainer.style.display = 'none';
            toggleHistorialBtn.textContent = 'Ver historial de direcciones';
        }
    });

    // Función que busca una dirección y obtiene sus coordenadas cuando se pulsa el botón
    document.getElementById("buscarDireccion").addEventListener("click", function() {
        const direccion = document.getElementById('direccion').value.trim();
        const ciudad = document.getElementById('ciudad').value;
        
        if (!ciudad && !direccion) {
            mostrarError('Por favor, selecciona una ciudad o ingresa una dirección para buscar.');
            return;
        }
        
        if (direccion) {
            obtenerCoordenadas(direccion);
        }
    });

    function obtenerCoordenadas(direccion) {
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
                    agregarMarcadorPersonalizado({ nombre: direccion, coords: [lat, lng] });
                    
                    // Guardar la dirección en el historial
                    agregarAlHistorial(direccion, { lat, lng });
                    
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
        
        // Actualizar la leyenda
        actualizarLeyenda();
        
         map.panTo(ciudadSeleccionada);
    
    });
}