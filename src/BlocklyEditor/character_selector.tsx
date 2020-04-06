import React, { useState } from "react"
import Blockly from "blockly"

import { guiImages } from "../Gui/image_storage"
import Editor from "../BlocklyEditor/editor"

const entityMap = {
    entities: {
        "J|*C80I]n-iaRWfN[9B1": {
            name: ["packF(id)", "kilpikonna"],
            img: ["pack(  '\"/static/media/turtle.fda1f442.png\"')", "/static/media/default_image.5d478a5d.png"]
        },
        "]h;BXQeK[(LG98GJ4~2M": {
            name: ["packF(id)", "muovipussi"],
            img: ["pack(  '\"/static/media/plasticbag.7e82159b.png\"')", "/static/media/default_image.5d478a5d.png"]
        },
        "J|*C80I]naRWfN[9B1": {
            name: ["packF(id)", "test"],
            img: ["pack(  '\"/static/media/turtle.fda1f442.png\"')", "/static/media/default_image.5d478a5d.png"]
        },
        "]h;BXQe(LG98GJ4~2M": {
            name: ["packF(id)", "test2"],
            img: ["pack(  '\"/static/media/plasticbag.7e82159b.png\"')", "/static/media/default_image.5d478a5d.png"]
        },
        "J|*C80I]nasdfRWfN[9B1": {
            name: ["packF(id)", "test3"],
            img: ["pack(  '\"/static/media/turtle.fda1f442.png\"')", "/static/media/default_image.5d478a5d.png"]
        },
        "]h;BXQe(LGsdf98GJ4~2M": {
            name: ["packF(id)", "test4"],
            img: ["pack(  '\"/static/media/plasticbag.7e82159b.png\"')", "/static/media/default_image.5d478a5d.png"]
        }
    }
}

const entityBaseXml = (id: string) => `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="funkly_entity" id="${id}" x="420" y="239">
    <field name="name">esimerkkinimi</field>
    <field name="initx">1</field>
    <field name="inity">1</field>
    <field name="width">60</field>
    <field name="height">60</field>
    <field name="radius">60</field>
    <statement name="x">
      <shadow type="funkly_get" id="O]RBe)x282zy]s-g[^3P">
        <field name="entity">NOT_SELECTED</field>
        <field name="property">x</field>
      </shadow>
    </statement>
    <statement name="y">
      <shadow type="funkly_get" id="INhqa*+n8.,,gvgJYd3z">
        <field name="entity">NOT_SELECTED</field>
        <field name="property">y</field>
      </shadow>
    </statement>
    <statement name="img">
      <shadow type="funkly_img" id="Fz#TNaasKi!WPddKz%Gx">
        <field name="IMAGE">/static/media/default_image.a25c40e5.png</field>
      </shadow>
    </statement>
  </block>
</xml>
`

interface CharacterCardProps {
    name: string
    img: string
    delete: any
}

const CharacterCard = (props: CharacterCardProps) => {
    return (
        <div className="funkly-character-card">
            <img
                src={guiImages.get("deleteButton")}
                alt="..."
                style={{ position: "absolute", height: 20, width: 20 }}
                onClick={props.delete(props.name)}
            />
            <img src={props.img} alt="..." style={{ height: 50, width: 50 }} />
            <p>{props.name}</p>
        </div>
    )
}

interface NewCharacterMenuProps {
    toggleNewCharacterMode: any
    createNewCharacter: any
}

const NewCharacterMenu = (props: NewCharacterMenuProps) => {
    const buttonClick = (id: string) => {
        props.toggleNewCharacterMode()
        props.createNewCharacter(id)
    }

    return (
        <div style={{ padding: 10 }}>
            <button onClick={() => buttonClick("HAHMO")}>Hahmo</button>
            <button onClick={() => buttonClick("TIETOVEKOTIN")}>Tietovekotin</button>
        </div>
    )
}

interface CharacterSelectorProps {
    characterMap: Map<string, Blockly.Workspace>
    setSelectedCharacter: (_: string) => void
    editor: React.RefObject<Editor>
}

const CharacterSelector = (props: CharacterSelectorProps) => {
    const [showNewEntityMode, setShowNewEntityMode] = useState(false)

    if (!props.editor.current) return null
    // We should hook somehow that after the ref is fulfilled a re-render / re-mount is triggered
    const editor = props.editor!.current

    const setSelectedCharacter = (entityId: string) => {
        console.log("setSelectedCharacter:", entityId)
        props.setSelectedCharacter(entityId)
        editor.refreshSelected()
    }

    const generateId = (len: number) => {
        var text = ""
        var char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        for (var i = 0; i < len; i++) {
            text += char_list.charAt(Math.floor(Math.random() * char_list.length))
        }
        return text
    }

    const createNewCharacter = (id: string) => {
        // TODO
        console.log("create new character:", props.characterMap)
        // Add new workspace to characterMap
        const workspace = new Blockly.Workspace()
        const entityId = generateId(10)
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(entityBaseXml(entityId)), workspace)
        props.characterMap.set(entityId, workspace)
        console.log("new:", props.characterMap)
    }

    const deleteCharacter = (entityId: string) => {
        console.log("delete character")
        // Delete character from characterMap
        props.characterMap.delete(entityId)
    }

    return (
        <>
            {showNewEntityMode ? (
                <NewCharacterMenu
                    toggleNewCharacterMode={() => setShowNewEntityMode(false)}
                    createNewCharacter={createNewCharacter}
                />
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "auto auto auto", justifyItems: "center" }}>
                    {Object.values(entityMap.entities).map((entity, index) => {
                        const entityId = Object.keys(entityMap["entities"])[index]
                        return (
                            <div
                                key={index}
                                style={{ padding: 10, cursor: "pointer" }}
                                onClick={() => setSelectedCharacter(entityId)}
                            >
                                <CharacterCard
                                    name={entity.name[1]}
                                    img={entity.img[1]}
                                    delete={() => deleteCharacter(entityId)}
                                />
                            </div>
                        )
                    })}
                    <img
                        src={guiImages.get("plusButton")}
                        width={75}
                        height={75}
                        style={{ position: "absolute", right: 0, bottom: 0 }}
                        onClick={() => setShowNewEntityMode(true)}
                    />
                </div>
            )}
        </>
    )
}

export default CharacterSelector
