
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./features/auth/authContext";
const App = () => {
  return (
      <AuthProvider>
     <AppRoutes />
   </AuthProvider>
  )
};

export default App