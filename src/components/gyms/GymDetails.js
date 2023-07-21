//GymDetails.js

//what does this do?
// dispatch({
//     type: 'SET_GYM',
//     gym: gymDetails,
// });
//TODO: add a MUI love heart icon that acts as a <Switch /> on this Gym page, when the user clicks the <Switch /> it adds the gym id to an array on the 'user' called 'subscribedGyms'. If they disable the <Switch /> it removes it from the array
// TODO: SHow all the events that are taking place at this gym
// TODO: check through all events, look for events with the gym array. if an event has this gym's id in the gym.id document then show that event
import React, { useEffect, useState, useContext } from 'react';
import { getFirestore, doc, updateDoc, getDoc, collection, query, where, onSnapshot, arrayUnion, arrayRemove, } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import { Stack, Dialog, DialogTitle, DialogContent, ImageList, ImageListItem, Button, Typography, Box, CardMedia, Avatar } from '@mui/material';
import Loading from '../data/Loading';
import Divider from '@mui/material/Divider';

// Import components
import GoogleMapSingle from "../api/GoogleMapSingle";
import { useDataLayer } from '../data/DataLayer';
import AuthContext from '../../contexts/AuthContext';
import { auth, db } from "../../FirebaseSetup";
import IsSubscribedSwitch from "../user/isSubscribedSwitch";
import EventCard from "../events/EventCard";
import EditGymDetails from './EditGymDetails';
import GymBannerUpload from './GymBannerUpload';
import GalleryImageUpload from './GalleryImageUpload';

// Import UI elements
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Switch from '@mui/material/Switch';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { red } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import GymBannerImage from "./GymBannerImage";

// Tabs
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// Import notifications
import { requestNotificationPermission } from '../messaging/fcm';
import {getDownloadURL, getStorage, listAll, ref, uploadBytes} from "firebase/storage";
import {Close} from "@mui/icons-material";

