import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Success from './pages/Success'
import Cancel from './pages/Cancel'
import Teams from './pages/Teams'
import TeamDetails from './pages/TeamDetails'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import UserProfile from './pages/ParticipantProfile'
import Participants from './pages/Participants'
import RegistrationSuccess from './pages/RegistrationSuccess'
import RegistrationCancel from './pages/RegistrationCancel'
import Login from './pages/Login'
import Register from './pages/Signup'

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:name" element={<TeamDetails />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/participants" element={<Participants />} />
        <Route path="/registration=success" element={<RegistrationSuccess />} />
        <Route path="/registration=cancel" element={<RegistrationCancel />} />
      </Routes>
    </Router>
  )
}
