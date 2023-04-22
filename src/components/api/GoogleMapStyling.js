const mapOptions = {
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    styles: [
        {
            featureType: "all",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
        },
        {
            featureType: "landscape",
            elementType: "all",
            stylers: [{ color: "#f2f2f2" }],
        },
        {
            featureType: "poi",
            elementType: "all",
            stylers: [{ visibility: "off" }],
        },
        {
            featureType: "road",
            elementType: "all",
            stylers: [{ saturation: -100 }, { lightness: 45 }],
        },
        {
            featureType: "road.highway",
            elementType: "all",
            stylers: [{ visibility: "simplified" }],
        },
        {
            featureType: "road.arterial",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }],
        },
        {
            featureType: "transit",
            elementType: "all",
            stylers: [{ visibility: "off" }],
        },
        {
            featureType: "water",
            elementType: "all",
            stylers: [{ color: "#48bcd5" }, { visibility: "on" }],
        },
    ],
};
