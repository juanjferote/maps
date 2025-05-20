let map;

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
        break; 
    case "dublin":
        ciudadSeleccionada = { lat: 53.3498, lng: -6.2603}
        break;
    case "bogota":
        ciudadSeleccionada = { lat: 4.7110, lng: -74.0721}
        break;
    case "varsovia":
        ciudadSeleccionada = { lat: 52.2297, lng: 21.0122}
        break;
    case "tokio":
        ciudadSeleccionada = { lat: 35.6895, lng: 139.6917}
        break;
    default:
        ciudadSeleccionada = { lat: 40.4165, lng: -3.70256}
        break;
    }
    map.panTo(ciudadSeleccionada);
    map.setZoom(12)
  });
}
