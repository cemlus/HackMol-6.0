import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignupPage from './components/pages/SignupPage';
import { SigninPage } from './components/pages/SigninPage';
import { LandingPage } from './components/pages/LandingPage';
import { PoliceSignupPage } from './components/pages/PoliceSignup';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage/>} />
          <Route path='/signup/user' element={<SignupPage/>} />
          <Route path='/signup/police' element={<PoliceSignupPage/>} />
          <Route path='/signin' element={<SigninPage/>} />
        </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App
