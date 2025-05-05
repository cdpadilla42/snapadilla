import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { getData, storeData } from '../lib/LocalStorage';
import useSnapadillaStore from '../lib/store/useSnapadillaStore';
import { pageLayoutStyles } from '../styles/pageLayoutStyles';

export default function UserView() {
  const [loading, setLoading] = useState<boolean>(true);
  const { user, setUser } = useSnapadillaStore();

  useEffect(() => {
    const onLoad = async () => {
      const retrievedUser = await getData('user');

      if (retrievedUser) {
        setUser(retrievedUser);
      } else {
        console.log('No user found');
      }
      setLoading(false);
    };
    onLoad();
  }, []);

  const handleUserPress = async (user: string) => {
    await storeData('user', user);
    setUser(user);
  };

  const renderText = () => {
    if (loading) {
      return <Text>Loading...</Text>;
    }
    if (user) {
      return <Text>Welcome back {user}</Text>;
    }

    return (
      <>
        <Text style={pageLayoutStyles.textStyle}>Who are you?</Text>
        <Button onPress={() => handleUserPress('Chris')} title="Chris" />
      </>
    );
  };

  return (
    <View style={pageLayoutStyles.container}>
      <View style={pageLayoutStyles.textContainer}>{renderText()}</View>
    </View>
  );
}