const GymDetails = () => {
    const { events, getGymBySlug, gyms, updateGymBannerUrl, isAnyDataLoading } = useDataLayer();
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const { slug } = useParams();

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [mapDialogOpen, setMapDialogOpen] = useState(false);
    const [gym, setGym] = useState(null);
    const [images, setImages] = useState([]);
    const [isGalleryLoading, setIsGalleryLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        if (!isAnyDataLoading) {
            console.log('GymDetails useEffect loading', isAnyDataLoading);

            const fetchGym = async () => {
                try {
                    setGym(null);
                    const gymDetails = await getGymBySlug(slug);
console.log("Gym details: ", gymDetails);
                    if (gymDetails) {
                        setGym(gymDetails);
                        // Check if the gym's slug is in the user's subscribedGyms array
                        if (currentUser && Array.isArray(currentUser.subscribedGyms) && currentUser.subscribedGyms.includes(slug)) {
                            setIsSubscribed(true);
                        } else {
                            setIsSubscribed(false);
                        }
                        console.log("Gym data: ", gymDetails); // Here's the log
                    } else {
                        console.error('Error fetching gym: gymDetails is', gymDetails);
                        setError('Error fetching gym details.'); // Set the error
                    }

                } catch (error) {
                    console.error('Error fetching gym:', error);
                    setError('Error fetching gym.'); // Set the error
                }
            };
            fetchGym();
        }
        {gym && console.log('gymDetails GymID', gym.slug);}

    }, [slug, currentUser, getGymBySlug, isAnyDataLoading]);


    const fetchImages = async () => {
        if (!gym?.id) {
            console.error('Error cannot fetch images: Gym or gym.id is not available');
            return;
        }
        try {
            setIsGalleryLoading(true);
            const storage = getStorage();
            const storageRef = ref(storage, `gyms/${gym.id}/gallery/temp/`);
            const imageRefs = await listAll(storageRef);
            const imagePromises = imageRefs.items.map(getDownloadURL);

            const imageArray = await Promise.all(imagePromises);
            setImages(imageArray);
            console.log("Fetched Images: ", imageArray);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setIsGalleryLoading(false);
        }
    };



    useEffect(() => {
        if (gym?.id) {
            fetchImages();
        }
    }, [gym]);

    if (error) {
        return <p>Error: {error}</p>;
    }

    const handleSubscribeToggle = async () => {
        setIsSubscribed(!isSubscribed);
        const userDoc = doc(db, 'users', currentUser.uid);
        if (!isSubscribed) {
            await updateDoc(userDoc, {
                subscribedGyms: arrayUnion(slug) // Change id to slug
            });
        } else {
            await updateDoc(userDoc, {
                subscribedGyms: arrayRemove(slug) // Change id to slug
            });
        }
    };

    const handleGymUpdate = (updatedGym) => {
        setGym(updatedGym);
    };

    const openMapDialog = () => {
        setMapDialogOpen(true);
    };

    const closeMapDialog = () => {
        setMapDialogOpen(false);
    };

    const handleOpen = (image) => {
        setSelectedImage(image);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const modalStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const imgStyle = {
        maxWidth: '90%',
        maxHeight: '90%',
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    let upcomingEvents = [];
    let pastEvents = [];
    if(gym){
        upcomingEvents = events.filter(event => (event.gymId === gym.id) && new Date(event.date) >= new Date());
        pastEvents = events.filter(event => (event.gymId === gym.id) && new Date(event.date) < new Date());
    }


    console.log("Gym data: ", gym); // Here's the log

    return (


        <Stack spacing={2}>
            {isAnyDataLoading || !gym ? (
                <Loading />
            ) : gym ? (
                <Stack
                    spacing={2}
                    container
                    marginTop={2}
                >
                    {gym.bannerUrl && (
                        <Box
                            // add a border radius of 14 px
                            sx={{ borderRadius: '14px' }}
                        >
                            <CardMedia
                                component="img"
                                alt={gym.name}
                                height="auto"
                                image={gym.bannerUrl}
                                title={gym.name}
                                //birder radius 14px, margin bottom 2
                                sx={{ width: '100%', borderRadius: '14px', marginBottom: 2 }}
                            />
                        </Box>
                    )}

                    {/*<Button variant="contained" onClick={sendNotification}>Send Test Notification</Button>*/}
                    <Stack
                        container
                        direction="row"
                        justifyContent="center"
                        spacing={2}
                    >
                        {gym.avatarUrl ? (
                            <Stack
                                container
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                                xs={2}
                                sm={3}
                            >
                                <Stack>
                                    <Avatar
                                        alt={gym.name}
                                        src={gym.avatarUrl}
                                        // make the avatar fill the width and height
                                        sx={{ width: '100%', height: 'auto', padding: '10px' }}
                                    />
                                </Stack>
                            </Stack>
                        ) : null}
                        <Stack
                            container
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            spacing={2}
                            xs={gym.avatarUrl ? 10 : 12}
                            sm={9}
                            sx={{ width: '100%' }}

                            //text align left
                        >
                            <Stack item>
                                <Typography
                                    variant={"h1"}
                                    sx={{ fontSize: '2rem' }}
                                >
                                    {gym.name}
                                </Typography>
                            </Stack>
                            {currentUser ? (
                                <Stack
                                    item
                                    // display flex so that content are in a row and to the left of the container
                                    container
                                    direction="row"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    spacing={0}

                                >
                                        <IsSubscribedSwitch
                                            isSubscribed={isSubscribed}
                                            handleSubscription={handleSubscribeToggle}
                                        />
                                        <span>Follow this Gym</span>
                                </Stack>
                            ) : (
                                <Typography variant={"body2"} >Login to follow this gym and be notified of upcoming events</Typography>)
                            }
                        </Stack>
                    </Stack>
                    <Stack
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >


                        <Stack item xs={12}>
                            <Typography variant={"body1"}>{gym.location}</Typography>
                            <Typography variant={"body1"}><b>Location:</b> {gym.address}</Typography>
                            <div dangerouslySetInnerHTML={{ __html: gym.description }} />
                        </Stack>
                    </Stack>

                    {/*// loop through this array gym.leagues*/}
                    {/*{gym.leagues && gym.leagues.map((league) => (*/}
                    {/*    <Stack*/}
                    {/*        container*/}
                    {/*        direction="row"*/}
                    {/*        justifyContent="center"*/}
                    {/*            */}
                    {/*        alignItems="center"*/}
                    {/*        spacing={2}*/}
                    {/*    >*/}
                    {/*        <Stack item xs={12}>*/}
                    {/*            <Typography variant={"body1"}><b>League:</b> {league.name}</Typography>*/}
                    {/*        </Stack>*/}
                    {/*    </Stack>*/}
                    {/*))}*/}

                    {/*<Typography variant="body1>{gym.description}</Typography>*/}
                    {/*<Typography variant={"body1"}>{gym.longitude}</Typography>*/}
                    <GoogleMapSingle key={gym.id} marker={gym} />
{/*//TODO: Hide the edit and post results buttons from those who are not owneers or admins*/}
                    {/*only users with an id whos id can be found in the gym.ownerUid array can edit the gym, else they can only view the gym*/}
                    {/*or if the user type = admin*/}
                    {(currentUser && gym && gym.ownerUid && (gym.ownerUid.includes(currentUser.uid) || currentUser.type === 'Admin')) ? (
                    <Stack >
                        <Stack item xs={12} sm={6}>
                            {/*//This component is used to control the modal which contains the gym editing form*/}
                            <EditGymDetails gym={gym} onUpdate={handleGymUpdate} />
                        </Stack>
                    </Stack>
                    ) : null}

                </Stack>
            ) : (
                <Typography>Could not find gym with slug: {slug}</Typography>
            )}

            {isGalleryLoading ? (
                <p>Loading images...</p>
            ) : (
                <>
                    {images.length > 0 && (
                        <>
                            <Divider>Photo Gallery</Divider>
                            {console.log("Rendering images: ", images)}
                            <ImageList cols={4} gap={8}>
                                {images.map((item, index) => (
                                    <ImageListItem key={index}>
                                        <img src={item} alt={`Image ${index}`} loading="lazy" onClick={() => handleOpen(item)} />
                                    </ImageListItem>
                                ))}
                            </ImageList>

                            <Dialog
                                open={open}
                                onClose={handleClose}
                                style={modalStyle}
                                aria-labelledby="image-modal"
                                aria-describedby="image-modal-description"
                            >
                                <DialogContent>
                                    <img src={selectedImage} alt={`Selected image`} style={imgStyle} />
                                    <IconButton
                                        edge="end"
                                        color="inherit"
                                        onClick={handleClose}
                                        aria-label="close"
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}

                </>
            )}


            {/*List of events*/}
            {
                gym && events && events.filter(event => event.gymId === gym.id).length ? (
                    <>
                        <Divider>Events at {gym.name}</Divider>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={tabValue} onChange={handleTabChange} aria-label="upcoming and past events tabs">
                                    <Tab label="Upcoming Events" />
                                    <Tab label="Past Events" />
                                </Tabs>
                            </Box>
                            <TabPanel value={tabValue} index={0}>
                                <Stack container spacing={2} columns={{ xs: 4, md: 12 }}>
                                    {upcomingEvents.map((event) => (
                                        <EventCard key={event.id} event={event} hideGym />
                                    ))}
                                </Stack>
                            </TabPanel>
                            <TabPanel value={tabValue} index={1}>
                                <Stack container spacing={2} columns={{ xs: 4, md: 12 }}>
                                    {pastEvents.map((event) => (
                                        <EventCard key={event.id} event={event} hideGym />
                                    ))}
                                </Stack>
                            </TabPanel>
                        </Box>
                    </>
                ) : null
            }
            <Typography variant={"body1"}>ID: {gym?.id}</Typography>
        </Stack>
    );
};

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default GymDetails;
