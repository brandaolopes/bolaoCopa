import { useState, useEffect } from "react";
import { api } from "../services/api";
import { EmptyRakingList } from "./EmptyRakingList";
import { RankingCard } from './RankingCard'
import { useRoute } from '@react-navigation/native';
import { Text } from 'native-base';


interface RouteParams {
    id: string;
}

interface PoolRouteParams {
    poolId: string;
}

interface ParticipantProps {
    id: string;
    user: {
        name: string;
        avatarUrl: string;
      };
    guesses: [];
}

export function Ranking( poolId: PoolRouteParams) {

    const route = useRoute();

    const { id } = route.params as RouteParams

    const [rankingData, setRankingData] = useState<ParticipantProps[]>();

    async function fetchTotalPoints() {
        try {
            const response = await api.get(`/pools/${id}/participants/guesses`) 

            const pool = response.data

             
            
            
           

            console.log(pool)

           
           
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchTotalPoints();
    }, [id])

    
       
    return (
       rankingData ?  <RankingCard /> : <EmptyRakingList />
    )
    
        
    


}