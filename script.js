let map;

function emojiUrl(unicodeHex) {
    return `https://twemoji.maxcdn.com/v/latest/72x72/${unicodeHex}.png`;
}

var ubicacionesLeon = [
    { nombre: "Catedral de León", coords: [42.599444, -5.566667], icono: "⛪" },
    { nombre: "Plaza del Grano", coords: [42.598444, -5.570722], icono: "🏰" },
    { nombre: "Estadio Reino de León", coords: [42.601806, -5.582111], icono: "🏟️" },
    { nombre: "MUSAC", coords: [42.603333, -5.586944], icono: "🖼️" }
];


var ubicacionesDublin = [
    { nombre: "Saint Patrick's Cathedral", coords: [53.339444, -6.271944], icono: "images/iglesia.png" },  // 📢
    { nombre: "Guinness Storehouse", coords: [53.341857, -6.286003], icono: emojiUrl("1f37a") },           // 🍺
    { nombre: "Merrion Square", coords: [53.3441, -6.2576], icono: emojiUrl("1f393") },                    // 🎓
    { nombre: "Estadio Aviva Dublin", coords: [53.3351, -6.2285], icono: emojiUrl("1f3df") }                      // 🏟️
];


var ubicacionesBogota = [
    { nombre: "Monserrate", coords: [4.605260, -74.055561], icono: emojiUrl("1f3de") },          // 🏞️
    { nombre: "Plaza de Bolívar", coords: [4.598056, -74.076111], icono: emojiUrl("1f3f0") },     // 🏰
    { nombre: "Estadio El Campín", coords: [4.645278, -74.093611], icono: emojiUrl("1f3df") },    // 🏟️
    { nombre: "Museo de Botero", coords: [4.598333, -74.075833], icono: emojiUrl("1f3a8") }       // 🎨
];


var ubicacionesVarsovia = [
    { nombre: "Catedral St. Mary Magdalene", coords: [52.249431, 21.012268], icono: emojiUrl("26ea") },           // ⛪
    { nombre: "Plaza del Mercado de Varsovia", coords: [52.231838, 21.006592], icono: emojiUrl("1f3f0") },        // 🏰
    { nombre: "Estadio Nacional de Varsovia", coords: [52.239444, 21.045278], icono: emojiUrl("1f3df") },         // 🏟️
    { nombre: "Museo de Chopin", coords: [52.231111, 21.021111], icono: emojiUrl("1f3a8") }                        // 🎨
];


var ubicacionesTokio = [
    { nombre: "Templo de Tokio", coords: [35.6585805, 139.7454329], icono: emojiUrl("1f5fc") },                   // 🗼
    { nombre: "Paso Peatonal de Shibuya", coords: [35.6595, 139.7006], icono: emojiUrl("1f3f0") },               // 🏰
    { nombre: "Estadio Olímpico de Tokio", coords: [35.6785, 139.7141], icono: emojiUrl("1f3df") },              // 🏟️
    { nombre: "Museo Nacional de Tokio", coords: [35.7188, 139.7766], icono: emojiUrl("1f3a8") }                 // 🎨
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
                break; 
            case "dublin":
                ciudadSeleccionada = { lat: 53.3498, lng: -6.2603 };
                lugaresInteres = ubicacionesDublin;
                break;
            case "bogota":
                ciudadSeleccionada = { lat: 4.7110, lng: -74.0721 };
                lugaresInteres = ubicacionesBogota;
                break;
            case "varsovia":
                ciudadSeleccionada = { lat: 52.2297, lng: 21.0122 };
                lugaresInteres = ubicacionesVarsovia;
                break;
            case "tokio":
                ciudadSeleccionada = { lat: 35.6895, lng: 139.6917 };
                lugaresInteres = ubicacionesTokio;
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
        map.setZoom(12);
        
        // Mostrar la leyenda automáticamente al seleccionar una ciudad
        const leyenda = document.getElementById('leyenda');
        if (leyenda.classList.contains('leyenda-oculta')) {
            toggleLeyenda();
        }
    });
}