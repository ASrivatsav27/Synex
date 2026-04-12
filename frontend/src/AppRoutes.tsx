import { Route, Routes, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignInPage from "./features/auth/pages/SignInPage";
import SignUpPage from "./features/auth/pages/SignUpPage";
import JoinMeeting from "./features/meetings/pages/JoinMeeting";



const AppRoutes = () => {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<HomePage/>} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/meeting" element={<JoinMeeting/>} />
          </Routes>
      </BrowserRouter>
  )
}

export default AppRoutes