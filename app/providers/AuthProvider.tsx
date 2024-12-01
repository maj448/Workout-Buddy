//This code is from https://notjust.notion.site/React-Native-Supabase-Masterclass-47a69a60bc464c399b5a0df4d3c4a630
// a tutorial made to connect a react native expo app to supabase

//This code allows all code wrapped within the AuthProvider can access the session and profile without having to requery the database

import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { Session } from "@supabase/supabase-js";

type AuthData = {
    session: Session | null;
    loading : boolean
    profile: any
};
const AuthContext = createContext<AuthData>({
    session: null,
    loading: true, 
    profile: null,
});

export default function AuthProvider({children}: PropsWithChildren)
{

    const [session, setSession] = useState<Session | null> (null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect (() => {
        const fetchSession = async() =>{
            const {data: { session },} = await supabase.auth.getSession();

            setSession(session);

            if (session) {
                const { data } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single();
                setProfile(data || null);
              }

            setLoading(false);
        }
        fetchSession();
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
          });
    }, [])


    return <AuthContext.Provider value= {{session, loading, profile}}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);