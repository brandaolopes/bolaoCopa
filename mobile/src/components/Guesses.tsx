import { useState, useEffect } from 'react';
import { useToast, FlatList } from 'native-base';
import { api } from '../services/api';
import { Game, GameProps } from '../components/Game';
import { getName } from 'country-list';
import { Loading } from './Loading';
import { EmptyMyPoolList } from './EmptyMyPoolList';


interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {

  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');

  const toast = useToast();

  async function fetchGames() {
    try {
      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games)
    } catch (error) {
      console.log(error)

      toast.show({
          title: 'Ops... Não foi possível obter os dados do bolão. Tente novamente',
          position: 'top',
          bgColor: 'red.500',
      })
  } finally {
      setIsLoading(false)
  }
  }


  async function handleGuessConfirm(gameId: string) {
    try {
      setIsLoading(true)
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Ops... É preciso informar o placar do palpite',
          position: 'top',
          bgColor: 'red.500',
        })
      }

      const response = await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      } );

      if (response.status === 200) {
        toast.show({
          title: 'Palpite enviado com sucesso!',
          position: 'top',
          bgColor: 'green.500',
        })
      }

      setIsLoading(false)
      fetchGames();
      

    } catch (error) {
      console.log(error)

      toast.show({
          title: 'Ops... Não foi possível confirmar o seu palpite.',
          position: 'top',
          bgColor: 'red.500',
      })
    }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId])


  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
   
      <FlatList 
        data={games}
        keyExtractor={item => item.id}
        ListEmptyComponent={<EmptyMyPoolList code={code}/>}
        renderItem={({ item }) => (
          <Game 
            data={item}
            setFirstTeamPoints={setFirstTeamPoints}
            setSecondTeamPoints={setSecondTeamPoints}
            onGuessConfirm={() => {handleGuessConfirm(item.id)}}
          />
        )}
      />
    
  );
}
