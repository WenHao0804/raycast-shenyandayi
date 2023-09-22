import { Action, ActionPanel, Form, Image, Keyboard, List, getSelectedText } from "@raycast/api";
import { useEffect, useState } from "react";
import axios from "axios";

type ModeType = { id: string; name: string };

function get_sid() {
  const RB = (tokenId: string, stamp: string, nonce: string) => {
    var r = nonce.substring(1, 5) + nonce.substring(3, 7),
      o = stamp.substring(stamp.length - 4, stamp.length),
      a = tokenId.substring(1, 2) + stamp.substring(6, 9),
      i = tokenId.substring(9, 11) + nonce.substring(nonce.length - 2, nonce.length),
      u = nonce.substring(4, 6) + stamp.substring(0, 2) + nonce.substring(9, 11) + stamp.substring(2, 4) + nonce.substring(0, 2) + stamp.substring(4, 6);
    return "".concat(r, "-").concat(o, "-").concat(a, "-").concat(i, "-").concat(u)
  }

  const tokenId = '650c4469ddd56a8d495eb4f0';
  const nonce = '21V8xXG4LiPzu';
  const stamp = String(Date.now());

  const ans = RB(tokenId, stamp, nonce);
  return ans;
}


const headers =  {
  'g-id': '101-39b16713aecac858baf7aa555912b2cb',
  's-id': get_sid(),
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
}

function queryRelationWords(query: string, setData: CallableFunction){
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
    // console.log(items)
    if(items.length == 2){
      queryData['query'] = items[0]
      if(!isNaN(Number(items[1]))){
        //如果是数字
        // console.log('是数字')
        queryData['number'] = [{start: Number(items[1]), end: Number(items[1])}]
      } else if(items[1][0] == '>' && !isNaN(Number(items[1].slice(1)))){
        // console.log('>x')
        queryData['number'] = [{start: Number(items[1].slice(1)) + 1, end: 99}]
      } else if(items[1][0] == '<' && !isNaN(Number(items[1].slice(1)))){
        // console.log('<x')
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
    // console.log(resp.data);
    setData(resp.data.data.word);
  })

}

