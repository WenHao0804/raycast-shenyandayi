import { Action, ActionPanel, Form, Image, Keyboard, List, getSelectedText } from "@raycast/api";
import { useEffect, useState } from "react";

import { ModeType } from "./types";
import { queryRelationWords, querySentences } from "./api";
import { ModeDropdown } from "./views/list_dropdown";
import { RelationSentences } from "./views/list_sentences";
import { RelationWords } from "./views/list_words";


export default function Command() {
  const modeTypes: ModeType[] = [
    { id: "1", name: "词" },
    { id: "2", name: "句" },
  ];
  const [mode, setMode] = useState("1");
  const [searchText, setSearchText] = useState('');
  const [lastSearchText, setLastSearchText] = useState('init');
  const [relationWords, setRelationWords] = useState([ ]);
  const [relationSentences, setRelationSentences] = useState([]);

  const onModeTypeChange = (newValue: string) => {
    setMode(newValue);
  };

  useEffect(() => {
    if (searchText == '') {
      // console.log('空')
      setRelationWords([]);
      setRelationSentences([]);
    } else {
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
  }, [searchText])

  function queryWithSearchText() {
    if (mode == '1') {
      setRelationWords([]);
      queryRelationWords(searchText, setRelationWords);
      setLastSearchText(searchText);
    } else {
      setRelationSentences([]);
      querySentences(searchText, setRelationSentences);
      setLastSearchText(searchText);
    }
  }

  useEffect(() => {
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
                  if (mode == '1') {
                    queryRelationWords(searchText, setRelationWords);
                    setLastSearchText(searchText);
                  } else if (mode == '2') {
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
            <RelationWords
              searchText={searchText}
              setSearchText={setSearchText}
              setLastSearchText={setLastSearchText}
              relationWords={relationWords}
              setRelationWords={setRelationWords}
            />
          </> : <>
            <RelationSentences
              searchText={searchText}
              setSearchText={setSearchText}
              setLastSearchText={setLastSearchText}
              relationSentences={relationSentences}
              setRelationSentences={setRelationSentences}
            />
          </>
        }
      </List>
    </>
  );
}