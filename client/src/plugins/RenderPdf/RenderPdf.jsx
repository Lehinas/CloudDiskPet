import React, { useState } from "react"
import styles from "./RenderPdf.module.css"
import { Document, Page, pdfjs } from "react-pdf"
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
).toString()
const RenderPdf = ({data}) => {
    const [numPages, setNumPages] = useState(null)
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages)
    }
    return (
        <Document
            file={data}
            onLoadSuccess={onDocumentLoadSuccess}
            className={styles.RenderPdf_pdf}
        >
            {Array.from(
                new Array(numPages),
                (el, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        className={styles.RenderPdf_pdf_page}
                    />
                ),
            )}
        </Document>
    )
}

export default RenderPdf