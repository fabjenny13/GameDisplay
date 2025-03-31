import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import {useEffect, useState} from 'react';
import { fixCurrentParams } from 'expo-router/build/fork/getPathFromState-forks';


const URL = `https://www.giantbomb.com/api/game/3030-4725/?api_key=e3d736e2e4cda6fb4c831ad32e509837b1aaa078&format=json&field_list=genres,name`;

interface Game
{
  id: number
  title: string
  genre: string
  platform: string
}

export default function TabTwoScreen() {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [game, setGame] = useState<Game>();

  useEffect(() => {
    const fetchGame = async () => 
    {
      setIsLoading(true);

      try {
      const response = await fetch(`${URL}`);
      const game = await response.json() as Game;
      setGame(game);

      } catch(error: any){
        setError(error);
      }

      setIsLoading(false);
    };

    fetchGame();
  }, []);

  if (isLoading)
  {
    return <ThemedText>Loading...</ThemedText>;
  }

  if(error)
  {
    return <ThemedText>Something went wrong. Please try again.</ThemedText>;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  otherContainer: {
    flex: 1,
    backgroundColor: 'green',
    justifyContent: 'center',
    textAlign: 'center',
  },
});
