import { Session } from "@supabase/supabase-js";

export interface eventlist {
  id: string;
  title: string;
  description: string;
  datetime: string;
  location: string;
  image_uri: string;
  dist_meters?: number | null | undefined;
  lat?: number;
  lng?: number;
  location_name: string;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}


export interface AuthContextType {
    session: Session | null;
    user: Session['user'] | null;
    isAuthenticated: boolean;
  }
