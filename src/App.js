// TODO: Look into getting the data from firebase at the top level and passing it through to each page or component

import * as React from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { db } from './FirebaseSetup.js';
//css
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { BrowserRouter, Routes, Route, Switch } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Events
import EventsPage from "./pages/events/EventsPage";
import AddEventPage from "./pages/events/AddEventPage";

// Gyms
import AddGymPage from "./pages/gyms/AddGymPage";
import GymsPage from "./pages/gyms/GymsPage";
import GymDetails from "./components/gyms/GymDetails";

// Leagues
import LeaguesPage from "./pages/leagues/Leagues-Page";
import AddLeaguePage from "./pages/leagues/AddLeague-Page";

// /User
import ManageProfile from "./pages/EditProfile";
import NoPage from "./pages/NoPage";
import EventDetails from './components/events/EventDetails';
import LoginPage from './pages/login'
import LeagueDetails from "./components/leagues/LeagueDetails";
import UserProfilePage from "./components/user/UserProfilePage";

export default function App() {
    return (
        <BrowserRouter>
            <CssBaseline />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    {/*User pages*/}
                    <Route exact path="login" element={<LoginPage />} />
                    <Route path="manageprofile" element={<ManageProfile />} />
                    <Route path="register" element={<Register />} />
                    <Route path="/users/:userId" element={<UserProfilePage />} />

                    {/*Events Pages*/}
                    <Route path="events" element={<EventsPage />} />
                    <Route path="addevent" element={<AddEventPage />} />
                    <Route exact path="/events/:id" element={<EventDetails />} />
                    {/*Gym Pages*/}
                    <Route path="gyms" element={<GymsPage />} />
                    <Route path="create-gym" element={<AddGymPage />} />
                    <Route exact path="/gyms/:id" element={<GymDetails />} />
                    {/*League Pages*/}
                    <Route path="leagues" element={<LeaguesPage />} />
                    <Route path="add-league" element={<AddLeaguePage />} />
                    <Route exact path="/leagues/:id" element={<LeagueDetails />} />
                    {/*Extra Pages*/}
                    <Route path="*" element={<NoPage />} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}
