mapboxgl.accessToken = 'pk.eyJ1IjoicHJheWFza3VtYXIiLCJhIjoiY2t3ZzBoY2w0MGswMTJwcG1paWFqdWRzcSJ9.__eZ6h0eFMNHrqIPy44GZQ';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});
