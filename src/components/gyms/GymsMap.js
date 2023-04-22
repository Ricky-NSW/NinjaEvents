// import React, { useRef, useEffect } from "react";
// import { GoogleMap, Marker, MarkerClusterer } from "@react-google-maps/api";
//
// import GoogleMapsApi from "../api/GoogleMapsApi";
//
// // TODO Make it so the placemarkers are clickable and link to the corresponding gym
//
// const GymsMap = ({ gyms, libraries }) => {
//     const mapRef = useRef(null);
//
//     const fitBounds = () => {
//         if (!mapRef.current || gyms.length === 0) return;
//
//         const bounds = new window.google.maps.LatLngBounds();
//         gyms.forEach((gym) => {
//             bounds.extend({ lat: gym.latitude, lng: gym.longitude });
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
//     }, [gyms]);
//
//     gyms.forEach((gym) => {
//         console.log(gym.latitude, gym.longitude);
//     });
//
//     return (
//         <GoogleMapsApi apiKey="AIzaSyAvD6k7QJZd6MqA50ON9VFW9wiQSfvtxHU" libraries={libraries}>
//             <GoogleMapComponent
//                 ref={mapRef}
//                 mapContainerStyle={containerStyle}
//                 center={defaultCenter}
//                 zoom={10}
//                 options={mapOptions}
//                 onLoad={(map) => {
//                     mapRef.current = map;
//                 }}
//             >
//                 {gyms.map((gym) => (
//                     <Marker
//                         key={gym.id}
//                         position={{ lat: gym.latitude, lng: gym.longitude }}
//                     />
//                 ))}
//             </GoogleMapComponent>
//         </GoogleMapsApi>
//     );
// };
//
// export default GymsMap;
