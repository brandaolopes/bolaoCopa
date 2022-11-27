import { useState, useCallback } from "react";
import { api } from "../services/api";
import { EmptyRakingList } from "./EmptyRakingList";
import { RankingCard } from './RankingCard'
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { Text, VStack } from 'native-base';
import { Loading } from "./Loading";


interface RouteParams {
    id: string;
}

interface PoolRouteParams {
    poolId: string;
}

interface ParticipantProps {
    id: string;
    name: string;
    avatarUrl: string;
    guesses?: [];
    points?: number;
}

export function Ranking( poolId: PoolRouteParams) {

    const route = useRoute();

    const { id } = route.params as RouteParams

    const [rankingData, setRankingData] = useState<ParticipantProps[]>();
    const [isLoading, setIsLoading] = useState(false)

    const [userData, setUserData] = useState({} as ParticipantProps);

    async function fetchTotalPoints() {
        try {
            const response = await api.get(`/pools/${id}/participants/guesses`) 

            const pool = response.data

             
            
            
           



           
           
        } catch (error) {
            console.log(error)
        }
    }

    async function fetchUserPoints() {
        try {
            setIsLoading(true)
            const reponse = await api.get(`/pools/${id}/participant/guesses`)
            const userTotalPoints = reponse.data.totalPoints
            const responseMe = await api.get(`/me`)
            const me = responseMe.data

            if (reponse.data && responseMe.data) {
                setUserData({
                    id: me.user.sub,
                    name: me.user.name,
                    avatarUrl: me.user.avatarUrl,
                    points: userTotalPoints
                })
            }
            
            
        } catch (error) {
            console.log(error)
        } finally{
            setIsLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchUserPoints();
    }, []))
    
       
    return (
        isLoading ? (
            <Loading />
        ) : (
            <VStack mt={2}
        pb={2}  
        >
            <VStack 
                mx={5} borderBottomWidth={1}
                borderBottomColor="gray.600"
                pb={2}
                mb={2}
                alignItems="center"
                justifyContent="center"
                >
                <Text color="white" fontSize="sm" fontFamily="heading">Sua Pontuação</Text>
                <RankingCard name={userData.name}
                    avatarUrl={userData.avatarUrl}
                    points={userData.points}
                    id={userData.id}
                />
            </VStack>
            <EmptyRakingList />
        </VStack>
        )

    )
    
        
    


}