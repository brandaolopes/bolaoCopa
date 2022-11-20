import { TouchableOpacity } from 'react-native';
import { HStack, Text, useTheme, VStack, Box } from 'native-base';
import { X } from 'phosphor-react-native';
import { getName } from 'country-list';
import dayJS from 'dayjs';
import ptBR from 'dayjs/locale/pt-br';

import { Team } from './Team';

interface GuessProps {
  id: string;
  gameId: string;
  createdAt: string;
  participantId: string;
  firstTeamPoints: number;
  secondTeamPoints: number;
  guessResultPoints?: number | null;
}

export interface GameProps {
  id: string;
  date: string;
  firstTeamCountryCode: string;
  secondTeamCountryCode: string;
  firstTeamResultPoints: number;
  secondTeamResultPoints: number;
  guess: null | GuessProps;
}

interface Props {
  data: GameProps;
  onGuessConfirm: () => void;
  onCalcPoints: () => void;
  setFirstTeamPoints: (value: string) => void;
  setSecondTeamPoints: (value: string) => void;
}

export function Game({ data, setFirstTeamPoints, setSecondTeamPoints, onGuessConfirm, onCalcPoints }: Props) {
  const { colors, sizes } = useTheme();

  const when = dayJS(data.date).locale(ptBR).format("DD [de] MMMM [de] YYYY [às] HH:00[h]")

  return (
    <VStack
      w="full"
      bgColor="gray.800"
      rounded="sm"
      alignItems="center"
      borderBottomWidth={3}
      borderBottomColor="yellow.500"
      mb={3}
      p={4}
    >
      <Text color="gray.100" fontFamily="heading" fontSize="sm">
        {getName(data.firstTeamCountryCode)} {data.firstTeamResultPoints} X {data.secondTeamResultPoints} {getName(data.secondTeamCountryCode)}
      </Text>

      <Text color="gray.200" fontSize="xs">
        {when}
      </Text>

      <HStack mt={4} w="full" justifyContent="space-between" alignItems="center">
        <Team
          code={data.firstTeamCountryCode}
          position="right"
          onChangeText={setFirstTeamPoints}
        />

        <X color={colors.gray[300]} size={sizes[6]} />

        <Team
          code={data.secondTeamCountryCode}
          position="left"
          onChangeText={setSecondTeamPoints}
        />
      </HStack>

      {!data.guess ? (
        
          <TouchableOpacity onPress={onGuessConfirm}>
            <HStack alignItems="center">
              <Box mt={4} rounded="md" p={2} 
                bgColor="green.500"
                _text={{ fontSize: 'xs', fontFamily: "heading" , color: 'white' }}>
                CONFIRMAR PALPITE
              </Box>

              
            </HStack>
          </TouchableOpacity>
        
      ) : !data.guess.guessResultPoints ? 
      (
      
        <TouchableOpacity onPress={onCalcPoints}>
          <Box w="full" mt={4} rounded="md" p={2} 
            bgColor="yellow.500"
            _text={{ fontSize: 'xs', fontFamily: "heading" , color: 'gray.800' }}>
            CALCULAR PONTUAÇÃO
          </Box>
        </TouchableOpacity>
      
      ) : <Text color="gray.100" fontFamily="heading" fontSize="sm" >Sua pontuação: {data.guess.guessResultPoints}</Text>}


    </VStack>
  );
}