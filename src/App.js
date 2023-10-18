// TODO: Look into getting the data from firebase at the top level and passing it through to each page or component

import * as React from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { db } from './FirebaseSetup.js';
//css
import CssBaseline from '@mui/material/CssBaseline';

import "@fontsource/plus-jakarta-sans"; // Defaults to weight 400
import "@fontsource/plus-jakarta-sans/400.css"; // Specify weight
import "@fontsource/plus-jakarta-sans/400-italic.css"; // Specify weight and style

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BreakpointWatcher from './components/layout/BreakpointWatcher';

// Events
import EventsPage from "./pages/events/EventsPage";
import AddEventPage from "./pages/events/AddEventPage";
import UserEventList from "./pages/events/UserEventList";
// Gyms
import AddGymPage from "./pages/gyms/AddGymPage";
import GymsPage from "./pages/gyms/GymsPage";
import UserGymList from "./pages/gyms/UserGymList";
import GymDetails from "./components/gyms/GymDetails";

// Leagues
import LeaguesPage from "./pages/leagues/Leagues-Page";
import AddLeaguePage from "./pages/leagues/AddLeague-Page";

// /User
import UsersPage from "./pages/users/UsersPage";
import UserDetails from "./components/user/UserDetails";
import UserprofilePage from "./pages/UserprofilePage";
import NoPage from "./pages/NoPage";
import EventDetails from './components/events/EventDetails';
import LoginPage from './pages/login'
import LeagueDetails from "./components/leagues/LeagueDetails";
// import UserProfilePage from "./components/user/UserProfilePage";

//Timers
import SimpleTimerPage from "./pages/timers/SimpleTimerPage";
import SimpleTimer from "./components/timers/SimpleTimer";

export default function App() {
    return (
        <Router>
            <CssBaseline />
            <BreakpointWatcher />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    {/*User pages*/}
                    <Route exact path="login" element={<LoginPage />} />
                    <Route path="manageprofile" element={<UserprofilePage />} />
                    <Route path="register" element={<Register />} />
                    {/*<Route path="/users/:userId" element={<UserProfilePage />} />*/}
                    {/*Events Pages*/}
                    <Route path="events" element={<EventsPage />} />
                    <Route path="addevent" element={<AddEventPage />} />
                    <Route exact path="/events/:id" element={<EventDetails />} />
                    <Route path="/events/manage-events" element={<UserEventList />} />

                    {/*---------Gym Pages*/}
                    <Route path="gyms" element={<GymsPage />} />
                    <Route path="/gyms/manage-gyms" element={<UserGymList />} />
                    <Route path="create-gym" element={<AddGymPage />} />
                    <Route exact path="/gyms/:slug" element={<GymDetails />} />
                    {/* -------League Pages*/}
                    <Route path="leagues" element={<LeaguesPage />} />
                    <Route path="add-league" element={<AddLeaguePage />} />
                    <Route exact path="/leagues/:slug" element={<LeagueDetails />} />
                    {/* -------Users pages */}
                    <Route path="users" element={<UsersPage />} />
                    <Route exact path="/users/:userId" element={<UserDetails />} />

                    {/*Timers Pages*/}
                    <Route path="/timers/" element={<SimpleTimerPage />} />
                    {/*<Route exact path="/timers/:id" element={<SimpleTimer />} />*/}
                    {/*//element below  is correct (changing it to compeont will break it*/}
                    <Route path="/users/:userId/timers/:timerId" element={<SimpleTimer />} />

                    {/*Extra Pages*/}
                    <Route path="*" element={<NoPage />} />

                </Route>
            </Routes>
        </Router>
    );
}

