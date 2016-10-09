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

export function loadORDownload(dataCallback) {
    storage.load().then(res => {
        // found data go to then()
        // console.log("ret,userid:",ret.userid);
        console.log("storage load res:", res);

        dataCallback(res);
        // downloadAndParse();

        // case1: use it

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

function downloadAndParse(dataCallback) {
    // case2: get new data
    console.log("start to download");

    downloadFile().then((res) => {
        // the temp file path
        console.log('The file saved to ', res.path())

        return unzip();
    }).then(() => {
        console.log('unzip completed!');

        parseHouseCSV(readEachCSVFile, cityData => {
            console.log("houseData:", cityData);
            const newData = cityData.map(city=>{return city.name+city.price});
            console.log("new:", newData);
            storage.save(newData);

            dataCallback(newData);
        });

    }).catch((error) => {
        console.log('unzip error:');

        console.log(error);
    })
}

// parseTotalHouseCSV(readEachCSVFile);

const dataURL = "http://data.moi.gov.tw/MoiOD/System/DownloadFile.aspx?DATA=F0199ED0-184A-40D5-9506-95138F54159A";

// var unzip = require('unzip');
// import {fs} from 'fs';

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
    });
}

// test unzip, work
function unzip() {
    // const readZipfilepath = dirs.DocumentDir + "/RNFetchBlob_tmp/test2.zip";
    // let sourcePath = 'path_to_your_zip_file';
    // let targetPath = RNFS.DocumentDirectoryPath;
    // const unZipfilepath = dirs.DocumentDir + "/RNFetchBlob_tmp/test3";
    return ZipArchive.unzip(zipFilePath, unzipPath);
}

// 1. can not load iconv-lite
// current: 2. another way is to modify ios code of react-native-fetch-blob to read big5 encoding
function readEachCSVFile(code, houseType, finishReadFun) {
    // let fileName =  "./opendata/"+code+ "_LVR_LAND_"+houseType+".CSV";

    // console.log("b iconv");
    // import iconv from 'iconv-lite';
    // console.log("b iconv2 ");
    // if (iconv){
    //   console.log("b2 iconv2 ");
    //
    // }
    // houseType = "B";

    const readfilepath = unzipPath + "/" + code + "_LVR_LAND_" + houseType + ".CSV";

    // const readfilepath = dirs.DocumentDir+"/RNFetchBlob_tmp/test3/" +"20160916.TXT";

    console.log('try to read:', readfilepath);

    let data = ''
    RNFetchBlob.fs.readStream(
    // encoding, should be one of `base64`, `utf8`, `ascii`
    readfilepath, `big5`, 1095000
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

            console.log("chunk size:%s", chunk.length);

            // str = iconv.decode(new Buffer(chunk), 'Big5');
            // console.log("final:", str);
        })
        ifstream.onError((err) => {
            console.log('oops-err', err); // not exist case and other cases
        })
        ifstream.onEnd(() => {

            //handle data
            console.log("total data:", data.length);
            finishReadFun(data);
            console.log("total data2:", data.length);

            // we need
            // str = iconv.decode(new Buffer([0x68, 0x65, 0x6c, 0x6c, 0x6f]), 'win1251');

            // <Image source={{ uri : 'data:image/png,base64' + data }}
        })
    })
}

// readEachCSVFile();

// works, just for test
// function readTestFile() {
//     const readfilepath = dirs.DocumentDir + "/RNFetchBlob_tmp/2.txt";
//     console.log('try to read:', readfilepath);
//
//     let data = ''
//     RNFetchBlob.fs.readStream(
//     // encoding, should be one of `base64`, `utf8`, `ascii`
//     readfilepath, `utf8`
//     // file path
//
//     // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
//     // when reading file in BASE64 encoding, buffer size must be multiples of 3.
//     ).then((ifstream) => {
//         ifstream.open()
//         ifstream.onData((chunk) => {
//             // when encoding is `ascii`, chunk will be an array contains numbers
//             // otherwise it will be a string
//             data += chunk
//         })
//         ifstream.onError((err) => {
//             console.log('oops-err', err); // not exist case and other cases
//         })
//         ifstream.onEnd(() => {
//
//             console.log("read data:", data);
//             // <Image source={{ uri : 'data:image/png,base64' + data }}
//         })
//     })
// }

// readFile();
