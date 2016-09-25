/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import RNFetchBlob from 'react-native-fetch-blob';

const dataURL = "http://data.moi.gov.tw/MoiOD/System/DownloadFile.aspx?DATA=F0199ED0-184A-40D5-9506-95138F54159A";


if (RNFetchBlob) {
  let dirs = RNFetchBlob.fs.dirs;
  console.log("got it");

  RNFetchBlob
  .config({
    // add this option that makes response data to be stored as a file,
    // this is much more performant.
    fileCache : true,
    appendExt : 'png',
    path : dirs.DocumentDir + '/test.zip',
  })
  .fetch('GET', dataURL, {
    // some headers ..
  })
  .then((res) => {
    // the temp file path
    console.log('The file saved to ', res.path())
  })

}

class testReactNative extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('testReactNative', () => testReactNative);
