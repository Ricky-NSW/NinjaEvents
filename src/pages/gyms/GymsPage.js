import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GymScraper from '../../components/gyms/GymScraper';

//Firebase
import { db } from '../../FirebaseSetup';

//MUI
import GymsList from "../../components/gyms/GymsList";
import GoogleMapArray from '../../components/api/GoogleMapArray';
import GoogleMapsApi from "../../components/api/GoogleMapsApi";
import {useDataLayer} from "../../components/data/DataLayer";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
function GymsPage() {

    const [gyms, setGyms] = useState([]);

    useEffect(() => {
        // use datalayer here - see GymsList
        // import { useDataLayer } from '../data/DataLayer';
        // const { gyms } = useDataLayer();


        const gymsRef = db.collection('gyms');
        const unsubscribe = gymsRef.onSnapshot((snapshot) => {
            const gymsArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setGyms(gymsArray);
        });
        // Remove the gym listener when the component unmounts
        return () => {
            unsubscribe();
        };
    }, []);

    console.log("Gyms in GymsPage:", {gyms});

    return (
        <div>
            <h2>scraper</h2>
            <GymScraper />

            <h1>Gyms</h1>
            <GymsList gyms={gyms} />

            <h2>MAP</h2>
            <GoogleMapArray markers={gyms}/>
        </div>
    );
}

export default GymsPage;