function querySentences(query: string, setData: CallableFunction){
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
      // 'category_s': [
      //   '200101'
      // ]
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

function ModeDropdown(props: { modeTypes: ModeType[]; onModeTypeChange: (newValue: string) => void }) {
  const { modeTypes, onModeTypeChange } = props;
  return (
    <List.Dropdown
      tooltip="Select Mode Type"
      storeValue={true}
      onChange={(newValue) => {
        onModeTypeChange(newValue);
      }}
    >
      <List.Dropdown.Section title="词还是句">
        {modeTypes.map((drinkType) => (
          <List.Dropdown.Item key={drinkType.id} title={drinkType.name} value={drinkType.id} />
        ))}
      </List.Dropdown.Section>
    </List.Dropdown>
  );
}

export default function Command() {
  const modeTypes: ModeType[] = [
    { id: "1", name: "词" },
    { id: "2", name: "句" },
  ];
  const [mode, setMode] = useState("1");
  const [searchText, setSearchText] = useState('');
  const [lastSearchText, setLastSearchText] = useState('init');
  const [relationWords, setRelationWords] = useState([ ]);
  const [relationSentences, setRelationSentences] = useState([ ]);

  const onModeTypeChange = (newValue: string) => {
    setMode(newValue);
  };

  useEffect(()=>{
    if(searchText == ''){
      console.log('空')
      setRelationWords([]);
      setRelationSentences([]);
    } else{
      // if(lastSearchText == ''){
      //   queryWithSearchText()
      // }
    }
    if (lastSearchText == 'init') {
      getSelectedText()
        .catch((reason) => {

        })
        .then(value => {
          if (value != null && value.length > 0 && searchText.length == 0) {
            if (lastSearchText == 'init') {
              setSearchText(value);
              queryWithSearchText()
            }
          }
        })
    }
    // console.log(lastSearchText)
    // setLastSearchText(searchText);
    // console.log('hook', lastSearchText, searchText);

  }, [searchText])
  function queryWithSearchText(){
    if(mode == '1'){
      setRelationWords([]);
      queryRelationWords(searchText, setRelationWords);
      setLastSearchText(searchText);
    } else{
      setRelationWords([]);
      querySentences(searchText, setRelationSentences);
      setLastSearchText(searchText);
    }

  }

  useEffect(()=>{
    queryWithSearchText()
  }, [mode]);




  return (
    <>
      <List
        navigationTitle="深言达意"
        searchBarPlaceholder="找你想要"
        onSearchTextChange={setSearchText}
        searchText={searchText}
        searchBarAccessory={<ModeDropdown modeTypes={modeTypes} onModeTypeChange={onModeTypeChange} />}
        isShowingDetail
        actions={
          <ActionPanel>
            <Action title="给我找"
            onAction={
              () => {
                if(mode == '1'){
                  queryRelationWords(searchText, setRelationWords);
                  setLastSearchText(searchText);
                } else if (mode == '2'){
                  querySentences(searchText, setRelationSentences);
                  setLastSearchText(searchText);
                }
              }
            }
            shortcut={{
              key: 'return',
              modifiers: ['cmd']
            }}
            icon='https://shenyandayi.com/favicon.ico'
            />
          </ActionPanel>
        }
      >
        {
          mode == '1' ? <>
            {relationWords.map(word => {
              return <List.Item
                // title={word['word'] + word['index']}
                title={`${word['index']} ${word['word']}`}
                key={word['index']}
                // subtitle={word['index']}
                actions={
                  <ActionPanel>
                    <Action.CopyToClipboard content={word['word']} />
                    <Action title="再搜一次" onAction={()=>{
                      setRelationWords([]);
                      // console.log('trigger', lastSearchText, searchText);
                      setLastSearchText(searchText);
                      if(
                        searchText.trim().lastIndexOf(' ') != -1
                      ){
                        queryRelationWords(searchText, setRelationWords);
                      } else{
                        queryRelationWords(word['word'], setRelationWords);
                        setSearchText(word['word'])
                      }
                    }}
                    icon='https://shenyandayi.com/favicon.ico'
                    />
                    <Action.Paste content={word['word']}/>
                  </ActionPanel>
                }
                detail={
                  <List.Item.Detail
                    metadata={
                      <List.Item.Detail.Metadata>
                        <List.Item.Detail.Metadata.Label title="Type" icon="pokemon_types/grass.svg" text="Grass" />
                      </List.Item.Detail.Metadata>
                    }
                  />
                }
              />
            })}
          </> : <>
            {relationSentences.map(sentence => {
              return <List.Item
                title={`${sentence['index']} ${sentence['quote']}`}
                key={sentence['index']}
                subtitle={sentence['author']}
                actions={
                  <ActionPanel>
                    <Action.CopyToClipboard content={sentence['quote']}/>
                    <Action title="再搜一次" onAction={()=>{
                      setRelationWords([]);
                      querySentences(searchText, setRelationSentences);
                      setLastSearchText(searchText);
                      setSearchText(sentence['quote'])
                    }}
                    icon='https://shenyandayi.com/favicon.ico'
                    />
                    <Action.Paste content={sentence['quote']}/>
                  </ActionPanel>
                }
                detail={
                  <List.Item.Detail
                    markdown={sentence['quote']}
                    metadata={
                      <List.Item.Detail.Metadata>
                        {
                          sentence['author'] === '' || sentence['author'] == null ?  <></>:
                          <List.Item.Detail.Metadata.Label title='作者' text={sentence['author']}/>
                        }
                        {
                          sentence['work'] === '' || sentence['work'] == null ?  <></>:
                          <List.Item.Detail.Metadata.Label title='作品' text={sentence['work']}/>
                        }
                        
                      </List.Item.Detail.Metadata>
                    }
                  />
                }
                />
            })}
          </>
        }
      </List>
    </>
  );
}