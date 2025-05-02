import { Image } from 'expo-image';
import { SaveFormat, useImageManipulator } from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { uploadFile } from './_picture/aws';
import VideoScreen from './_picture/Video';
import useSnapadillaStore from './_store/useSnapadillaStore';
import { useReturnToCamera } from './hooks/useReturnToCamera';

const isMajor16 = (ver: string | null) => ver && /^16\./.test(ver);

export default function ImagePreview() {
  const { setUri, setUriType, uri, uriType } = useSnapadillaStore();
  const router = useRouter();
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const context = useImageManipulator(uri);

  const returnToCamera = useReturnToCamera();

  const clearState = () => {
    setUri('');
    setUriType('');
  };

  const closeOutOfPreview = () => {
    clearState();
    returnToCamera();
  };

  const handleSend = async () => {
    setSending(true);
    context.resize({
      height: 1200,
    });
    const image = await context.renderAsync();
    const result = await image.saveAsync({
      format: SaveFormat.JPEG,
    });
    await uploadFile(result.uri);
    setSending(false);
    setSent(true);
    setTimeout(() => {
      closeOutOfPreview();
    }, 2000);
  };

  const handleCancel = () => {
    closeOutOfPreview();
  };

  const getStateElement = () => {
    if (sending) {
      return <Text style={styles.textStyle}>Sending...</Text>;
    }
    if (sent) {
      return <Text style={styles.textStyle}>Sent!</Text>;
    }
    return (
      <>
        <Button title="Send" onPress={handleSend} disabled={sending || sent} />
        <Button
          title="Cancel"
          onPress={handleCancel}
          disabled={sending || sent}
        />
      </>
    );
  };

  const renderPreview = () => {
    if (uriType === 'video') {
      return <VideoScreen uri={uri} />;
    }
    return (
      <Image
        source={{ uri: uri === null ? undefined : uri }}
        contentFit="contain"
        style={{ width: 300, aspectRatio: 1 }}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderPreview()}
      <View style={styles.textContainer}>{getStateElement()}</View>
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
  textContainer: {
    marginTop: 20,
    maxWidth: 300,
    height: 50,
  },
  textStyle: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
