
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./features/auth/authContext";
import { RoomProvider } from "./features/rooms/providers/RoomContext";
import { PeerProvider } from "./features/rooms/providers/PeerContext";
const App = () => {
  return (
      <AuthProvider>
      <RoomProvider>
        <PeerProvider>
          <AppRoutes />
        </PeerProvider>
      </RoomProvider>
   </AuthProvider>
  )
};

export default App