/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, {Component} from 'react';
 import {
     AppRegistry,
     StyleSheet,
     Text,
     View,
     Image,
     ListView,
     TouchableHighlight,
     RecyclerViewBackedScrollView
 } from 'react-native';

import {loadORDownload} from './fetcher.js';

class testReactNative extends Component {
    constructor() {
        super();
        this._data = []; //this._data.concat(newData);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            dataSource: ds.cloneWithRows(['row 1', 'row 2'])
        };
    }

    onDataArrived(newData) {
        console.log("onDataArrived");

        this._data = newData; //this._data.concat(newData);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this._data)
        });
    }

    componentDidMount() {
        console.log("try to get data");
        loadORDownload(data => {
            this.onDataArrived(data);
        });
    }

    _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        //sectionID:s1, rowID:0-xx
        // console.log("sectionID:%s;rowID",sectionID,rowID)
        return (
          <View key={`${sectionID}-${rowID}`} style={{
            height: adjacentRowHighlighted
                ? 4
                : 1,
            backgroundColor: adjacentRowHighlighted
                ? '#3B5998'
                : '#CCCCCC'
        }}/>
      );
    }

    render() {
        return (
            <View style={{
                paddingTop: 22
            }}>
                <ListView
                dataSource={this.state.dataSource}
                renderRow={(rowData) => <Text>{rowData}</Text>}
                renderSeparator={this._renderSeparator}
                />
            </View>
        );
    }
}

AppRegistry.registerComponent('testReactNative', () => testReactNative);
