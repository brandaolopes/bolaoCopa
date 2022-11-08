import { VStack, Image, Heading, Text } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";



export function New() {

    const logo = require('../assets/logo.png');
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
                />

                <Button title="CRIAR MEU BOLÃO" />

                <Text color="gray.200" textAlign="center" mt={4} fontSize="sm">
                    Após criar o seu bolão você receberá um código único que poderá usar para convidar outras pessoas.
                </Text>
            </VStack>
        </VStack>
    );
}