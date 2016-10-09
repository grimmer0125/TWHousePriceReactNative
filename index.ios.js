/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, Image, ListView, TouchableHighlight, RecyclerViewBackedScrollView} from 'react-native';

import {loadORDownload} from './fetcher.js';

// https://facebook.github.io/react-native/docs/listviewdatasource.html
class testReactNative extends Component {
    constructor() {
        super();
        this._data = [];//this._data.concat(newData);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(['row 1', 'row 2']),
        };
    }

    onDataArrived(newData) {
      console.log("onDataArrived");

      this._data = newData;//this._data.concat(newData);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this._data)
      });
    }

    componentDidMount(){
        console.log("try to get data");
        loadORDownload(data=>{
          this.onDataArrived(data);
        });

  //       $.ajax({
  //   url: this.props.url,
  //   dataType: 'json',
  //   cache: false,
  //   success: function(data) {
  //     this.setState({data: data});
  //   }.bind(this),
  //   error: function(xhr, status, err) {
  //     console.error(this.props.url, status, err.toString());
  //   }.bind(this)
  // });
    }

    render() {
      return (
        <View style={{paddingTop: 22}}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => <Text>{rowData}</Text>}
          />
        </View>
      );
    }

    // render() {
    //     return (
    //         <View style={styles.container}>
    //             <Text style={styles.welcome}>
    //                 Welcome to React Native!
    //             </Text>
    //             <Text style={styles.instructions}>
    //                 To get started, edit index.ios.js
    //             </Text>
    //             <Text style={styles.instructions}>
    //                 Press Cmd+R to reload,{'\n'}
    //                 Cmd+D or shake for dev menu
    //             </Text>
    //         </View>
    //     );
    // }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    }
});

AppRegistry.registerComponent('testReactNative', () => testReactNative);
