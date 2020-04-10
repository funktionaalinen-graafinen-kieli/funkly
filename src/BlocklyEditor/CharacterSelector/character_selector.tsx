import React, { useState } from "react"
import Blockly from "blockly"

import { guiImages } from "../../Gui/image_storage"
import Editor, { generateCode } from "../../BlocklyEditor/editor"
import { NewCharacterMenu, NewCharacterButton } from "./new_character_menu"

interface CharacterCardProps {
    name: string
    img: string
    delete: (_: string) => void
    isSelected: boolean
}

const CharacterCard = (props: CharacterCardProps) => {
    let styleClasses = "funkly-character-card"
    if (props.isSelected) styleClasses += " funkly-character-card-selected"
    return (
        <div className={ styleClasses }>
            <img
                className="funkly-character-on-card"
                src={props.img}
                alt="..."
            />
            <img
                className="funkly-delete-character"
                src={guiImages.get("xbuttongrey")}
                alt="delete" onClick={() => props.delete(props.name)}
            />
            <p>{props.name}</p>
        </div>
    )
}

interface CharacterCardGridProps {
    characterMap: ReadonlyMap<string, Blockly.Workspace>
    setSelectedCharacter: (_: string) => void
    selectedCharacter: string
    deleteCharacter: (_: string) => void
}

const CharacterCardGrid = (props: CharacterCardGridProps) => {
    const entities = JSON.parse(generateCode(props.characterMap)).entities
    
    const cardList: JSX.Element[] = []
    Object.values(entities).forEach((entity: any, index) => {
        const entityId = Object.keys(entities)[index]
        cardList.push(
            <div
                key={index}
                style={{ padding: 10, cursor: "pointer" }}
                onClick={() => props.setSelectedCharacter(entityId)}
            >
                <CharacterCard
                    name={entity.name[1]}
                    img={entity.img[1]}
                    delete={() => props.deleteCharacter(entityId)}
                    isSelected={ props.selectedCharacter === entityId }
                />
            </div>
        )
    })

    return <>{cardList}</>
}
interface CharacterSelectorProps {
    characterMap: ReadonlyMap<string, Blockly.Workspace>
    setCharacterMap: (_: ReadonlyMap<string, Blockly.Workspace>) => void
    selectedCharacter: string
    editor: React.RefObject<Editor>
}


const CharacterSelector = (props: CharacterSelectorProps) => {
    const [newEntityMode, setNewEntityMode] = useState(false)

    // We should hook somehow that after the ref is fulfilled a re-render / re-mount is triggered
    const editor = props.editor.current!

    const setSelectedCharacter = (entityId: string) => {
        console.debug("setSelectedCharacter:", entityId)
        editor.setSelectedCharacter(entityId)
    }

    const deleteCharacter = (entityId: string) => {
        console.debug("deleted character: " + entityId)

        // copy charactermap, omitting the entityId that is being deleted
        const characterDeletedMap = new Map(Object.entries(props.characterMap).filter(([key, _]) => key !== entityId))
        props.setCharacterMap(characterDeletedMap)
        
        const newSelected = props.characterMap.values().next().value
        if (newSelected) { editor.setSelectedCharacter(newSelected) }
    }

    return (
        <>
            {newEntityMode ? (
                <NewCharacterMenu
                    setNewEntityMode={setNewEntityMode}
                    characterMap={props.characterMap}
                    setCharacterMap={props.setCharacterMap}
                />
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "auto auto auto", justifyItems: "center" }}>
                    <CharacterCardGrid 
                        deleteCharacter={deleteCharacter}
                        setSelectedCharacter={setSelectedCharacter}
                        selectedCharacter={props.selectedCharacter}
                        characterMap={props.characterMap} 
                    />
                    <NewCharacterButton setNewEntityMode={setNewEntityMode}/>
                </div>
            )}
        </>
    )
}

export default CharacterSelector
