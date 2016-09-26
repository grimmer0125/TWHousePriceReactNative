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
// var RNFetchBlob = require('react-native-fetch-blob');

const dataURL = "http://data.moi.gov.tw/MoiOD/System/DownloadFile.aspx?DATA=F0199ED0-184A-40D5-9506-95138F54159A";

// var unzip = require('unzip');
// import {fs} from 'fs';

let dirs = "";
if (RNFetchBlob) {

  // fs.createReadStream('path/to/archive.zip').pipe(unzip.Extract({ path: 'output/path' }));
  console.log("after unzip");


  dirs = RNFetchBlob.fs.dirs;
  console.log("got the dir path:", dirs.DocumentDir);
}

function writeFile(){
  // write file
  // RNFetchBlob
  // .config({
  //   // add this option that makes response data to be stored as a file,
  //   // this is much more performant.
  //   fileCache : true,
  //   appendExt : 'png',
  //   path : dirs.DocumentDir + '/test.zip',
  // })
  // .fetch('GET', dataURL, {
  //   // some headers ..
  // })
  // .then((res) => {
  //   // the temp file path
  //   console.log('The file saved to ', res.path())
  // })
}

// test unzip, work
function testUnzip(){
  const readZipfilepath = dirs.DocumentDir+"/RNFetchBlob_tmp/test2.zip";
  const ZipArchive = require('react-native-zip-archive');
  // let sourcePath = 'path_to_your_zip_file';
  // let targetPath = RNFS.DocumentDirectoryPath;
  const unZipfilepath = dirs.DocumentDir+"/RNFetchBlob_tmp/test3";
  ZipArchive.unzip(readZipfilepath, unZipfilepath)
  .then(() => {
    console.log('unzip completed!');
  })
  .catch((error) => {
    console.log('unzip error:');

    console.log(error);
  })
}

// works
function readFile(){
  const readfilepath = dirs.DocumentDir+"/RNFetchBlob_tmp/2.txt";
  console.log('try to read:',readfilepath);

  let data = ''
  RNFetchBlob.fs.readStream(
    // encoding, should be one of `base64`, `utf8`, `ascii`
    readfilepath,
    `utf8`
    // file path

    // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
    // when reading file in BASE64 encoding, buffer size must be multiples of 3.
    )
.then((ifstream) => {
    ifstream.open()
    ifstream.onData((chunk) => {
      // when encoding is `ascii`, chunk will be an array contains numbers
      // otherwise it will be a string
      data += chunk
    })
    ifstream.onError((err) => {
      console.log('oops-err', err); // not exist case and other cases
    })
    ifstream.onEnd(() => {

      console.log("read data:", data);
      // <Image source={{ uri : 'data:image/png,base64' + data }}
    })
})
}

// readFile();

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
