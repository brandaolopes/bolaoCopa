import { useState, useEffect } from 'react';
import { Share } from 'react-native';
import { HStack, useToast, VStack } from 'native-base';
import { Header } from '../components/Header';
import { useRoute } from '@react-navigation/native';
import { Loading } from '../components/Loading';

import { api } from '../services/api';

import { PoolProps } from '../components/PoolCard';
import { PoolHeader } from '../components/PoolHeader';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Option } from '../components/Option';
import { Guesses } from '../components/Guesses';
import { Ranking } from '../components/Ranking';

interface RouteParams {
    id: string;
}


export function Details() {

    const route = useRoute();

    const toast = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses');
    const [poolDetails, setPoolDetails] = useState<PoolProps>({} as PoolProps);

    const { id } = route.params as RouteParams

    async function fethPoolDetails() {
        try {
          setIsLoading(true)
          const response = await api.get(`/pools/${id}`)
          setPoolDetails(response.data.pool) 
        } catch (error) {
            console.log(error)

            toast.show({
                title: 'Ops... Não foi possível obter os dados do bolão. Tente novamente',
                position: 'top',
                bgColor: 'red.500',
            })
        } finally {
            setIsLoading(false)
        }
    }


    async function handleCodeShare() {
        Share.share({
            title: 'O código para entrar no bolão é:',
            message: poolDetails.code,
        })
    }

   useEffect(() => {
    fethPoolDetails();
   }, [id])

    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title={poolDetails.title} 
                showBackButton 
                showShareButton
                onShare={handleCodeShare}
                />
            {
                poolDetails._count?.participants > 0 ? 
                <VStack flex={1} px={5}>
                    <PoolHeader data={poolDetails}/>
                    <HStack bgColor='gray.800' p={1} mb={5} rounded='sm'>
                        <Option title='Seus palpites' isSelected={optionSelected === 'guesses'} onPress={() => setOptionSelected('guesses')}/>
                        <Option title='Ranking do grupo' isSelected={optionSelected === 'ranking'} onPress={() => setOptionSelected('ranking')}/>
                    </HStack>

                    {optionSelected === 'guesses' ? <Guesses poolId={poolDetails.id} code={poolDetails.code}/> : <Ranking poolId={poolDetails.id}/> }
                    
                    
                </VStack> : <EmptyMyPoolList code={poolDetails.code}/>
            }
        </VStack>
    )
}