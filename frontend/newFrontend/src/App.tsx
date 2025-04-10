import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignupPage from './components/pages/SignupPage';
import { LandingPage } from './components/pages/LandingPage';
import PoliceSignupPage from './components/pages/PoliceSignup';
import { Dashboard } from './components/pages/Dashboard';
import FileComplaintPage from './components/pages/FileComplaint';
import SigninPage from './components/pages/SigninPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage/>} />
          <Route path='/signup/user' element={<SignupPage/>} />
          <Route path='/signup/police' element={<PoliceSignupPage/>} />
          <Route path='/signin' element={<SigninPage/>} />
          <Route path='/dashboard/user' element={<Dashboard/>} />
          <Route path='/dashboard/police' element={<Dashboard />} />
          <Route path='/fileComplaint' element={<FileComplaintPage/>} />
        </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App
