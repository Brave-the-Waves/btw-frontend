import React from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import EventLayout from './components/EventLayout'
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
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Register from './pages/Register'
import RegisterSelect from './pages/RegisterSelect'
import CorporateRegister from './pages/CorporateRegister'
import Crew from './pages/Crew'
import Event from './pages/Event'

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crew" element={<Crew />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<RegisterSelect />} />
        <Route path="/register/details" element={<Register />} />
        <Route path="/register/corporate" element={<CorporateRegister />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/event/:eventName" element={<EventLayout />}>
          <Route index element={<Event />} />
          <Route path="teams" element={<Teams />} />
          <Route path="teams/:name" element={<TeamDetails />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="participants" element={<Participants />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<ParticipantProfile />} />
        <Route path="/registration=success" element={<RegistrationSuccess />} />
        <Route path="/registration=cancel" element={<RegistrationCancel />} />
      </Routes>
    </Router>
  )
}
