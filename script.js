let map;
var ubicacionesLeon = [
    {
        nombre: "Catedral de León",
        coords: [42.599444, -5.566667]
    },
    {
        nombre: "Casa Botines",
        coords: [42.598444, -5.570722]
    },
    {
        nombre: "Convento de San Marcos",
        coords: [42.601806, -5.582111]
    }
];

var ubicacionesDublin = [
    {
        nombre: "General Post Office",
        coords: [53.349805, -6.26031]
    },
    {
        nombre: "Guinness Storehouse",
        coords: [53.341857, -6.286003]
    },
    {
        nombre: "Trinity College",
        coords: [53.3441, -6.2576]
    }
];

var ubicacionesBogota = [
    {
        nombre: "Monserrate",
        coords: [4.605260, -74.055561]
    },
    {
        nombre: "Betel",
        coords: [4.577500, -74.130600]
    },
    {
        nombre: "Jardín Botánico",
        coords: [4.658400, -74.093500]
    }
];

var ubicacionesVarsovia = [
    {
        nombre: "Plaza del Mercado",
        coords: [52.249431, 21.012268] 
    },
    {
        nombre: "Palacio de Cultura y Ciencia",
        coords: [52.231838, 21.006592]
    },
    {
        nombre: "Palacio de Wilanów",
        coords: [52.165367, 21.089199]
    }
];

var ubicacionesTokio = [
    {
        nombre: "Torre de Tokio",
        coords: [35.6585805, 139.7454329]
    },
    {
        nombre: "Palacio Imperial",
        coords: [35.685175, 139.752799]
    },
    {
        nombre: "Templo Senso-ji",
        coords: [35.714765, 139.796655]
    }
];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 40.4165, lng: -3.70256 },
    zoom: 8,
    });

document.getElementById("ciudad").addEventListener('change', function() {
    const ciudad = document.getElementById("ciudad").value
    var ciudadSeleccionada
    switch (ciudad) {
    case "leon":
        ciudadSeleccionada = { lat: 42.60002, lng: -5.57032}
        ubicacionesLeon.forEach(ubicacion => {
            new google.maps.Marker({
            position: { lat: ubicacion.coords[0], lng: ubicacion.coords[1] },
            map: map,
            title: ubicacion.nombre
            });
        });
        break; 
    case "dublin":
        ciudadSeleccionada = { lat: 53.3498, lng: -6.2603}
        ubicacionesDublin.forEach(ubicacion => {
            new google.maps.Marker({
            position: { lat: ubicacion.coords[0], lng: ubicacion.coords[1] },
            map: map,
            title: ubicacion.nombre
            });
        });
        break;
    case "bogota":
        ciudadSeleccionada = { lat: 4.7110, lng: -74.0721}
        ubicacionesBogota.forEach(ubicacion => {
            new google.maps.Marker({
            position: { lat: ubicacion.coords[0], lng: ubicacion.coords[1] },
            map: map,
            title: ubicacion.nombre
            });
        });
        break;
    case "varsovia":
        ciudadSeleccionada = { lat: 52.2297, lng: 21.0122}
        ubicacionesVarsovia.forEach(ubicacion => {
            new google.maps.Marker({
            position: { lat: ubicacion.coords[0], lng: ubicacion.coords[1] },
            map: map,
            title: ubicacion.nombre
            });
        });
        break;
    case "tokio":
        ciudadSeleccionada = { lat: 35.6895, lng: 139.6917}
        ubicacionesTokio.forEach(ubicacion => {
            new google.maps.Marker({
            position: { lat: ubicacion.coords[0], lng: ubicacion.coords[1] },
            map: map,
            title: ubicacion.nombre
            });
        });
        break;
    }
    map.panTo(ciudadSeleccionada);
    map.setZoom(12)
  });
}



    
    

