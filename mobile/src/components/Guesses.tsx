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

    try {
      setIsLoading(true)
      const game = games.find(game => game.id === gameId)
      
      if (game.guess && game.firstTeamResultPoints) {
        
          //acertou o placar
          if (game.firstTeamResultPoints === game.guess.firstTeamPoints && game.secondTeamResultPoints === game.guess.secondTeamPoints) {
            const response = await api.put(`/guess/${game.guess.id}`, {
              guessResultPoints: 25
            } )

            if (response.status === 201) {
              ToastAndroid.showWithGravity("Pontuação atualizada com sucesso!", ToastAndroid.LONG, ToastAndroid.CENTER);
            }
      
            fetchGames();

            return
          }

          //acertou a pontuação do vencedor
          if (game.firstTeamResultPoints > game.secondTeamResultPoints || game.secondTeamResultPoints > game.firstTeamResultPoints) {
            if (game.firstTeamResultPoints > game.secondTeamResultPoints && game.guess.firstTeamPoints === game.firstTeamResultPoints) {
              const response = await api.put(`/guess/${game.guess.id}`, {
                guessResultPoints: 18
              } )
      
              if (response.status === 201) {
                ToastAndroid.showWithGravity("Pontuação atualizada com sucesso!", ToastAndroid.LONG, ToastAndroid.CENTER);
              }
        
              fetchGames();
      
              return
            }

            if (game.secondTeamResultPoints > game.firstTeamResultPoints && game.guess.secondTeamPoints === game.secondTeamResultPoints) {
              const response = await api.put(`/guess/${game.guess.id}`, {
                guessResultPoints: 18
              } )
      
              if (response.status === 201) {
                ToastAndroid.showWithGravity("Pontuação atualizada com sucesso!", ToastAndroid.LONG, ToastAndroid.CENTER);
              }
        
              fetchGames();
      
              return
            }
          }

          //acertou o resultado empate
          if (game.secondTeamResultPoints === game.firstTeamResultPoints && game.guess.secondTeamPoints === game.guess.firstTeamPoints) {
            const response = await api.put(`/guess/${game.guess.id}`, {
              guessResultPoints: 10
            } )

            if (response.status === 201) {
              ToastAndroid.showWithGravity("Pontuação atualizada com sucesso!", ToastAndroid.LONG, ToastAndroid.CENTER);
            }
      
            fetchGames();

            return
          }

          //acertou somente o vencedor
          if (game.firstTeamResultPoints > game.secondTeamResultPoints || game.secondTeamResultPoints > game.firstTeamResultPoints) {
            if (game.firstTeamResultPoints > game.secondTeamResultPoints && game.guess.firstTeamPoints > game.guess.secondTeamPoints) {
              const response = await api.put(`/guess/${game.guess.id}`, {
                guessResultPoints: 15
              } )
      
              if (response.status === 201) {
                ToastAndroid.showWithGravity("Pontuação atualizada com sucesso!", ToastAndroid.LONG, ToastAndroid.CENTER);
              }
        
              fetchGames();
      
              return
            }

            if (game.secondTeamResultPoints > game.firstTeamResultPoints && game.guess.secondTeamPoints > game.guess.firstTeamPoints) {
              const response = await api.put(`/guess/${game.guess.id}`, {
                guessResultPoints: 15
              } )
      
              if (response.status === 201) {
                ToastAndroid.showWithGravity("Pontuação atualizada com sucesso!", ToastAndroid.LONG, ToastAndroid.CENTER);
              }
        
              fetchGames();
      
              return
            }
            
          }
          
        //não acertou nada.
        const response = await api.put(`/guess/${game.guess.id}`, {
          guessResultPoints: 0
        } )

        if (response.status === 201) {
          ToastAndroid.showWithGravity("Pontuação atualizada com sucesso!", ToastAndroid.LONG, ToastAndroid.CENTER);
        }

        fetchGames();

        return

      }
      
      ToastAndroid.showWithGravity("Você não enviou palpites para este jogo.", ToastAndroid.LONG, ToastAndroid.CENTER);

    } catch (error) {
        console.log(error)
        ToastAndroid.showWithGravity("Não foi possível atualizar sua pontuação", ToastAndroid.LONG, ToastAndroid.CENTER);
    } finally {
        setIsLoading(false)
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
            onGuessConfirm={() => handleGuessConfirm(item.id)}
            onCalcPoints={() => handleCalcPoints(item.id)}
          />
        )}
        _contentContainerStyle={{ pb: 20}}
      />
    
  );
}
