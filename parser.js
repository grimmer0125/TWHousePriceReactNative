let CSV = require('comma-separated-values');

let cityList = [

{code:"C", name:"基隆市"},
{code:"A", name:"臺北市"},
{code:"F", name:"新北市"},
{code:"H", name:"桃園市"},
{code:"O", name:"新竹市"},
{code:"J", name:"新竹縣"},
{code:"K", name:"苗栗縣"},
{code:"B", name:"臺中市"},
{code:"M", name:"南投縣"},
{code:"N", name:"彰化縣"},
{code:"P", name:"雲林縣"},
{code:"I", name:"嘉義市"},
{code:"Q", name:"嘉義縣"},
{code:"D", name:"臺南市"},
{code:"E", name:"高雄市"},
{code:"T", name:"屏東縣"},
{code:"G", name:"宜蘭縣"},
{code:"U", name:"花蓮縣"},
{code:"V", name:"臺東縣"},
{code:"X", name:"澎湖縣"},
{code:"W", name:"金門縣"},
{code:"Z", name:"連江縣"}


];

// function readFileNodejs(code, houseType, handler){
//   let fileName =  "./opendata/"+code+ "_LVR_LAND_"+houseType+".CSV";
//   let total =0;
//   let num = 0;
//   let data = fs.readFileSync(fileName);
//   let str = iconv.decode(data, 'Big5');
//   handler(str);
//   return str;
// }

// function getTotal(code, houseType) {
//
//   // reading part, will lety on different platform
//   let str = readFileNodejs(code, houseType);
//
//   let csv = new CSV(str);
//
//   let count=-1;
//   csv.forEach(function(record) {
//     count++;
//     if (count>=1){
//       // console.log('price:', record[22]); // it may be zero.  1m2 = 0.3025 坪
//       //
//       // console.log("type:", record[1]);
//       if(record[1] && record[1].indexOf("房地")>=0 && record[22]) {
//         let price = record[22]*3.30579;
//         // console.log("price per Square footage:", price);
//         num++;
//         total+=price;
//       }
//     }
//     // do something with the record
//   });
//
//   return {total:total, number:num}
// }

export function useGetTotal(readFileFun){
  console.log("use get total");
  let newCityList = cityList.slice(0);

  let NumOfCity = cityList.length;
  // for (let i=0; i< NumOfCity; i++){
  for (let i=0; i< 1; i++){
    console.log("use get total 2");

    let reader = new fileReader(cityList[i].code);
    reader.startReadAsync(readFileFun);
    // let result1 = getTotal(cityList[i].code,"A");
    // let result2 = getTotal(cityList[i].code,"B"); //預售屋


    // newCityList[i].price = average;
  }
}

export function fileReader(code){

  this.resultA = null;
  this.resultB = null;
  // this.fileA = null;
  // this.fileB = null;
  this.average = null;

  this.calculateAverage = function(){
    let totalNumber = this.resultA.number+ this.resultB.number;
    console.log('number:',this.resultA.number,this.resultB.number );
    console.log('total:', this.resultA.total, this.resultB.total);

    let average = 0;
    if(totalNumber>0){
      this.average = (this.resultA.total+this.resultB.total)/totalNumber;
      console.log('average:', this.average );
    }
  }

  this.startReadAsync = function(readAyncFun){

    console.log("startReadAsync1");

    readAyncFun(code,"A", (result)=>{
      console.log("read file A ok, str.len:", result.length);
      this.resultA =  this.getTotal(result);

      if(this.resultB){
        console.log("calc");
        this.calculateAverage();
      }
    });

    console.log("startReadAsync2");

    readAyncFun(code, "B", (result)=>{
      console.log("read file B ok, str.len:", result.length);
      this.resultB =  this.getTotal(result);

      if(this.resultA){
        console.log("calc");
        this.calculateAverage();
      }
    });
  }

  this.getTotal = function(str) {

    // reading part, will lety on different platform
    // let str = readFileNodejs(code, houseType);

    let total =0;
    let num = 0;
    let csv = new CSV(str);

    let count=-1;
    csv.forEach(function(record) {
      count++;
      if (count>=1){
        // console.log('price:', record[22]); // it may be zero.  1m2 = 0.3025 坪
        //
        // console.log("type:", record[1]);
        if(record[1] && record[1].indexOf("房地")>=0 && record[22]) {
          let price = record[22]*3.30579;
          // console.log("price per Square footage:", price);
          num++;
          total+=price;
        }
      }
      // do something with the record
    });

    return {total:total, number:num}
  }

}
