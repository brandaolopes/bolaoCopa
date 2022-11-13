import { useState } from 'react';
import { VStack, Image, Heading, Text, useToast } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";

import { api } from '../services/api';


export function New() {

    const logo = require('../assets/logo.png');

    const toast = useToast();

    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handlePoolCreate() {
        
        if (!title.trim()) {
            return toast.show({
                title: 'Ops.. Você esqueceu de informar o título do bolão.',
                placement: 'top',
                bgColor: 'red.500',
            })
        }

        try {
            setIsLoading(true)
            await api.post('/pools', { title: title })

            toast.show({
                title: 'Bolão criado com sucesso!',
                placement: 'top',
                bgColor: 'green.500',
            })

            setTitle('')

        } catch (error) {
            console.log(error)
            toast.show({
                title: 'Não foi possível criar o bolão. Tente novamente mais tarde.',
                placement: 'top',
                bgColor: 'red.500',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Criar novo bolão" />

            <VStack mt={8} mx={5} alignItems="center">
                <Image source={logo} alt="logo da aplicação" />

                <Heading fontFamily="heading" color="white" fontSize="xl" textAlign="center" my={8}>
                    Crie seu próprio bolão da Copa {'\n'} e compartilhe entre amigos!
                </Heading>

                <Input 
                    mb={2}
                    placeholder="Qual o nome do seu bolão?"
                    onChangeText={text => setTitle(text)}
                    value={title}
                />

                <Button title="CRIAR MEU BOLÃO"
                    onPress={handlePoolCreate}
                    isLoading={isLoading}
                />

                <Text color="gray.200" textAlign="center" mt={4} fontSize="sm">
                    Após criar o seu bolão você receberá um código único que poderá usar para convidar outras pessoas.
                </Text>
            </VStack>
        </VStack>
    );
}