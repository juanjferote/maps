let map;

function emojiUrl(unicodeHex) {
    return `https://twemoji.maxcdn.com/v/latest/72x72/${unicodeHex}.png`;
}

var ubicacionesLeon = [
    { nombre: "Catedral de León", coords: [42.599444, -5.566667], icono: emojiUrl("26ea") },      // ⛪
    { nombre: "Casa Botines", coords: [42.598444, -5.570722], icono: emojiUrl("1f3f0") },          // 🏰
    { nombre: "Convento de San Marcos", coords: [42.601806, -5.582111], icono: emojiUrl("26ea") }  // ⛪
];

var ubicacionesDublin = [
    { nombre: "General Post Office", coords: [53.349805, -6.26031], icono: "images/iglesia.png" },     // 📢
    { nombre: "Guinness Storehouse", coords: [53.341857, -6.286003], icono: emojiUrl("1f37a") },    // 🍺
    { nombre: "Trinity College", coords: [53.3441, -6.2576], icono: emojiUrl("1f393") }             // 🎓
];

var ubicacionesBogota = [
    { nombre: "Monserrate", coords: [4.605260, -74.055561], icono: emojiUrl("1f3de") },             // 🏞️
    { nombre: "Betel", coords: [4.577500, -74.130600], icono: emojiUrl("1f3de") },                  // 🏞️
    { nombre: "Jardín Botánico", coords: [4.658400, -74.093500], icono: emojiUrl("1f333") }         // 🌳
];

var ubicacionesVarsovia = [
    { nombre: "Plaza del Mercado", coords: [52.249431, 21.012268], icono: emojiUrl("1f3de") },      // 🏞️
    { nombre: "Palacio de Cultura y Ciencia", coords: [52.231838, 21.006592], icono: emojiUrl("1f3f0") }, // 🏰
    { nombre: "Palacio de Wilanów", coords: [52.165367, 21.089199], icono: emojiUrl("1f3f0") }      // 🏰
];

var ubicacionesTokio = [
    { nombre: "Torre de Tokio", coords: [35.6585805, 139.7454329], icono: emojiUrl("1f5fc") },      // 🗼
    { nombre: "Palacio Imperial", coords: [35.685175, 139.752799], icono: emojiUrl("1f3f0") },      // 🏰
    { nombre: "Templo Senso-ji", coords: [35.714765, 139.796655], icono: emojiUrl("26ea") }         // ⛪
];


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 40.4165, lng: -3.70256 },
    zoom: 8,
    });

document.getElementById("ciudad").addEventListener('change', function() {
    const ciudad = document.getElementById("ciudad").value;
    document.body.classList.add('city-selected');
    var ciudadSeleccionada
    let lugaresInteres = []
    switch (ciudad) {
    case "leon":
        ciudadSeleccionada = { lat: 42.60002, lng: -5.57032}
        lugaresInteres = ubicacionesLeon
        break; 
    case "dublin":
        ciudadSeleccionada = { lat: 53.3498, lng: -6.2603}
        lugaresInteres = ubicacionesDublin
        break;
    case "bogota":
        ciudadSeleccionada = { lat: 4.7110, lng: -74.0721}
        lugaresInteres = ubicacionesBogota
        break;
    case "varsovia":
        ciudadSeleccionada = { lat: 52.2297, lng: 21.0122}
        lugaresInteres = ubicacionesVarsovia
        break;
    case "tokio":
        ciudadSeleccionada = { lat: 35.6895, lng: 139.6917}
        lugaresInteres = ubicacionesTokio
        break;
    }
    lugaresInteres.forEach(ubicacion => {
        new google.maps.Marker({
        position: { lat: ubicacion.coords[0], lng: ubicacion.coords[1] },
        map: map,
        title: ubicacion.nombre,
        icon: {
            url: ubicacion.icono,
            scaledSize: new google.maps.Size(32, 32)
        }
        });
    });
    map.panTo(ciudadSeleccionada);
    map.setZoom(12)
  });
}