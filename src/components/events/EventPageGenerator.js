// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../../FirebaseSetup';
// import CardMedia from "@mui/material/CardMedia";
// import CardContent from "@mui/material/CardContent";
// import Typography from "@mui/material/Typography";
// import CardActions from "@mui/material/CardActions";
// import Button from "@mui/material/Button";
// import Card from "@mui/material/Card"; // assuming you have initialized a Firebase app and Firestore instance
//
// const  EventPageGenerator = () => {
//     const [events, setEvents] = useState([]);
//
//     useEffect(() => {
//         const fetchEvents = async () => {
//             const eventsCollection = collection(db, 'events');
//             const eventsSnapshot = await getDocs(eventsCollection);
//             const eventsList = eventsSnapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data()
//             }));
//             setEvents(eventsList);
//         };
//         fetchEvents();
//     }, []);
//
//     return (
//         <div>
//             {events.map(event => (
//                 <Card key={event.id} sx={{ maxWidth: 345 }}>
//                     <CardMedia
//                         sx={{ height: 140 }}
//                         image="/static/images/cards/contemplative-reptile.jpg"
//                         title="green iguana"
//                     />
//                     <CardContent>
//                         <Typography gutterBottom variant="h5" component="div">
//                             {event.title}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                             {event.description}
//                         </Typography>
//                     </CardContent>
//                     <CardActions>
//                         <Button size="small">Share</Button>
//                         <Button component={Link} to="/contact" size="small">Learn More</Button>
//                     </CardActions>
//                 </Card>
//                 // <div key={event.id}>
//                 //     <h1>{event.title}</h1>
//                 //     <p>{event.description}</p>
//                 //     {/* assuming the event document has a "title" and "description" field */}
//                 //     <Link to={`/event/${event.id}`}>View Details</Link>
//                 //     {/* assuming you want to link to a new page for each event */}
//                 // </div>
//             ))}
//         </div>
//     );
// };
//
// export default  EventPageGenerator;
