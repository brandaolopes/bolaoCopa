import { useState, useEffect } from 'react';
import { ToastAndroid } from 'react-native';
import { FlatList } from 'native-base';
import { api } from '../services/api';
import { Game, GameProps } from '../components/Game';
import { Loading } from './Loading';
import { EmptyMyPoolList } from './EmptyMyPoolList';


interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {

  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');


  async function fetchGames() {
    try {
      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games)
    } catch (error) {
      console.log(error)
      ToastAndroid.showWithGravity("Não foi possível obter os dados do bolão", ToastAndroid.LONG, ToastAndroid.CENTER);

  } finally {
      setIsLoading(false)
  }
  }


  async function handleGuessConfirm(gameId: string) {
    try {
      
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return ToastAndroid.showWithGravity("É preciso informar o placar do seu palpite", ToastAndroid.LONG, ToastAndroid.CENTER);
      }
      setIsLoading(true)
      const response = await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      } );

      if (response.status === 201) {
        ToastAndroid.showWithGravity("Palpite enviado com sucesso!", ToastAndroid.LONG, ToastAndroid.CENTER);
      }

      fetchGames();
      

    } catch (error) {
      console.log(error)

      ToastAndroid.showWithGravity("Não foi possível confirmar o seu palpite...", ToastAndroid.LONG, ToastAndroid.CENTER);
    }
  }

  async function handleCalcPoints(gameId: string) {
    //pegar resultado do jogo e comparar com o palpite. depois enviar pontuação para o banco
    
    ToastAndroid.showWithGravity("Pontuação atualizada com sucesso!", ToastAndroid.LONG, ToastAndroid.CENTER);
    
  }

  useEffect(() => {
    fetchGames();
  }, [])


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
            onGuessConfirm={() => handleGuessConfirm(item.id)}
            onCalcPoints={() => handleCalcPoints(item.id)}
          />
        )}
      />
    
  );
}
