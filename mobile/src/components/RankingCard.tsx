import { Avatar, Heading, HStack, Text, VStack, Box } from 'native-base';
import { Medal } from 'phosphor-react-native';


interface RankingCardProps {
    id?: string;
    name?: string;
    avatarUrl?: string;
    points: number;
    position?: number;
}



export function RankingCard({id, name, avatarUrl, points, position}: RankingCardProps) {
    return (
        <HStack
            w="full"
            h={16}
            bgColor="gray.800"
            borderBottomWidth={3}
            borderBottomColor="yellow.500"
            justifyContent="space-between"
            alignItems="center"
            rounded="sm"
            mb={1}
            p={2}
        >
            <HStack alignItems="center" justifyContent="space-between" flex={1}>
                <HStack>
                    <Avatar
                        source={{ uri: avatarUrl }}
                        w={12}
                        h={12}
                        rounded="full"
                        borderWidth={2}
                        marginRight={2}
                        borderColor="gray.800"
                    />
                    <VStack>
                        <Heading color="white" fontSize="md" mt={2} fontFamily="heading">
                            {name}
                        </Heading>

                        <Text color="gray.200" fontSize="sm">
                            {points} ponto(s)
                        </Text>
                    </VStack>
                </HStack>
                {position ? (
                    <Box
                        
                        bgColor="yellow.500" 
                        rounded={"full"} 
                        w={8} h={6} 
                        alignItems="center" 
                        _text={{fontSize: "sm",
                            fontWeight: "bold",
                            color: "gray.800",}}
                    >
                        {position}º
                    </Box>
                ) : (
                <Box
                     
                    bgColor="yellow.500" 
                    rounded={"full"} 
                    w={8} h={8} 
                    alignItems="center" 
                    justifyContent="center"
                >
                    <Medal color='gray' size={22} />
                </Box>
                )}
            </HStack>
        </HStack>
    )
}