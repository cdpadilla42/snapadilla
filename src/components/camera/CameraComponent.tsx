import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useIsFocused } from '@react-navigation/native';
import {
  CameraCapturedPicture,
  CameraMode,
  CameraType,
  CameraView,
} from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getBadgeCount } from '../../lib/Notifications';

type CameraComponentProps = {
  onCaptureMedia: (
    photo: CameraCapturedPicture | { uri: string; type: 'video' }
  ) => void;
  onNotificationPress: () => void;
};

export default function CameraComponent({
  onCaptureMedia,
  onNotificationPress,
}: CameraComponentProps) {
  const isFocused = useIsFocused();
  const [mode, setMode] = useState<CameraMode>('picture');
  const [facing, setFacing] = useState<CameraType>('back');
  const [recording, setRecording] = useState(false);

  const ref = useRef<CameraView>(null);
  const [mute, setMute] = useState(true);
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    const fetchBadgeCount = async () => {
      const count = await getBadgeCount();
      setBadgeCount(count);
    };
    fetchBadgeCount();
  }, []);

  useEffect(() => {
    if (mode === 'video') {
      // setTimeout(() => {
      setMute(false);
      // }, 250);
    } else {
      setMute(true);
    }
  }, [mode]);

  useEffect(() => {
    console.log('mounting camera');
    return () => console.log('unmounting camera');
  }, []);

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    if (photo) onCaptureMedia(photo);
  };

  const endRecordingVideo = async () => {
    console.log('ending video recording');
    setRecording(false);
    ref.current?.stopRecording();
    return;
  };

  const startRecordingVideo = async () => {
    console.log('starting video recording');
    setRecording(true);
    const video = await ref.current?.recordAsync();
    if (video) onCaptureMedia({ ...video, type: 'video' });
  };

  const handlePress = () => {
    if (mode === 'picture') {
      takePicture();
    }
  };

  const handleTouchStart = () => {
    if (mode === 'video') {
      startRecordingVideo();
    }
  };

  const handleTouchEnd = () => {
    if (mode === 'video') {
      endRecordingVideo();
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'picture' ? 'video' : 'picture'));
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  return (
    <>
      <CameraView
        style={styles.camera}
        ref={ref}
        mode={mode}
        facing={facing}
        mute={mute}
        responsiveOrientationWhenOrientationLocked
        active={isFocused}
        onMountError={(error) => {
          console.error('Camera error:', error);
        }}
      />
      <View style={styles.topLayerContainer}>
        <Pressable onPress={onNotificationPress}>
          <View style={styles.notificationsIcon}>
            {badgeCount > 0 && (
              <Text style={styles.notificationsIconText}>1</Text>
            )}
          </View>
        </Pressable>
      </View>
      <View style={styles.shutterContainer}>
        <Pressable onPress={toggleMode}>
          {mode === 'picture' ? (
            <AntDesign name="picture" size={32} color="white" />
          ) : (
            <Feather name="video" size={32} color="white" />
          )}
        </Pressable>
        <Pressable
          onPress={handlePress}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {({ pressed }) => (
            <View
              style={[
                styles.shutterBtn,
                {
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.shutterBtnInner,
                  {
                    backgroundColor: mode === 'picture' ? 'white' : 'red',
                  },
                ]}
              />
            </View>
          )}
        </Pressable>
        <Pressable onPress={toggleFacing}>
          <FontAwesome6 name="rotate-left" size={32} color="white" />
        </Pressable>
      </View>
    </>
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
  topLayerContainer: {
    position: 'absolute',
    top: 44,
    right: 0,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row-reverse',
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
  notificationsIcon: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: 'green',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationsIconText: {
    color: 'white',
    fontSize: 20,
  },
});
