import * as BlocklyJS from "blockly/javascript"
import { Block } from "blockly"
import log from "loglevel"
import { entityImages } from "../../../Gui/image_storage"
import { entityDefaultSize } from "../../../GameEngine/config"

enum funklyBlockType {
    COND = "funkly_cond",
    GUARD = "funkly_guard",
    COMP = "funkly_comp",
    MATH = "funkly_math",
    RAND = "funkly_rand",
    DIST = "funkly_dist",
    TRIG = "funkly_trig",
    COLLIDE = "funkly_collide",
    NUMBER = "funkly_number",
    ENTITY = "funkly_entity",
    MULTI = "funkly_multi",
    INITMULTI = "funkly_initmulti",
    GUIENTITY = "funkly_guientity",
    BIND = "funkly_bind",
    KEY = "funkly_keyboard_input",
    BINDGET = "funkly_bindget",
    GET = "funkly_get",
    GETSTR = "funkly_getstr",
    LIST = "funkly_list",
    IMG = "funkly_img",
    GUI_IMG = "funkly_gui_img"
}

function funklyCodegen(type: funklyBlockType) {
    if (type === funklyBlockType.COND) return funkly_cond
    else if (type === funklyBlockType.GUARD) return funkly_guard
    else if (type === funklyBlockType.COMP) return funkly_comp
    else if (type === funklyBlockType.NUMBER) return funkly_number
    else if (type === funklyBlockType.LIST) return funkly_list
    else if (type === funklyBlockType.ENTITY) return funkly_entity
    else if (type === funklyBlockType.RAND) return funkly_rand
    else if (type === funklyBlockType.DIST) return funkly_dist
    else if (type === funklyBlockType.MULTI) return funkly_multi
    else if (type === funklyBlockType.INITMULTI) return funkly_initmulti
    else if (type === funklyBlockType.GUIENTITY) return funkly_guientity
    else if (type === funklyBlockType.BIND) return funkly_bind
    else if (type === funklyBlockType.BINDGET) return funkly_bindget
    else if (type === funklyBlockType.GET) return funkly_get
    else if (type === funklyBlockType.GETSTR) return funkly_getstr
    else if (type === funklyBlockType.COLLIDE) return funkly_collide
    else if (type === funklyBlockType.KEY) return funkly_keyboard_input
    else if (type === funklyBlockType.MATH) return funkly_math
    else if (type === funklyBlockType.TRIG) return funkly_trig
    else if (type === funklyBlockType.GUI_IMG) return funkly_gui_img
    else if (type === funklyBlockType.IMG) return funkly_img
    else log.error("Invalid funkly block type")

    function funkly_cond(block: Block) {
        const conditionCode = block.getInput("IF") ? BlocklyJS.statementToCode(block, "IF", BlocklyJS.ORDER_NONE) : ""

        const doBranch = BlocklyJS.statementToCode(block, "DO", BlocklyJS.ORDER_ADDITION)
        const elseBranch = BlocklyJS.statementToCode(block, "ELSE")

        return "cond" + argwrap(conditionCode, doBranch, elseBranch)
    }

    function funkly_guard(block: Block) {
        const prev = block.getPreviousBlock()

        if (prev.type === "funkly_guard") {
            return ""
        }

        return funkly_guard_helper(block)
    }

    function funkly_list(block: Block) {
        return ""
    }

    function funkly_guard_helper(block: Block): string {
        const next = block.getNextBlock()

        const conditionCode = block.getInput("IF") ? BlocklyJS.statementToCode(block, "IF") : "1"

        const doBranch = block.getInput("DO") ? BlocklyJS.statementToCode(block, "DO") : ""

        if (next !== null) {
            return "cond" + argwrap(conditionCode, doBranch, funkly_guard_helper(next))
        } else {
            return doBranch
        }
    }

    function funkly_trig(block: Block) {
        const func = block.getFieldValue("func") || "sin"
        return funkly_arg1(func)(block)
    }

    function funkly_math(block: Block) {
        const func = block.getFieldValue("func") || "add"
        return funkly_arg2(func)(block)
    }

    function funkly_rand(block: Block) {
        const arg0 = block.getFieldValue("NUM0") || "0"
        const arg1 = block.getFieldValue("NUM1") || "1"
        // rand * (out_max - out_min) + out_min;
        return `(add(mul(rand())(sub(${arg1})(${arg0})))(${arg0}))`
    }

    function funkly_arg2(f: string) {
        return (block: Block) => {
            const arg0 = BlocklyJS.statementToCode(block, "NUMBER0", BlocklyJS.ORDER_RELATIONAL)
            const arg1 = BlocklyJS.statementToCode(block, "NUMBER1", BlocklyJS.ORDER_RELATIONAL)
            return f + argwrap(arg0, arg1)
        }
    }

    function funkly_arg1(f: string) {
        return (block: Block) => {
            const arg0 = BlocklyJS.statementToCode(block, "NUMBER0", BlocklyJS.ORDER_RELATIONAL)
            return f + argwrap(arg0)
        }
    }

    function funkly_comp(block: Block) {
        const func = block.getFieldValue("func") || "gt"
        const arg0 = BlocklyJS.statementToCode(block, "NUMBER0", BlocklyJS.ORDER_RELATIONAL)
        const arg1 = BlocklyJS.statementToCode(block, "NUMBER1", BlocklyJS.ORDER_RELATIONAL)

        return func + argwrap(arg0, arg1)
    }

    function funkly_collide(block: Block) {
        const arg0 = block.getFieldValue("e1") || "default_e1"
        const arg1 = block.getFieldValue("e2") || "default_e2"
        return "col" + argwrap(`'${arg0}'`, `'${arg1}'`)
    }

    function funkly_dist(block: Block) {
        const arg0 = block.getFieldValue("e1") || "default_e1"
        const arg1 = block.getFieldValue("e2") || "default_e2"
        return "dist" + argwrap(`'${arg0}'`, `'${arg1}'`)
    }

    function funkly_get(block: Block) {
        const arg0 = block.getFieldValue("entity") || "default_entity"
        const arg1 = block.getFieldValue("property") || "default_property"
        return "get" + argwrap("'" + arg0 + "_" + arg1 + "'")
    }

    function funkly_getstr(block: Block) {
        const arg0 = block.getFieldValue("entity") || "default_entity"
        const arg1 = block.getFieldValue("property") || "default_property"
        return "get" + argwrap("'" + arg0 + "_" + arg1 + "'")
    }

    function funkly_bindget(block: Block) {
        const arg0 = block.getFieldValue("name") || "default_bind"
        return "get" + argwrap(`'${arg0}'`)
    }

    function funkly_keyboard_input(block: Block) {
        const arg0 = block.getFieldValue("key") || "default_key"
        return "get" + argwrap("'key_" + arg0 + "'")
    }

    function funkly_number(block: Block) {
        const arg0 = block.getFieldValue("NUM")
        return wrap(arg0)
    }

    function funkly_initmulti(block: Block) {
        return ""
    }

    function multi_initToCode(baseId: string, id: string, multi: Block, init: Block) {
        var re = new RegExp(baseId,"g");

        const name = multi.getFieldValue("name") || "default_name"
        const x = BlocklyJS.statementToCode(multi, "x").replace(re,id)
        const y = BlocklyJS.statementToCode(multi, "y").replace(re,id)
        const height = multi.getFieldValue("height") || 50
        const width = multi.getFieldValue("width") || 50
        const radius = multi.getFieldValue("radius") || 50
        const ro = BlocklyJS.statementToCode(multi, "ro").replace(re,id) || 0
        const img = BlocklyJS.statementToCode(multi, "img", BlocklyJS.ORDER_RELATIONAL)

        let initx = 0
        let inity = 0
        let initro = 0
        if (init) {
            initx = init.getFieldValue("initx") || 0
            inity = init.getFieldValue("inity") || 0
            initro = init.getFieldValue("initro") || 0
        }
        return entityCode(id, name, x, initx, y, inity, img, height, width, radius, initro, ro, "'\\\"\\\"'")
    }

    function funkly_multi(block: Block) {
        const baseId = block.id

        const lb = block.getInputTargetBlock("list")
        const es: string[] = [] 
        //@ts-ignore
        if (lb && lb.type === "funkly_list" && lb.itemCount_ !== 0) { 
            //@ts-ignore
            for (var i = 0; i < lb.itemCount_; i++) {
                // console.trace(block)
                // console.trace(block.getInputTargetBlock("ADD"+i))
                es.push(multi_initToCode(baseId, baseId+i, block, lb.getInputTargetBlock("ADD"+i)))
            }
        } else {
            return ""
        }
        return es.join(', ')
        //return entityCode("11", "aa", "aa", "aa", "aa", "aa", "aa", "aa", "aa", "aa", "aa", "aa", "'\\\"\\\"'")
        //return "e: {}"
    }

    function funkly_entity(block: Block) {
        const id = block.id
        const name = block.getFieldValue("name") || "default_name"
        const x = BlocklyJS.statementToCode(block, "x", BlocklyJS.ORDER_RELATIONAL)
        const initx = block.getFieldValue("initx") || 0
        const y = BlocklyJS.statementToCode(block, "y", BlocklyJS.ORDER_RELATIONAL)
        const inity = block.getFieldValue("inity") || 0
        const height = block.getFieldValue("height") || 50
        const width = block.getFieldValue("width") || 50
        const radius = block.getFieldValue("radius") || 50
        const initro = block.getFieldValue("initro") || 0
        const ro = BlocklyJS.statementToCode(block, "ro") || 0
        const img = BlocklyJS.statementToCode(block, "img", BlocklyJS.ORDER_RELATIONAL)

        return entityCode(id, name, x, initx, y, inity, img, height, width, radius, initro, ro, "'\\\"\\\"'")
    }

    function funkly_guientity(block: Block) {
        const id = block.id
        const name = block.getFieldValue("name") || "default_name"
        const initx = block.getFieldValue("initx") || 0
        const inity = block.getFieldValue("inity") || 0
        const width = block.getFieldValue("width") || 0
        const height = block.getFieldValue("height") || 0
        const radius = entityDefaultSize["radius"]
        const rotation = block.getFieldValue("rotation") || 0
        const img = BlocklyJS.statementToCode(block, "img", BlocklyJS.ORDER_RELATIONAL)
        const text = BlocklyJS.statementToCode(block, "text", BlocklyJS.ORDER_RELATIONAL)

        let x = "packF(id)"
        let y = "packF(id)"

        return entityCode(id, name, x, initx, y, inity, img, width, height, radius, rotation, rotation, text)
    }

    function funkly_bind(block: Block) {
        const bindName = BlocklyJS.valueToCode(block, "id", BlocklyJS.ORDER_RELATIONAL) || "default_bind"
        const f = BlocklyJS.statementToCode(block, "f", BlocklyJS.ORDER_RELATIONAL)
        const init = 0

        let output = `${bindName}: {`
        output += `"f": ["pack(${f})", ${init}],`
        output += "}"
        return output
    }

    function funkly_img(block: Block) {
        const arg0 = block.getFieldValue("IMAGE") || "default_image"
        return `'\\"${strip(arg0)}\\"'`
    }

    function funkly_gui_img(block: Block) {
        const arg0 = block.getFieldValue("IMAGE") || "score_empty"
        return `'\\"${strip(arg0)}\\"'`
    }
}

