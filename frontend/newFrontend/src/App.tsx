import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SignupPage from './components/pages/SignupPage';
import { LandingPage } from './components/pages/LandingPage';
import PoliceSignupPage from './components/pages/PoliceSignup';
import Dashboard from './components/pages/Dashboard';
import FileComplaintPage from './components/pages/FileComplaint';
import SigninPage from './components/pages/SigninPage';
import DashboardLayout from './components/Layout/DashboardLayout';
import MyComplaints from './DashboardComponents/MyComplaints';
import NearestStations from './DashboardComponents/NearestPoliceStations';
import PoliceDashboard from './components/pages/PoliceDashboard';
import ProfileSettings from './DashboardComponents/ProfileSettings';
import SignupWithAadhaar from './components/pages/aadharSignup';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage/>} />
          <Route path='/signup/user' element={<SignupWithAadhaar/>} />
          {/* <Route path='/signupAadhar' element={<SignupWithAadhaar/>} /> */}
          <Route path='/signup/police' element={<PoliceSignupPage/>} />
          <Route path='/signin' element={<SigninPage/>} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="myComplaints" element={<MyComplaints/>} />
            {/* <Route path="nearestPoliceStations" element={<NearestStations/>} /> */}
            {/* <Route path="profileSettings" element={<ProfileSettings/>} /> */}
          </Route>
          <Route path='/policeDashboard' element={<PoliceDashboard/>} />
          {/* Redirect root to dashboard */}
          {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}

          {/* Catch all other routes and redirect to dashboard */}
          {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}

          <Route path='/dashboard/police' element={<Dashboard />} />
          <Route path='/fileComplaint' element={<FileComplaintPage/>} />
        </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App
