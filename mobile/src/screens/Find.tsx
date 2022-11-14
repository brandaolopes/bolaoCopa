import { useState } from "react";
import { VStack, Image, Heading, useToast } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";

import { api } from '../services/api';
import { useNavigation } from "@react-navigation/native";


export function Find() {

    const logo = require('../assets/logo.png');

    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState('')

    const toast = useToast();

    const { navigate } = useNavigation()

    async function handleJoinPool() {
        try {
            setIsLoading(true);
            if (!code.trim()) {
                setIsLoading(false)
                return toast.show({
                    title: 'Digite o código do bolão!',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }

            const response = await api.post('/pools/join', { code: code });
            console.log(response.data)
            
            setIsLoading(false)

            toast.show({
                title: `Bem vindo ao ${response.data.message}`,
                placement: 'top',
                bgColor: 'green.500'
            })

            navigate('pools')

        } catch (error) {
            console.log(error)
            setIsLoading(false);

            if (error.reponse?.data?.message === 'No pool found') {
               return toast.show({
                    title: 'Não localizamos bolão com esse código. Tente novamente',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }

            if (error.reponse?.data?.message === "You've already joined this poll!") {
                return toast.show({
                    title: 'Você já faz parte deste bolão',
                    placement: 'top',
                    bgColor: 'red.500'
                })
            }

            toast.show({
                title: 'Não foi possível encontrar o bolão.',
                placement: 'top',
                bgColor: 'red.500'
            })
            
        } 
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Encontrar bolão pelo código" showBackButton />

            <VStack mt={8} mx={5} alignItems="center">
                <Image source={logo} alt="logo da aplicação" />

                <Heading fontFamily="heading" color="white" fontSize="xl" textAlign="center" my={8}>
                    Encontre um bolão através de {'\n'}seu código único
                </Heading>

                <Input 
                    mb={2}
                    placeholder="Qual o código do bolão?"
                    autoCapitalize="characters"
                    onChangeText={(text) => setCode(text)}
                    value={code}
                />

                <Button title="PESQUISAR BOLÃO" 
                    isLoading={isLoading}
                    onPress={handleJoinPool}
                />

            </VStack>
        </VStack>
    );
}