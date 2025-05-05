import { reloadAppAsync } from 'expo';
import { osVersion } from 'expo-device';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export const useReturnToCamera = () => {
  const router = useRouter();
  const isMajor16 = (ver: string | null) => ver && /^16\./.test(ver);
  const returnToCamera = () => {
    if (Platform.OS === 'ios' && isMajor16(osVersion)) {
      console.log('iOS 16 detected');
      reloadAppAsync();
    } else {
      router.back();
    }
  };
  return returnToCamera;
};
