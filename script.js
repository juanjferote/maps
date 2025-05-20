let map;

var ubicacionesLeon = [
    { nombre: "Catedral de León", coords: [42.599444, -5.566667], icono: "images/iglesia.png" },
    { nombre: "Plaza del Grano", coords: [42.598444, -5.570722], icono: "images/plaza.png" },
    { nombre: "Estadio Reino de León", coords: [42.5875, -5.5767], icono: "images/estadio.png" },
    { nombre: "MUSAC", coords: [42.603333, -5.586944], icono: "images/museo.png" }
];

var ubicacionesDublin = [
    { nombre: "Saint Patrick's Cathedral", coords: [53.3395, -6.2722], icono: "images/iglesia.png" },
    { nombre: "Guinness Storehouse", coords: [53.34185, -6.28674], icono: "images/museo.png" },
    { nombre: "Merrion Square", coords: [53.339657, -6.249165], icono: "images/plaza.png" },
    { nombre: "Aviva Stadium", coords: [53.335139, -6.228333], icono: "images/estadio.png" }
];

var ubicacionesBogota = [
    { nombre: "Monserrate", coords: [4.606378566303521, -74.05558987301566], icono: "images/iglesia.png" },
    { nombre: "Plaza de Bolívar", coords: [4.5981923872131, -74.07543613370576], icono: "images/plaza.png" },
    { nombre: "Estadio El Campín", coords: [4.645725805590935, -74.07779746254174], icono: "images/estadio.png" },
    { nombre: "Museo de Botero", coords: [4.596984589060866, -74.07332663788708], icono: "images/museo.png" }
];

var ubicacionesVarsovia = [
    { nombre: "Cathedral St. Mary Magdalene", coords: [52.25481, 21.03324], icono: "images/iglesia.png" },
    { nombre: "Historical center", coords: [52.231838, 21.006592], icono: "images/plaza.png" },
    { nombre: "National Stadium of Warsaw", coords: [52.239403952169766, 21.04532875473575], icono: "images/estadio.png" },
    { nombre: "Museum of Fryderyk Chopin", coords: [52.23662508685545, 21.022837937296977], icono: "images/museo.png" }
];

var ubicacionesTokio = [
    { nombre: "Senso-ji Temple", coords: [35.714765, 139.796655], icono: "images/iglesia.png" },
    { nombre: "Shibuya Scramble Crossing", coords: [35.6595, 139.7006], icono: "images/plaza.png" },
    { nombre: "Olimpic Stadium of Tokio", coords: [35.6785, 139.7141], icono: "images/estadio.png" },
    { nombre: "National Museum of Tokio", coords: [35.7188, 139.7766], icono: "images/museo.png" }
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

// Función para alternar la visibilidad de la leyenda
function toggleLeyenda() {
    const leyenda = document.getElementById('leyenda');
    const boton = document.getElementById('toggleLeyenda');
    
    // Si está oculto, mostrarlo
    if (leyenda.classList.contains('leyenda-oculta')) {
        leyenda.classList.remove('leyenda-oculta');
        leyenda.classList.add('leyenda-visible');
        boton.textContent = 'Ocultar Leyenda';
        // Asegurarse de que la leyenda tenga contenido
        if (document.getElementById('contenido-leyenda').children.length === 0) {
            actualizarLeyenda();
        }
    } else {
        // Si está visible, ocultarlo
        leyenda.classList.remove('leyenda-visible');
        leyenda.classList.add('leyenda-oculta');
        boton.textContent = 'Mostrar Leyenda';
    }
}

function initMap() {
    // Inicializar el mapa
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 40.4165, lng: -3.70256 },
        zoom: 8,
    });

    // Configurar el evento del botón de la leyenda
    const toggleBtn = document.getElementById('toggleLeyenda');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleLeyenda);
    }
    
    // Cargar la leyenda inicialmente (pero mantenerla oculta)
    actualizarLeyenda();

    document.getElementById("ciudad").addEventListener('change', function() {
        const ciudad = document.getElementById("ciudad").value;
        document.body.classList.add('city-selected');
        var ciudadSeleccionada;
        let lugaresInteres = [];
        
        // Limpiar marcadores anteriores
        if (window.markers) {
            window.markers.forEach(marker => marker.setMap(null));
        }
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
                map.setZoom(8);
                break;
        }
        
        // Crear marcadores
        lugaresInteres.forEach(ubicacion => {
            const marker = new google.maps.Marker({
                position: { lat: ubicacion.coords[0], lng: ubicacion.coords[1] },
                map: map,
                title: ubicacion.nombre,
                icon: {
                    url: ubicacion.icono,
                    scaledSize: new google.maps.Size(32, 32)
                }
            });
            window.markers.push(marker);
        });
        
        // Actualizar la leyenda
        actualizarLeyenda();
        
        // Mover el mapa a la ubicación seleccionada
        map.panTo(ciudadSeleccionada);
        
        // Mostrar la leyenda automáticamente al seleccionar una ciudad
        const leyenda = document.getElementById('leyenda');
        if (leyenda.classList.contains('leyenda-oculta')) {
            toggleLeyenda();
        }
    });
    map.panTo(ciudadSeleccionada);
    map.setZoom(10)
}