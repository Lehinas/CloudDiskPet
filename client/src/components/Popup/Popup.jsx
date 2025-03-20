import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import "bootstrap/dist/css/bootstrap.min.css"
import { useCreateDir } from "../../hooks/useCreateDir"
import { useSelector } from "react-redux"
import Input from "../UI/Input/Input"
import { useEffect, useState } from "react"

function Popup ({ handleClose, show }) {
    const currentDir = useSelector(state => state.files.currentDir)
    const { createFolder } = useCreateDir()
    const [nameDir, setNameDir] = useState("")
    
    const inputHandler = (e) => {
        setNameDir(e.target.value)
    }
   
    const handleCreateDir = () => {
        createFolder(currentDir, nameDir)
        handleClose()
    }
    const fixBug = e => {
        e.stopPropagation()
    }
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton onClick={fixBug}>
                    <Modal.Title>Создать новую папку</Modal.Title>
                </Modal.Header>
                <Modal.Body onClick={fixBug}>
                    <Input
                        placeholder={"Введите название папки"}
                        value={nameDir}
                        onChange={(e) => setNameDir(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer onClick={fixBug}>
                    <Button variant="primary" onClick={handleCreateDir}>
                        Создать
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Popup
