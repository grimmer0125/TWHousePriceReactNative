import RNFetchBlob from 'react-native-fetch-blob';
const ZipArchive = require('react-native-zip-archive');

let dirs = "";
let zipFilePath = "";
let unzipPath = "";
if (RNFetchBlob) {
    dirs = RNFetchBlob.fs.dirs;

    zipFilePath = dirs.DocumentDir + '/house.zip';
    unzipPath = dirs.DocumentDir + "/house";
    console.log("got the file path:", zipFilePath);
}

import {parseHouseCSV} from './parser.js';
import {storage} from './storageHelper.js';

export const title =  "兩月前的半月平均成交價(不動產+預售屋):";

export function loadORDownload(dataCallback) {

    storage.load().then(res => {

        console.log("storage load res:", res);

        dataCallback(res);
        // downloadAndParse(dataCallback);

    }).catch(err => {
        // any exception including data not found
        // goes to catch()
        console.warn(err.message);
        switch (err.name) {
            case 'NotFoundError':
                console.log("not found");

                // TODO;
                break;
            case 'ExpiredError':
                console.log("'ExpiredError");

                // TODO
                break;
        }

        downloadAndParse(dataCallback);
    })
}

export function downloadAndParse(dataCallback) {
    // case2: get new data
    console.log("start to download");

    downloadFile().then((res) => {
        // the temp file path
        console.log('The file saved to ', res.path())

        return unzip();
    }).then(() => {
        console.log('unzip completed!');

        // comment temporarily
        parseHouseCSV(readEachCSVFile, cityData => {
            console.log("houseData:", cityData);
            const newData = cityData.map(city=>{
                let finalNum = 0;
                if(city.price<0){
                    finalNum ="error";
                } else if (city.price ==0) {
                    finalNum = "沒有交易";
                } else {
                    finalNum = (Math.round(city.price)).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                          ",");
                }

                return city.name+":$"+finalNum;
            });
            console.log("new:", newData);
            // newData.splice(0, 0, title);
            storage.save(newData);

            dataCallback(newData);
        });

    }).catch((error) => {
        console.log('unzip error:');

        console.log(error);
    })
}


const dataURL = "http://data.moi.gov.tw/MoiOD/System/DownloadFile.aspx?DATA=F0199ED0-184A-40D5-9506-95138F54159A";

// download and save
function downloadFile() {
    // write file
    return RNFetchBlob.config({
        // add this option that makes response data to be stored as a file,
        // this is much more performant.
        //   fileCache : true,
        //   appendExt : 'png',
        path: zipFilePath, //dirs.DocumentDir + '/house.zip',
    }).fetch('GET', dataURL, {
        // some headers ..

        // Beware that when using a file path as Image source on Android,
        // you must prepend "file://"" before the file path
        // imageView = <Image source={{ uri : Platform.OS === 'android' ? 'file://' + res.path()  : '' + res.path() }}/>
    });
}

// unzip, work
function unzip() {

    return ZipArchive.unzip(zipFilePath, unzipPath);
}

// method 1. use load iconv-lite, but it does not work on react-native
// current: 2. another way is to modify ios/android code of react-native-fetch-blob to read big5 encoding
function readEachCSVFile(code, houseType, finishReadFun) {

    const readfilepath = unzipPath + "/" + code + "_LVR_LAND_" + houseType + ".CSV";

    console.log('try to read:', readfilepath);

    let data = ''
    RNFetchBlob.fs.readStream(
    // encoding, should be one of `base64`, `utf8`, `ascii`
    readfilepath, `big5`, 1095000 //should set large enough
    // file path
    // 4K buffer size.
    // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
    // when reading file in BASE64 encoding, buffer size must be multiples of 3.
    ).then((ifstream) => {
        ifstream.open()
        ifstream.onData((chunk) => {
            // when encoding is `ascii`, chunk will be an array contains numbers
            // otherwise it will be a string
            data += chunk

            // [asciiArray addObject:[NSNumber numberWithChar:bytePtr[i]]];
            // when encoding is `ascii`, chunk will be an array contains numbers

            // console.log("chunk size:%s", chunk.length);

            // str = iconv.decode(new Buffer(chunk), 'Big5');
            // console.log("final:", str);
        })
        ifstream.onError((err) => {
            console.log('oops-err', err); // not exist case and other cases
        })
        ifstream.onEnd(() => {

            //handle data
            console.log("total data length:", data.length);
            finishReadFun(data);
        })
    })
}
