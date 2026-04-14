import { createContext, type ReactNode,useState } from "react";
import type { RoomResponse} from "./types/room.types";
import { createRoom } from "./services/room.api";


type RoomContextType = {
    loading: boolean
    handleCreateRoom: () => Promise<RoomResponse>

}

export const RoomContext = createContext<RoomContextType | null>(null)

type RoomContextProps = {
    children: ReactNode
}

export function RoomProvider({ children }: RoomContextProps) {
    const [loading, setLoading] = useState(false);
    const handleCreateRoom = async (): Promise<RoomResponse> => {
  setLoading(true);
  try {
    const data = await createRoom();
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    setLoading(false);
  }
};

    return (<RoomContext.Provider value={{loading,handleCreateRoom}}
    >
        {children}
    </RoomContext.Provider>)
}

