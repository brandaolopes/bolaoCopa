import { VStack, Image, Heading } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";



export function Find() {

    const logo = require('../assets/logo.png');
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
                />

                <Button title="PESQUISAR BOLÃO" />

            </VStack>
        </VStack>
    );
}