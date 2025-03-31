import { StyleSheet, Image, View } from 'react-native';
import { useEffect, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const API_KEY = 'e3d736e2e4cda6fb4c831ad32e509837b1aaa078';
const GAME_ID = '3030-4725';
const URL = `https://www.giantbomb.com/api/game/${GAME_ID}/?api_key=${API_KEY}&format=json&field_list=genres,name,image`;

interface Game {
  id: number;
  title: string;
  genre: string;
  image: string;
}

export default function TabTwoScreen() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(URL);
        const data = await response.json();

        if (data && data.results) {
          setGame({
            id: data.results.id,
            title: data.results.name,
            genre: data.results.genres?.map((g: any) => g.name).join(', ') || 'Unknown',
            image: data.results.image?.original_url || '',
          });
        } else {
          throw new Error('Invalid response data');
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, []);

  if (isLoading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  if (error) {
    return <ThemedText>Something went wrong: {error}</ThemedText>;
  }

  return (
    <ThemedView style={styles.container}>
      {game?.image && <Image source={{ uri: game.image }} style={styles.gameImage} />}
      <ThemedText type="title" style={styles.title}>{game?.title || 'Unknown Game'}</ThemedText>
      <ThemedText style={styles.genre}>Genre: {game?.genre}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameImage: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  genre: {
    marginTop: 10,
    fontSize: 18,
  },
});
