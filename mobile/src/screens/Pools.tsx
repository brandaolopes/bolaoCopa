import { useCallback, useState } from 'react';
import { VStack, Icon, useToast, FlatList } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { EmptyPoolList } from '../components/EmptyPoolList';
import { PoolCard, PoolProps } from '../components/PoolCard';
import { Loading } from '../components/Loading'; 
import { Octicons } from '@expo/vector-icons';
import { api } from '../services/api';

import { useNavigation, useFocusEffect } from '@react-navigation/native';


export function Pools() {

    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(true);

    const [pools, setPools] = useState<PoolProps[]>([]);

    const toast = useToast();

    async function fetchPools() {
        try {
            setIsLoading(true);
            const response = await api.get('/pools') 
            setPools(response.data.pools)
        } catch (error) {
            console.log(error)

            toast.show({
                title: 'Ops... Não foi possível obter os dados dos bolões. Tente novamente',
                position: 'top',
                bgColor: 'red.500',
            })

        } finally {
            setIsLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchPools();
    }, []))

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Meus Bolões" />

            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
                <Button 
                    title="BUSCAR BOLÃO POR CÓDIGO" 
                    leftIcon={<Icon as={Octicons} name="search" size="md" color="black" />}
                    onPress={() => navigation.navigate('find')}
                    />
            </VStack>
            {isLoading ? <Loading /> : 
            <FlatList 
                data={pools}
                keyExtractor={ item => item.id}
                renderItem={ ({ item }) => <PoolCard data={item} />}
                px={5}
                showsVerticalScrollIndicator={false}
                _contentContainerStyle={{ pb: 10}}
                ListEmptyComponent={ () => <EmptyPoolList />}
                />}
        </VStack>
    )
}