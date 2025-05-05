import { useIsFocused } from '@react-navigation/native';
import { useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { Button, StyleSheet, Text, View } from 'react-native';
import UserView from '../components/UserView';
import Camera from '../components/camera/Camera';
import useSnapadillaStore from '../lib/store/useSnapadillaStore';

export default function Index() {
  const isFocused = useIsFocused();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const { user } = useSnapadillaStore();
  const permissionsGranted =
    micPermission?.granted && cameraPermission?.granted;

  const requestPermission = async () => {
    if (cameraPermission?.granted === false) {
      const { status } = await requestCameraPermission();
      if (status === 'granted') {
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
      }
    }
    if (micPermission?.granted === false) {
      const { status } = await requestMicPermission();
      if (status === 'granted') {
        console.log('Microphone permission granted');
      } else {
        console.log('Microphone permission denied');
      }
    }
  };

  if (!micPermission || !cameraPermission) {
    return null;
  }

  if (!permissionsGranted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          Hey!{'\n\n'}We need your permission to use the camera and mic.{'\n\n'}
          Pretty please.{'\n\n'}
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }
  if (isFocused) return <>{user ? <Camera /> : <UserView />}</>;
  return <></>;
  // return <NotificationsComponent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
