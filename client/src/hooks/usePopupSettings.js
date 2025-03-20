import React, { useEffect, useRef, useState } from "react"

const usePopupSettings = () => {
    const [isOpen, setIsOpen] = useState(false)
    const popupRef = useRef(null)
    const handleClickOutside = (e) => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
            setIsOpen(false)
        }
    }
    useEffect(() => {
        document.addEventListener("click", handleClickOutside)
        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [])
    
    const togglePopup = (e) => {
        e?.stopPropagation()
        setIsOpen((prev) => !prev)
    }
    
    return {
        isOpen,
        popupRef,
        togglePopup
    }
}

export default usePopupSettings