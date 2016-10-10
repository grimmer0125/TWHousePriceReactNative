# TWHousePriceReactNative

It is the brother project of https://github.com/grimmer0125/3DTWHousePriceMap. 

### Features
1. Show the house price per country in Taiwan. 
2. Use react native.
3. Automaticlly update the data every 0.5 month. Data source: http://data.gov.tw/node/6213. 

### How to run on iOS 
1. Follow the instrument to setup the enviornment, https://facebook.github.io/react-native/docs/getting-started.html
2. Type `npm run ios` to launch the iOS simulator to run this react native app. 

### How to run on Android
1. Follow the instrument to setup, https://facebook.github.io/react-native/docs/getting-started.html
2. Launch your Android emulator first, then `npm run android` to install and run. You can use command line to launch your emulator to , 
3. (optional) you may need to setup ANDROID_HOME, e.g. 
``` sh
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$ANDROID_HOME/platform-tools:$PATH
export PATH=$ANDROID_HOME/tools:$PATH
```
#### Tips on Android
You can use command line to launch your emulator, directly type `emulator @YOUR_VIRTUAL_DEIVCE &` or change the name in npm script(qemu) then you can type `npm run qemu` in shourt.

### How to debug
1. https://facebook.github.io/react-native/docs/debugging.html
