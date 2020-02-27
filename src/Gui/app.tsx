import React from "react"
import { Container, Row, Col } from "react-bootstrap"
import * as log from "loglevel"

import GameEngine from "../GameEngine/game_engine"
import { frametime } from "../GameEngine/config"
import Editor, { loadProject, saveProject } from "../BlocklyEditor/editor"
import CodeRenderer from "../BlocklyEditor/code_renderer"
import { download } from "../GameEngine/utils"

log.setLevel("trace")

log.setLevel("trace")

const rowStyle = {
    height: "1080px",
    marginRight: "0px"
}

const rowStyleButtons = { marginLeft: "0px" }

const gameDiv = {
    marginLeft: "10px",
    marginBottom: "15px",
    height: "500px",
    width: "500px"
}

const backgroundStyle = { backgroundColor: "#fff0c5ff" }

const headerStyle = {
    alignItems: "left",
    backgroundColor: "#fff0c5ff",
    textIndent: "15px"
}

const charSelectionStyle = {
    marginLeft: "10px",
    backgroundColor: "blue",
    width: "500px",
    height: "500px"
}

const debugInfoStyle = {

}

const intervalUpdater = async (updatee: { update(): void }) => {
    return setInterval(() => {
        updatee.update()
    }, frametime)
}

export default class App extends React.Component<{}, {
        debugToggle: boolean,
        gameRunning: boolean
    }> {

    editorInstance = React.createRef<Editor>()

    constructor(props: {}) {
        super(props)
        this.state = { debugToggle: false, gameRunning: false }
    }

    getCode = () => {
        return this.editorInstance.current?.state.code
    }

    toggleGame = () => {
        this.setState({ gameRunning: !this.state.gameRunning })
    }

    toggleDebug = () => {
        this.setState({ debugToggle: !this.state.debugToggle })
    }

    handleUpload = (event: React.FormEvent<HTMLInputElement>) => {
        const editor = this.editorInstance.current
        if (editor) {
            const uploaded = event.currentTarget.value
            console.log(uploaded)
        }

    }

    render() {
        let editorInstance = this.editorInstance.current!

        let gameEngine
        if (this.state.gameRunning) {
            gameEngine = (
                <GameEngine
                    debugToggle={this.state.debugToggle}
                    toggle={this.state.gameRunning}
                    program={this.getCode()}
                    updater={intervalUpdater}
                />
            )
        } else {
            gameEngine = null
        }

        return (
            <div>
                <Container fluid style={backgroundStyle}>
                    <Row>
                        <header style={headerStyle}>
                            <h1>FUNKLY</h1>
                        </header>
                    </Row>
                    <Row style={rowStyleButtons}>
                        <button
                            onClick={this.toggleGame}>
                            {this.state.gameRunning ? "stop" : "run"}
                        </button>
                        <button
                            onClick={this.toggleDebug}>
                            {this.state.debugToggle ? "debug off" : "debug on"}
                        </button>
                        <button
                            onClick={() => saveProject(editorInstance!.state.blockXml.toString())}>
                            SAVE
                        </button>
                        <button
                            onClick={() => loadProject(editorInstance!.blocklyReactInstance.current!)}>
                            LOAD
                        </button>
                        <button onClick={() => download(
                            "funkly-download.js",
                            `export const initialXml = "${encodeURI(this.editorInstance.current?.state.blockXml.toString()!)}"`
                        )}>
                            xml
                        </button>
                        <input type="file" id="importedCode" name="importedCode" onInput={this.handleUpload}/>
                    </Row>
                    <Row style={rowStyle}>
                        <Col sm={8}>
                            <Editor ref={this.editorInstance} />
                        </Col>
                        <Col sm={4}>
                            <Row style={gameDiv}>
                                {gameEngine}
                            </Row>
                            <Row style={charSelectionStyle}/>
                        </Col>
                    </Row>
                    <Row style={debugInfoStyle}>
                        <CodeRenderer
                            debugToggle={this.state.debugToggle}
                            code={this.editorInstance.current?.state.code}
                        />
                    </Row>
                </Container>
            </div>
        )
    }
}
