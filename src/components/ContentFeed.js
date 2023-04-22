// import React, { useState, useEffect } from 'react';
// import { getFirestore, collection, getDocs } from "firebase/firestore";
// import {firebaseConfig} from "../FirebaseSetup"; // Make sure to adjust the path to your Firebase configuration file
// import { db } from "../FirebaseSetup"; // Make sure to adjust the path to your Firebase configuration file
//
// const ContentFeed = () => {
//     const [gyms, setGyms] = useState([]);
//     const [events, setEvents] = useState([]);
//     const [leagues, setLeagues] = useState([]);
//     const [users, setUsers] = useState([]);
//
//     useEffect(() => {
//         const fetchData = async () => {
//             const db = getFirestore(firebaseConfig);
//
//             const gymsSnapshot = await getDocs(collection(db, 'gyms'));
//             setGyms(gymsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//
//             const eventsSnapshot = await getDocs(collection(db, 'events'));
//             setEvents(eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//
//             const leaguesSnapshot = await getDocs(collection(db, 'leagues'));
//             setLeagues(leaguesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//
//             const usersSnapshot = await getDocs(collection(db, 'users'));
//             setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//         };
//
//         fetchData();
//     }, []);
//
//     console.log('gyms', events)
//
//     return (
//         <div>
//             <h2>Gyms</h2>
//             {gyms.map(gym => (
//                 <div key={gym.id}>{gym.name}</div>
//             ))}
//
//             <h2>Events</h2>
//             {events.map(event => (
//                 <div key={event.id}>{event.name}</div>
//             ))}
//
//             <h2>Leagues</h2>
//             {leagues.map(league => (
//                 <div key={league.id}>{league.name}</div>
//             ))}
//
//             <h2>Users</h2>
//             {users.map(user => (
//                 <div key={user.id}>{user.displayName || `${user.firstName} ${user.lastName}`}</div>
//             ))}
//         </div>
//     );
// };
//
// export default ContentFeed;
