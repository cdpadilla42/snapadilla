import { CameraCapturedPicture } from 'expo-camera';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import useSnapadillaStore from '../../lib/store/useSnapadillaStore';
import CameraComponent from './CameraComponent';

export default function Camera() {
  const { setUri, setUriType } = useSnapadillaStore();
  const router = useRouter();

  const onCaptureMedia = async (
    media: CameraCapturedPicture | { uri: string; type: 'video' }
  ) => {
    if ('type' in media) {
      setUriType(media.type);
    } else {
      setUriType('picture');
    }
    setUri(media?.uri);
    router.navigate('/picture');
  };

  const onNotificationPress = () => {
    router.navigate('/all-pictures');
  };

  return (
    <View style={styles.container}>
      <CameraComponent
        onCaptureMedia={onCaptureMedia}
        onNotificationPress={onNotificationPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  shutterContainer: {
    position: 'absolute',
    bottom: 44,
    left: 0,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: 'transparent',
    borderWidth: 5,
    borderColor: 'white',
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
});
