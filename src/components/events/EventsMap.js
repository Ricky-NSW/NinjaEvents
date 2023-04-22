// import React, { useRef, useEffect } from "react";
// import { GoogleMap, Marker, MarkerClusterer } from "@react-google-maps/api";
// import GoogleMapsApi from "../api/GoogleMapsApi";
//
// const EventsMap = ({ events, libraries }) => {
//     const mapRef = useRef(null);
//
//     const fitBounds = () => {
//         if (!mapRef.current || events.length === 0) return;
//
//         const bounds = new window.google.maps.LatLngBounds();
//         events.forEach((event) => {
//             bounds.extend({ lat: event.latitude, lng: event.longitude });
//         });
//         mapRef.current.fitBounds(bounds);
//     };
//
//     const containerStyle = {
//         width: "100%",
//         height: "400px",
//     };
//
//     const defaultCenter = {
//         lat: -32.759295,
//         lng: 151.6238087,
//     };
//
//     const mapOptions = {
//         zoomControl: true,
//         mapTypeControl: false,
//         scaleControl: true,
//         streetViewControl: false,
//         rotateControl: false,
//         fullscreenControl: true,
//         styles: [
//             {
//                 featureType: "all",
//                 elementType: "labels",
//                 stylers: [{ visibility: "off" }],
//             },
//             {
//                 featureType: "landscape",
//                 elementType: "all",
//                 stylers: [{ color: "#f2f2f2" }],
//             },
//             {
//                 featureType: "poi",
//                 elementType: "all",
//                 stylers: [{ visibility: "off" }],
//             },
//             {
//                 featureType: "road",
//                 elementType: "all",
//                 stylers: [{ saturation: -100 }, { lightness: 45 }],
//             },
//             {
//                 featureType: "road.highway",
//                 elementType: "all",
//                 stylers: [{ visibility: "simplified" }],
//             },
//             {
//                 featureType: "road.arterial",
//                 elementType: "labels.icon",
//                 stylers: [{ visibility: "off" }],
//             },
//             {
//                 featureType: "transit",
//                 elementType: "all",
//                 stylers: [{ visibility: "off" }],
//             },
//             {
//                 featureType: "water",
//                 elementType: "all",
//                 stylers: [{ color: "#48bcd5" }, { visibility: "on" }],
//             },
//         ],
//     };
//
//
//     useEffect(() => {
//         fitBounds();
//     }, [events]);
//
//     console.log("Events in MapPage:", {events});
//
//     return (
//         <GoogleMapsApi apiKey="AIzaSyAvD6k7QJZd6MqA50ON9VFW9wiQSfvtxHU" libraries={libraries}>
//             <GoogleMap
//                 ref={mapRef}
//                 mapContainerStyle={containerStyle}
//                 center={defaultCenter}
//                 zoom={4}
//                 options={mapOptions}
//                 onLoad={(map) => {
//                     mapRef.current = map;
//                 }}
//             >
//                 {events.map((event) => {
//                     console.log("Event position:", { lat: event.latitude, lng: event.longitude }); // Add this line
//                     return (
//                         <Marker
//                             key={event.id}
//                             position={{ lat: parseFloat(event.latitude), lng: parseFloat(event.longitude) }}
//                         />
//                     );
//                 })}
//             </GoogleMap>
//         </GoogleMapsApi>
//     );
// };
//
// export default EventsMap;
