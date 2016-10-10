/**
 * Taiwan Average House Price React Native App
 * @Grimmer
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
    RecyclerViewBackedScrollView,
    ActivityIndicator
} from 'react-native';

import {loadORDownload, downloadAndParse,  title} from './fetcher.js';

// https://facebook.github.io/react-native/docs/listviewdatasource.html
class TWHousePriceReactNative extends Component {
    constructor() {
        super();
        this._data = [];
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            dataSource: ds.cloneWithRows([]),loading:false
        };

        this.onData  = this.onDataArrived.bind(this);
        this.clickReload = this._onPressButton.bind(this);
    }

    _onPressButton() {

      console.log("You tapped the button!");
      this.setState({loading: true});
      downloadAndParse(this.onData);
    }

    onDataArrived(newData) {
        console.log("onDataArrived");

        this._data = newData;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this._data)
        });
        this.setState({loading: false});
    }

    componentDidMount() {

        console.log("try to get data");
        this.setState({loading: true});
        loadORDownload(this.onData);

        setInterval(() => {
            console.log("check if price data expires");
            this.setState({loading: true});
            loadORDownload(this.onData);
        }, 1000*3600*24);

        // setInterval(function(){
        //     console.log("check if price data expires");
        //     loadORDownload(onData);
        // }, 1000*3600*24); //1 day
    }

    _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        // sectionID:s1, rowID:0-xx
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
        let titlePart= <Text>
            {title}
        </Text>;

        let reloadButton = null;
        if(this.state.loading == false){
            reloadButton =  (<TouchableHighlight onPress={this.clickReload} underlayColor="white">
                                <Text style={{color:'rgba(80,94,104,0.7)'}}>Reload</Text>
                            </TouchableHighlight>);
        }


        let body = null;
        if (this.state.loading == true){
            const styles = StyleSheet.create({
              centering: {
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
                }
            });
            body =
             (
                <ActivityIndicator
                    animating={this.state.loading}
                    style={[styles.centering, {height: 80}]}
                    size="large"
                />
            );
        } else {
            body = ( <ListView
                        dataSource={this.state.dataSource}
                        renderRow={(rowData) => <Text>{rowData}</Text>}
                        renderSeparator={this._renderSeparator}
                      />
                  );

        }

        return (
            <View style={{
                paddingTop: 22
            }}>
                <View style={{flexDirection: 'row',  justifyContent: 'space-around'}}>
                    {titlePart}
                    {reloadButton}
                </View>
                {body}
            </View>
        );
    }
}

AppRegistry.registerComponent('TWHousePriceReactNative', () => TWHousePriceReactNative);
