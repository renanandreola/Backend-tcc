const axios = require('axios');

const loginTradeMap = async () => {

  return new Promise(async (resolve, reject) => {
    let body = {
      "username": "02585914046",
      "password": "Caixadrhank0123",
      "id_contract": "2020",
      "channel": "13",
      "info": {
        "ip": "",
        "os_version": "",
        "version": "",
        "os_name": ""
      }
    }
      
    const config = {
      method: 'post',
      url: 'https://portal.trademap.com.br/api/authentication/v1/authentication/login',
      headers: {
        'authority': 'portal.trademap.com.br',
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9,pt;q=0.8',
        'content-type': 'application/json',
        'cookie': '_gcl_au=1.1.89978119.1686249730; _fbp=fb.2.1686249730105.788139941; _gid=GA1.3.1800131528.1686249730; _clck=15jjce3|2|fca|0|1254; _tt_enable_cookie=1; _ttp=YXeXY1ks5LlCDn2CIiQNlzftQy8; G_ENABLED_IDPS=google; _hjSessionUser_3170457=eyJpZCI6IjdiZjYxNGEwLTk3MGItNWM5Ni1iM2ExLTc4ZjI3ZjdhODdmYyIsImNyZWF0ZWQiOjE2ODYyNDk3MzAyMDksImV4aXN0aW5nIjp0cnVlfQ==; _clsk=1y9zvt8|1686252784150|1|1|f.clarity.ms/collect; cfid=45429464-0d24-4f83-8d8b-a969bb6a561d; cftoken=0; _ga_NDWR0VVQ6Q=GS1.1.1686255633.3.1.1686256510.60.0.0; ln_or=eyI0Mjg4NTYxIjoiZCJ9; JSESSIONID=CFF4176DA3A24C4AC6F858FB96D2DA6B; __cf_bm=7im9UhzdZMybarjBt45T8k4yY_gINhSnb118Ybc74Gk-1686326857-0-AVuQz1kep1B/uYVUR0qZkZYdwnkR9FAvNBMRfHhdNsjV6CANPYUlywWvxYt3Fit6SPWxQpWx4A1uUXBcIqKVrnSuoaWeIbU9dUNLwuIxnZSD; _ga=GA1.3.851633238.1686249730; _gat_UA-121204218-2=1; _ga_04W3SV5X77=GS1.1.1686326861.4.0.1686326865.0.0.0',
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
      console.log('Error at route login: ', error);
      reject(error);
    });
  })
}

module.exports = loginTradeMap;