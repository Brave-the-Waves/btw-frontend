import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Success from './pages/Success'
import Cancel from './pages/Cancel'
import Teams from './pages/Teams'
import TeamDetails from './pages/TeamDetails'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import ParticipantProfile from './pages/ParticipantProfile'
import Participants from './pages/Participants'
import RegistrationSuccess from './pages/RegistrationSuccess'
import RegistrationCancel from './pages/RegistrationCancel'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Register from './pages/Register'
import RegisterSelect from './pages/RegisterSelect'

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<RegisterSelect />} />
        <Route path="/register/details" element={<Register />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:name" element={<TeamDetails />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<ParticipantProfile />} />
        <Route path="/participants" element={<Participants />} />
        <Route path="/registration=success" element={<RegistrationSuccess />} />
        <Route path="/registration=cancel" element={<RegistrationCancel />} />
      </Routes>
    </Router>
  )
}
