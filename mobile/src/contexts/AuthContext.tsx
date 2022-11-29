import { createContext, ReactNode, useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { api } from '../services/api';

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
    name: string;
    avatarURL: string;
}

interface AuthProviderProps {
    children: ReactNode;
}

export interface AuthContextDataProps {
    user: UserProps;
    isUserLoading: boolean;
    signIn: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {

    const [isUserLoading, setIsUserLoading] = useState(false);
    const [user, setUser] = useState<UserProps>({} as UserProps);

    //atenção para o androidClientId que é necessário para o apk
    //para expo go usar -> clientId: process.env.GOOGLE_CLIENT_ID_GENERAL,
    const [request, response, promptAsync] = Google.useAuthRequest({
        
        androidClientId: process.env.GOOGLE_CLIENT_ID_ANDROID,
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
        scopes: ["profile", "email"],
        
    });



    async function signIn() {
        try {
            setIsUserLoading(true);
            await promptAsync();
        } catch (error) {
            console.log(error);
            throw error;
        } finally{
            setIsUserLoading(false);
        }
    }


    async function signInWithGoogle(access_token: string) {
        
        try {
            setIsUserLoading(true)
            const tokenResponse = await api.post('/users', {
                access_token: access_token
            })

            api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data}`

            console.log(tokenResponse.data)

            const userinfoResponse = await api.get('/me');

            setUser(userinfoResponse.data.user)

            console.log(userinfoResponse.data.user)


        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setIsUserLoading(false)
        }
        
    }

    useEffect(() => {
        if (response?.type === "success" && response.authentication?.accessToken) {
            signInWithGoogle(response.authentication.accessToken)
        }
    }, [response])
    
    return (
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user,

        }}>
        
            {children}
        </AuthContext.Provider>
    )
}