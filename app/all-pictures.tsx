import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { getAllImages } from './_picture/aws';
import { useReturnToCamera } from './hooks/useReturnToCamera';
import { clearBadgeCount } from './lib/Notifications';

export default function AllPictures() {
  const returnToCamera = useReturnToCamera();
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  const handlePress = () => {
    returnToCamera();
  };

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      clearBadgeCount();
      const urls = await getAllImages();
      if (!urls) return;
      setUrls(urls);
      setLoading(false);
    };
    fetchImages();
  }, []);

  const renderImages = () => {
    if (!urls.length) return;
    return urls.map((url, index) => (
      <Image
        key={url}
        source={{ uri: url }}
        style={{ width: 100, height: 100 }}
      />
    ));
  };

  return (
    <View>
      <Text>Pictures will go here...someday</Text>
      <Pressable onPress={handlePress}>
        <Text>Go back to camera</Text>
      </Pressable>

      {renderImages()}
      {loading && <Text>Loading...</Text>}
    </View>
  );
}
