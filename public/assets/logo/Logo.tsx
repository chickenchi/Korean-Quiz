import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';

export type RootStackParam = {
  home: undefined;
  profile: undefined;
  ranking: undefined;
  setting: undefined;
};

const Logo = () => {
  return (
    <SafeAreaView>
      <View style={styles.titleView}>
        <Image
          source={require('@assets/images/logo/Logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>평명</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleView: {
    top: '8%',
    left: '-270%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 51,
    height: 38,
  },
  title: {
    marginLeft: 15,

    fontSize: 35,
    fontFamily: 'Noto Sans',
    fontWeight: '800',

    color: 'black',
  },
  imageContainer: {
    flexDirection: 'row',
  },
});

export default Logo;
