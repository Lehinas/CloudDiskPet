import React, { useEffect, useRef } from "react"
import styles from "./RenderText.module.css"

const RenderText = ({ data }) => {
    const iframeRef = useRef(null)
    
    const base64ToUtf8 = (base64) => {
        const binaryString = window.atob(base64)
        const bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0))
        const decoder = new TextDecoder("utf-8")
        return decoder.decode(bytes)
    }
    
    useEffect(() => {
        const iframe = iframeRef.current
        if (iframe && data) {
            let decodedData = ""
            try {
                decodedData = base64ToUtf8(data.split(",")[1])
            } catch (error) {
                decodedData = "<div></div>"
            }
            const iframeDocument = iframe.contentDocument
            if (iframeDocument) {
                iframeDocument.open()
                iframeDocument.write(decodedData)
                const style = iframeDocument.createElement("style")
                style.textContent = `
                    * {
                        padding: 0;
                        margin: 0;
                        box-sizing: border-box;
                        font-family: "Open Sans";
                        color: #1F1F1F;
                    }
                    body {
                        padding: 20px;
                        font-size: 24px;
                        background-color: white;
                        white-space: pre-wrap;
                    }
                    h1 {
                        color: #333;
                    }
                `
                iframeDocument.head?.appendChild(style)
                iframeDocument.close()
            }
        }
    }, [data])
    
    return (
        <iframe ref={iframeRef} className={styles.RenderText} />
    )
}

export default RenderText
