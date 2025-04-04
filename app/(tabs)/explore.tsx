import { StyleSheet, Image, ScrollView, View, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

const API_KEY = 'e3d736e2e4cda6fb4c831ad32e509837b1aaa078';
const URL = `https://www.giantbomb.com/api/games/?api_key=${API_KEY}&format=json&field_list=id,name,genres,image,platforms&limit=10`;

interface Game {
  id: number;
  title: string;
  genre: string;
  image: string;
  platforms: string;
}

export default function TabTwoScreen() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(URL);
        const data = await response.json();

        if (data && data.results) {
          const gameList = data.results.map((game: any) => ({
            id: game.id,
            title: game.name,
            genre: game.genres?.map((g: any) => g.name).join(', ') || 'Unknown',
            image: game.image?.original_url || '',
            platforms: game.platforms?.map((p: any) => p.name).join(', ') || 'Unknown',
          }));
          setGames(gameList);
        } else {
          throw new Error('Invalid response data');
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (isLoading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  if (error) {
    return <ThemedText>Something went wrong: {error}</ThemedText>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        {games.map((game) => (
          <TouchableOpacity key={game.id} onPress={() => router.push({ pathname: '/game/[id]', params: { id: game.id, title: game.title, genre: game.genre, platforms: game.platforms, image: game.image } })}>
            <View style={styles.gameItem}>
              {game.image && <Image source={{ uri: game.image }} style={styles.gameImage} />}
              <ThemedText type="title" style={styles.title}>{game.title}</ThemedText>
              <ThemedText style={styles.genre}>Genre: {game.genre}</ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  container: {
    alignItems: 'center',
  },
  gameItem: {
    marginBottom: 30,
    alignItems: 'center',
  },
  gameImage: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  title: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  genre: {
    marginTop: 5,
    fontSize: 18,
    textAlign: 'center',
  },
});