const entityCode = (
    id: string,
    name: string,
    x: string,
    initx: number,
    y: string,
    inity: number,
    img: string,
    width: number,
    height: number,
    radius: number,
    initro: number,
    ro: string,
    text: string
) => {
    let output = `"${id}": {`
    output += `"name": ["packF(id)", "${name}"],`

    output += `"x": ["pack(clamp(${x})(0)(500))", ${initx}],`
    output += `"y": ["pack(clamp(${y})(0)(500))", ${inity}],`

    output += `"w": ["packF(id)", ${width}],`
    output += `"h": ["packF(id)", ${height}],`
    output += `"r": ["packF(id)", ${radius}],`
    output += `"ro": ["pack(${ro})", ${initro}],`
    output += `"text": ["pack(${text})", ""],`

    // FIXME: this is duplicated from above
    output += '"r": ["packF(id)", 30],'

    // TODO: Should this happen in the generator code instead of here?
    const imgDefault = entityImages.entries().next().value[1]
    if (img === "") {
        output += `"img": ["packF(id)", "${imgDefault}"]`
    } else {
        output += `"img": ["pack(${img})", "${imgDefault}"]`
    }

    output += "}"
    return output
}

const wrap = (x: string) => "(" + x + ")"

// TODO find better fix for stray spaces
// strip spaces
//args = args.map(x=>x.replace(/\s/g,""));
const strip = (x: string) => x.replace(/\s/g, "")

// wrap varArg of arguments as arguments to curried function
const argwrap = (...xs: string[]) =>
    cat(
        ...xs.map(s => {
            return wrap(strip(s))
        })
    )

const cat = (...xs: string[]) => xs.reduce((x, y) => x + y)

export { funklyBlockType, funklyCodegen }
