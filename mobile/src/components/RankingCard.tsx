import { Avatar, Heading, HStack, Text, VStack, Box } from 'native-base';


interface RankingCardProps {
    id: string;
    name: string;
    avatarUrl: string;
    points: number;
    position: number;
}



export function RankingCard({id, name, avatarUrl, points, position}: RankingCardProps) {
    return (
        <HStack
            w="full"
            h={20}
            bgColor="gray.800"
            borderBottomWidth={3}
            borderBottomColor="yellow.500"
            justifyContent="space-between"
            alignItems="center"
            rounded="sm"
            mb={3}
            p={4}
        >
            <HStack alignItems="center" justifyContent="space-between" flex={1}>
                <HStack>
                    <Avatar
                        source={{ uri: 'https://github.com/brandaolopes.png'}}
                        w={12}
                        h={12}
                        rounded="full"
                        borderWidth={2}
                        marginRight={2}
                        borderColor="gray.800"
                    />
                    <VStack>
                        <Heading color="white" fontSize="md" mt={2} fontFamily="heading">
                            Bruno
                        </Heading>

                        <Text color="gray.200" fontSize="sm">
                            40 ponto(s)
                        </Text>
                    </VStack>
                </HStack>
                <Box
                     
                    bgColor="yellow.500" 
                    rounded={"full"} 
                    w={8} h={6} 
                    alignItems="center" 
                    _text={{fontSize: "sm",
                        fontWeight: "bold",
                        color: "gray.800",}}
                >
                    1º
                </Box>
            </HStack>
        </HStack>
    )
}