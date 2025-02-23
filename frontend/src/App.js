import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import TripForm from "./components/TripForm";
import AllTrips from "./components/AllTrips";
import TripList from "./components/TripList";
import ProtectedRoute from "./ProtectedRoute";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path="/mytrips" element={<TripList />} />
                    <Route path="/addtrip" element={<TripForm />} />
                    <Route path="/alltrips" element={<AllTrips />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
