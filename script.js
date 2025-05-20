let map;

var ubicacionesLeon = [
    { nombre: "Catedral de León", coords: [42.59961991423942, -5.567098829782704], icono: "images/iglesia.png" },
    { nombre: "Plaza del Grano", coords: [42.595410928145235, -5.568417560127307], icono: "images/plaza.png" },
    { nombre: "Estadio Reino de León", coords: [42.58761353667463, -5.576583561587189], icono: "images/estadio.png" },
    { nombre: "MUSAC", coords: [42.60697440040134, -5.582962423965287], icono: "images/museo.png" }
];

var ubicacionesDublin = [
    { nombre: "Saint Patrick's Cathedral", coords: [53.33948016760186, -6.27153570859381], icono: "images/iglesia.png" },
    { nombre: "Guinness Storehouse", coords: [53.34177997504533, -6.286731593408915], icono: "images/museo.png" },
    { nombre: "Merrion Square", coords: [53.33981668237985, -6.249176212197022], icono: "images/plaza.png" },
    { nombre: "Aviva Stadium", coords: [53.33533654684124, -6.22836186455478], icono: "images/estadio.png" }
];

var ubicacionesBogota = [
    { nombre: "Monserrate", coords: [4.606699126924952, -74.05513964042271], icono: "images/iglesia.png" },
    { nombre: "Plaza de Bolívar", coords: [4.59816067597575, -74.07599749207081], icono: "images/plaza.png" },
    { nombre: "Estadio El Campín", coords: [4.645822047844, -74.07781891890838], icono: "images/estadio.png" },
    { nombre: "Museo de Botero", coords: [4.59672752857818, -74.07327300667124], icono: "images/museo.png" }
];

var ubicacionesVarsovia = [
    { nombre: "Katedra Metropolitalna Św. Marii Magdaleny - Metropolitan Cathedral St. Mary Magdalene", coords: [52.25501443674027, 21.033250106658432], icono: "images/iglesia.png" },
    { nombre: "Plac Zamkowy - Market Square", coords: [52.247894295777876, 21.01379869311569], icono: "images/plaza.png" },
    { nombre: "PGE Narodowy Warszawy - National Stadium of Warsaw", coords: [52.23936059137798, 21.04528155342873], icono: "images/estadio.png" },
    { nombre: "Muzeum Fryderyka Chopina - Museum of Fryderyk Chopin", coords: [52.236631584877316, 21.023127604089623], icono: "images/museo.png" }
];

var ubicacionesTokio = [
    { nombre: "浅草寺 - Senso-ji Temple", coords: [35.71485960866646, 139.79669760223402], icono: "images/iglesia.png" },
    { nombre: "渋谷スクランブル交差点 - Shibuya Scramble Crossing", coords: [35.65963888089483, 139.70064542764422], icono: "images/plaza.png" },
    { nombre: "国立競技場 - National Stadium of Japan", coords: [35.67801580529732, 139.71455162579443], icono: "images/estadio.png" },
    { nombre: "国立博物館 - National Museum of Tokio", coords: [35.719009285435135, 139.777347617316], icono: "images/museo.png" }
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
                map.setZoom(11);
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