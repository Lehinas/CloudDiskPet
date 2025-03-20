import React, { useEffect, useRef } from "react"
import styles from "./RenderText.module.css"

const RenderText = ({ data }) => {
    const iframeRef = useRef(null)
    
    useEffect(() => {
        const iframe = iframeRef.current
        if (iframe && data) {
            let decodedData = atob(data.split(",")[1])
            // костыли
            if(!decodedData){
                decodedData = "<div></div>"
            }
            const iframeDocument = iframe.contentDocument
            if (iframeDocument) {
                iframeDocument.open()
                iframeDocument.write(decodedData)
                
                // Добавляем стили
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
