// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Card, CardContent, Typography, Avatar } from '@mui/material';
// import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
//
// const UserProfilePage = () => {
//     const { userId } = useParams();
//     const [user, setUser] = useState(null);
//     const [subscribedLeagues, setSubscribedLeagues] = useState([]);
//
//     useEffect(() => {
//         const fetchUserData = async () => {
//             const db = getFirestore();
//             const userDoc = await getDoc(doc(db, 'users', userId));
//
//             if (userDoc.exists()) {
//                 setUser(userDoc.data());
//             } else {
//                 console.error('User not found');
//             }
//         };
//
//         fetchUserData();
//     }, [userId]);
//
//     useEffect(() => {
//         const fetchSubscribedLeagues = async () => {
//             if (!user || !user.subscribedLeagues) return;
//
//             const db = getFirestore();
//             const leaguesRef = collection(db, 'leagues');
//             const q = query(leaguesRef, where('id', 'in', user.subscribedLeagues));
//             const leaguesSnapshot = await getDocs(q);
//             const leagues = leaguesSnapshot.docs.map(doc => doc.data());
//             setSubscribedLeagues(leagues);
//         };
//
//         fetchSubscribedLeagues();
//     }, [user]);
//
//     if (!user) {
//         return <div>Loading...</div>;
//     }
//
//     return (
//         <div
//             sx={{
//                 flexGrow: 1,
//                 padding: (theme) => theme.spacing(3),
//             }}
//         >
//             <h2>User Details</h2>
//             <Card
//                 sx={{
//                     minWidth: 275,
//                     padding: (theme) => theme.spacing(2),
//                 }}
//             >
//                 <CardContent>
//                     <Typography variant="h5">{user.ninjaName || user.email}</Typography>
//                     <Typography variant="subtitle1">Email: {user.email}</Typography>
//                     <Avatar
//                         src={user.photoURL}
//                         alt={user.ninjaName || user.email}
//                         sx={{
//                             width: (theme) => theme.spacing(14),
//                             height: (theme) => theme.spacing(14),
//                         }}
//                     />
//                 </CardContent>
//             </Card>
//             {/*TODO: This list of league isnt working yet*/}
//             <h2>Subscribed Leagues</h2>
//             <ul>
//                 {subscribedLeagues.map(league => (
//                     <li key={league.id}>
//                         <Typography>{league.name}</Typography>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };
//
// export default UserProfilePage;
