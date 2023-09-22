import { Action, ActionPanel, Color, List } from "@raycast/api";
import { querySentences } from "../api";
import { useState } from "react";
import { SentenceType } from "../types";

export function RelationSentences(props: {searchText: string, setSearchText: CallableFunction, setLastSearchText: CallableFunction, relationSentences: SentenceType[], setRelationSentences: CallableFunction}) {
    const {searchText, setSearchText, setLastSearchText, relationSentences, setRelationSentences} = props;
    return (<>
        {relationSentences.map((sentence) => {
            return <List.Item
                title={`${sentence['index']} ${sentence['quote']}`}
                key={sentence['index']}
                subtitle={sentence['author']}
                actions={
                    <ActionPanel>
                        <Action.CopyToClipboard content={sentence['quote']} />
                        <Action title="再搜一次" onAction={() => {
                            querySentences(searchText, setRelationSentences);
                            setLastSearchText(searchText);
                            setSearchText(sentence['quote'])
                        }}
                            icon='https://shenyandayi.com/favicon.ico'
                        />
                        <Action.Paste content={sentence['quote']} />
                    </ActionPanel>
                }
                detail={
                    <List.Item.Detail
                        markdown={sentence['quote']}
                        metadata={
                            <List.Item.Detail.Metadata>
                                {
                                    sentence['author'] === '' || sentence['author'] == null ? <></> :
                                        <List.Item.Detail.Metadata.Label title='作者' text={sentence['author']} />
                                }
                                {
                                    sentence['work'] === '' || sentence['work'] == null ? <></> :
                                        <List.Item.Detail.Metadata.Label title='作品' text={sentence['work']} />
                                }

                            </List.Item.Detail.Metadata>
                        }
                    />
                }
            />
        })}
    </>);
}