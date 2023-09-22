import axios from "axios";

import {headers} from "./consts";

export function queryRelationWords(query: string, setData: CallableFunction){
  if(query == null || query.length == 0){
    return;
  }
  query = query.slice(0, 20);
  var queryData = {
    'query': query,
    'lang': 'zh',
    'defi_lang': 'zhzh',
    'is_filter': '1',
    'category': '1001',
    'number': [{start: 1, end: 99}],
  }
  if (query.lastIndexOf(' ') != -1){
    // 如果包含空格，则认为有查询条件
    const items = query.split(' ').filter((x)=>x.length);
    if(items.length == 2){
      queryData['query'] = items[0]
      if(!isNaN(Number(items[1]))){
        //如果是数字
        queryData['number'] = [{start: Number(items[1]), end: Number(items[1])}]
      } else if(items[1][0] == '>' && !isNaN(Number(items[1].slice(1)))){
        queryData['number'] = [{start: Number(items[1].slice(1)) + 1, end: 99}]
      } else if(items[1][0] == '<' && !isNaN(Number(items[1].slice(1)))){
        queryData['number'] = [{start: 1, end: Number(items[1].slice(1)) - 1}]
      }
      // console.log(queryData)
    }
  }
  
  axios.post(
    'https://www.shenyandayi.com/api/v1/words/pc/semantic/zh/relation/',
    queryData,
    {
      headers: headers
    }
  ).then(resp =>{
    setData(resp.data.data.word);
  })

}

export function querySentences(query: string, setData: CallableFunction){
  if(query == null || query.length == 0){
    return;
  }
  query = query.slice(0, 20);
  axios.post(
    'https://www.shenyandayi.com/api/v1/sentences/pc/semantic/relation/',
    {
      'lang': 'zh',
      'query': query,
      'is_filter': '1',
      'category': '2001',
    },
    {
      headers: headers
    }
).then(resp =>{
    // console.log(resp.data);
    setData(resp.data.data.quote)
  })
  ;
}