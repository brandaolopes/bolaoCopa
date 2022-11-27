import { VStack, Heading, Text, ScrollView, HStack } from "native-base";
import { Header } from "../components/Header";

export function InfoScreen() {

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Regras dos Bolões" />
            <VStack mt={4} mx={5} alignItems="center">
                <Heading  fontFamily="heading" color="white" fontSize="md" textAlign="center" my={4}>
                    Pontuação das partidas
                </Heading>
                <Text color="gray.200" textAlign='justify' my={4} fontSize="md">
                    Cada partida valerá pontos de acordo com os critérios abaixo:
                </Text>
            </VStack>
            <ScrollView mt={4} mx={4}>
                <HStack justifyContent="space-between">
                    <Text marginLeft={6} color="gray.200" textAlign='justify'>
                        -{'>'} Placar exato
                    </Text>
                    <Text color="green.400" fontSize="md">
                        {'+'} 25 pontos
                    </Text>
                </HStack>
                <HStack borderBottomWidth={1}
                    borderBottomColor="gray.600"
                    mb={3}
                    pb={3}>
                    <Text marginLeft={12} color="gray.200" textAlign='justify'>
                        ex: Seu palpite 0x0 e a partida acabou 0x0.
                    </Text>
                </HStack>

                <HStack justifyContent="space-between">
                    <Text marginLeft={6} color="gray.200" textAlign='justify'>
                        -{'>'} Gols do vencedor
                    </Text>
                    <Text color="green.400" fontSize="md">
                        {'+'} 18 pontos
                    </Text>
                </HStack>
                <HStack borderBottomWidth={1}
                    borderBottomColor="gray.600"
                    mb={3}
                    pb={3}>
                    <Text marginLeft={12} color="gray.200" textAlign='justify'>
                        ex: Seu palpite 3x1 e a partida acaba 3x2.
                    </Text>
                </HStack>

                <HStack justifyContent="space-between">
                    <Text marginLeft={6} color="gray.200" textAlign='justify'>
                        -{'>'} Acerto apenas do vencedor
                    </Text>
                    <Text color="green.400" fontSize="md">
                        {'+'} 15 pontos
                    </Text>
                </HStack>
                <HStack borderBottomWidth={1}
                    borderBottomColor="gray.600"
                    mb={3}
                    pb={3}>
                    <Text marginLeft={12} color="gray.200" textAlign='justify'>
                        ex: seu palpite 3x1 e a partida acabou 4x0.
                    </Text>
                </HStack>

                <HStack justifyContent="space-between">
                    <Text marginLeft={6} color="gray.200" textAlign='justify'>
                        -{'>'} Empate
                    </Text>
                    <Text color="green.400" fontSize="md">
                        {'+'} 10 pontos
                    </Text>
                </HStack>
                <HStack borderBottomWidth={1}
                    borderBottomColor="gray.600"
                    mb={3}
                    pb={3}>
                    <Text marginLeft={12} color="gray.200" textAlign='justify'>
                        ex: seu palpite 3x3 e a partida acabou 0x0.
                    </Text>
                </HStack>

                <HStack justifyContent="space-between">
                    <Text marginLeft={6} color="gray.200" textAlign='justify'>
                        -{'>'} Jogos em que você não deu palpite
                    </Text>
                    <Text color="red.400" fontSize="md">
                         0 pontos
                    </Text>
                </HStack>
                <HStack borderBottomWidth={1}
                    borderBottomColor="gray.600"
                    mb={3}
                    pb={3}>
                </HStack>

                <HStack justifyContent="space-between">
                    <Text marginLeft={6} color="gray.200" textAlign='justify'>
                        -{'>'} Jogos em que você errou o vencedor
                    </Text>
                    <Text color="red.400" fontSize="md">
                         0 pontos
                    </Text>
                </HStack>
                <HStack borderBottomWidth={1}
                    borderBottomColor="gray.600"
                    mb={3}
                    pb={3}>
                </HStack>

                <HStack justifyContent="space-between">
                    <Text color="gray.200" fontSize='sm' textAlign='center'>
                        {'*'} A pontuação máxima por cada partida é 25 pontos.
                    </Text>
                    
                </HStack>
            </ScrollView>
        </VStack>
    )
}