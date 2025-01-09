import { Session } from "@supabase/supabase-js";

export interface eventlist {
  id: string;
  title: string;
  description: string;
  datetime: string;
  location: string;
  image: string;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}


export interface AuthContextType {
    session: Session | null;
    user: Session['user'] | null;
    isAuthenticated: boolean;
  }
