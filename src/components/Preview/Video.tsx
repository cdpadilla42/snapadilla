import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View } from 'react-native';

export default function VideoScreen({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  return (
    <View>
      <VideoView style={styles.video} player={player} nativeControls={false} />
      {/* <View style={styles.controlsContainer}>
        <Button
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          }}
        />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  video: {
    width: 300,
    aspectRatio: 1,
  },
  controlsContainer: {
    padding: 10,
  },
});
