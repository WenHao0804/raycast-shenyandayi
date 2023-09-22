import { Action, ActionPanel, List } from "@raycast/api";
import { queryRelationWords } from "../api";
import { WordType } from "../types";

export function RelationWords(props: {searchText: string, setSearchText: CallableFunction, setLastSearchText: CallableFunction, relationWords: WordType[], setRelationWords: CallableFunction}){
    const {searchText, setSearchText, setLastSearchText, relationWords, setRelationWords} = props;
    return (<>
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
    </>);

}