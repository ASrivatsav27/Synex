
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./features/auth/authContext";
import { RoomProvider } from "./features/rooms/RoomContext";
const App = () => {
  return (
      <AuthProvider>
      <RoomProvider>
        <AppRoutes />
      </RoomProvider>
   </AuthProvider>
  )
};

export default App