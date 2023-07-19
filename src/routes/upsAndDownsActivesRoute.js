const axios = require('axios');
// C2AKWGVXTRCJCP8T
const getUpsAndDowns = async () => {

  return new Promise(async (resolve, reject) => {
    let body = {
        "cd_index":"IBOV",
        "id_exchange":1,
        "period":"oneday",
        "market_type":"acoes",
        "limit":14
    }
      
    const config = {
      method: 'post',
      url: 'https://portal.trademap.com.br/api/trademap/v1/marketMovers/getMarketMoversVariationGrouped',
      headers: {
        'authority': 'portal.trademap.com.br',
        'accept': 'application/json',
        'accept-language': 'en-US,en;q=0.9,pt;q=0.8',
        'content-type': 'application/json',
        'cookie': '_gcl_au=1.1.89978119.1686249730; _fbp=fb.2.1686249730105.788139941; _gid=GA1.3.1800131528.1686249730; _clck=15jjce3|2|fca|0|1254; _tt_enable_cookie=1; _ttp=YXeXY1ks5LlCDn2CIiQNlzftQy8; G_ENABLED_IDPS=google; _hjSessionUser_3170457=eyJpZCI6IjdiZjYxNGEwLTk3MGItNWM5Ni1iM2ExLTc4ZjI3ZjdhODdmYyIsImNyZWF0ZWQiOjE2ODYyNDk3MzAyMDksImV4aXN0aW5nIjp0cnVlfQ==; _hjSession_3170457=eyJpZCI6Ijg1YmI0OGVmLWFmOTQtNGQ0Yy1iMjlkLTJhYzg2YzY3NTk2ZiIsImNyZWF0ZWQiOjE2ODYyNTI3ODM1MjcsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=1; _clsk=1y9zvt8|1686252784150|1|1|f.clarity.ms/collect; cfid=45429464-0d24-4f83-8d8b-a969bb6a561d; cftoken=0; _ga_NDWR0VVQ6Q=GS1.1.1686255633.3.1.1686256510.60.0.0; JSESSIONID=0CC3E92399C7FC1B6106F560B1E2B5D4; ln_or=eyI0Mjg4NTYxIjoiZCJ9; __cf_bm=oPN.BqI30H6cNmuGb1wb9qoNqbnOyFmYUJDrJdQ3eLw-1686257409-0-AbEYTOSqE9Z+McK+p+xeSsmMdd1Kj/4kVEtDBWkgkM22Cg605ICYP5nJlUYT9rQ+gWeQV+CwE87EQoqS6zkbA8J65MJFRmNKGxkOWyem2/Dv; _ga=GA1.1.851633238.1686249730; _ga_04W3SV5X77=GS1.1.1686256528.1.1.1686257865.0.0.0',
        'origin': 'https://portal.trademap.com.br',
        'referer': 'https://portal.trademap.com.br/'
      },
      data: body
    };
      
    await axios(config)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        console.log('Error at route variations: ', error);
        reject(error);
    });
  })
}

module.exports = getUpsAndDowns;