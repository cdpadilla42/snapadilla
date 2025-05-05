import { Image } from 'expo-image';
import { SaveFormat, useImageManipulator } from 'expo-image-manipulator';
import React from 'react';
import { Button, Text, View } from 'react-native';
import VideoScreen from '../components/Preview/Video';
import { useReturnToCamera } from '../hooks/useReturnToCamera';
import { uploadFile } from '../lib/aws';
import useSnapadillaStore from '../lib/store/useSnapadillaStore';
import { pageLayoutStyles } from '../styles/pageLayoutStyles';

export default function ImagePreview() {
  const { setUri, setUriType, uri, uriType } = useSnapadillaStore();
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
      return <Text style={pageLayoutStyles.textStyle}>Sending...</Text>;
    }
    if (sent) {
      return <Text style={pageLayoutStyles.textStyle}>Sent!</Text>;
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
    <View style={pageLayoutStyles.container}>
      {renderPreview()}
      <View style={pageLayoutStyles.textContainer}>{getStateElement()}</View>
    </View>
  );
}
