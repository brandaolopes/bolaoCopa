import { HStack, Text, useTheme, VStack, Button } from 'native-base';
import { X, Check } from 'phosphor-react-native';
import { getName } from 'country-list';
import dayJS from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
import ptBR from 'dayjs/locale/pt-br';

import { Team } from './Team';
import { useState } from 'react';

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

export function Game({ data, setFirstTeamPoints, setSecondTeamPoints, onGuessConfirm, onCalcPoints}: Props) {
  const { colors, sizes } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  dayJS.extend(utc)
  dayJS.extend(tz)

  const when = dayJS(data.date).add(3, 'hours').tz('America/Fortaleza').locale(ptBR).format("DD [de] MMMM [de] YYYY [às] HH:00[h]")
  //dayJS(data.date).locale(ptBR).format("DD [de] MMMM [de] YYYY [às] HH:00[h]")
  const now = dayJS().format()
  const whenFortmated = Date.parse(dayJS(data.date).add(3, 'hours').format())


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

      {whenFortmated > Date.parse(now) && !data.guess ? (
        
      <Button size="xs" w="full" bgColor="green.500" mt={4} onPress={() => {setIsLoading(true); onGuessConfirm();}} isLoading={isLoading}>
        <HStack alignItems="center">
          <Text color="white" fontSize="xs" fontFamily="heading" mr={3}>
            CONFIRMAR PALPITE
          </Text>

          <Check color={colors.white} size={sizes[4]} />
        </HStack>
      </Button>
        
      ) : ''}

      {whenFortmated < Date.parse(now) && data.firstTeamResultPoints !== null && data.guess?.guessResultPoints < 0 ? (
        
        <Button size="xs" w="full" bgColor="yellow.500" mt={4} onPress={() => {setIsLoading(true); onCalcPoints();}} isLoading={isLoading}>
          <HStack alignItems="center">
            <Text color="gray.800" fontSize="xs" fontFamily="heading" mr={3}>
              CALCULAR PONTUAÇÃO
            </Text>

            <Check color={colors.white} size={sizes[4]} />
          </HStack>
        </Button>
      ) : ''}

      {data.firstTeamResultPoints !== null && data.guess?.guessResultPoints >= 0 ? (

        <Text color="gray.100" fontFamily="heading" fontSize="sm" >Sua pontuação: {data.guess.guessResultPoints}</Text>
      ) : ''}


    </VStack>
  );
}