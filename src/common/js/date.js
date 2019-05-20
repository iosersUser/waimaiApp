export function formatDate(date,fmt) {
  if(/(y+)/.test(fmt)){
    //substr(4-RegExp.$1.length)
    //4-RegExp.$1.length = 0  表示从第0位开始截取 截取4位  2019
    fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length))
  }
  let obj = {
    'M+':date.getMonth()+1,
    'd+':date.getDate(),
    'h+':date.getHours(),
    'm+':date.getMinutes(),
    's+':date.getSeconds()
  }
  for(let k in obj){
    if(new RegExp(`(${k})`).test(fmt)){
      let str = obj[k] + '';
      fmt = fmt.replace(RegExp.$1,(RegExp.$1.length===1)?str:padLeftZero(str))
    }
  }
  return fmt ;
}
function padLeftZero(str) {
  return ('00'+str).substr(str.length);
}
