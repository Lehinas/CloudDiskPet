import React, { useEffect, useState } from "react"
import {
    changeFileView,
    changeSortName,
    changeSortType,
    setCurrentDir,
    setCurrentFolder,
    setFolderStack,
} from "../../store/fileSlice"
import { useDispatch, useSelector } from "react-redux"

import styles from "./FileControl.module.css"
import FilePath from "../FilePath/FilePath"
import plate from "../../assets/images/plate.svg"
import list from "../../assets/images/list.svg"
import sortDec from "../../assets/images/sort_dec.svg"
import sortInc from "../../assets/images/sort_inc.svg"
import FilterItem from "../FilterItem/FilterItem"
import arrow_drop_down from "../../assets/images/arrow_drop_down.svg"
import usePopupSettings from "../../hooks/usePopupSettings"
import FilePathMore from "../FilePathMore/FilePathMore"

const FileControl = () => {
    const folderStack = useSelector(state => state.files.folderStack)
    const sortType = useSelector(state => state.files.sortType)
    const sortName = useSelector(state => state.files.sortName)
    const dispatch = useDispatch()

    const [pathElemCount, setPathElemCount] = useState(0)
    
    const { togglePopup, popupRef, isOpen } = usePopupSettings()
    
    const changeViewType = (value) => {
        dispatch(changeFileView(value))
    }
    
    const changeSortNameHandler = (value) => {
        dispatch(changeSortName(value))
        togglePopup()
    }
    
    const changeSortTypeHandler = () => {
        if (sortType === "inc") {
            dispatch(changeSortType("dec"))
        } else {
            dispatch(changeSortType("inc"))
        }
    }
    
    const getSortName = (name) => {
        switch (sortName) {
            case "date":
                return "По дате"
            case "name":
                return "По названию"
            case "size":
                return "По размеру"
        }
    }
    
    const clickHandler = (e, item, currentFolder, currentId, folderName) => {
        if (item.name !== currentFolder) {
            const folderIndex = folderStack.findIndex(
                folder => folder.name === folderName && folder.id === currentId,
            )
            if (folderIndex !== -1) {
                const folderNewStack = folderStack.slice(0, folderIndex + 1)
                dispatch(setFolderStack(folderNewStack))
                dispatch(setCurrentDir(currentId))
                dispatch(setCurrentFolder(item.name))
            } else {
                console.log("не найден")
            }
        } else {
            togglePopup(e)
        }
    }
    
    const renderFolderStack = () => {
        let lastTwoElements, otherElements
        if (pathElemCount > 3) {
            if (pathElemCount === 4) {
                lastTwoElements = folderStack.slice(-1)
                otherElements = folderStack.slice(0, pathElemCount - 1)
                
            } else {
                lastTwoElements = folderStack.slice(-2)
                otherElements = folderStack.slice(0, pathElemCount - 2)
            }
        }
        if (lastTwoElements && otherElements) {
            return <>
                <FilePathMore items={otherElements} clickHandler={clickHandler} />
                {lastTwoElements.map((item, i) => {
                    return <FilePath
                        currentId={item.id}
                        folderName={item.name}
                        item={item}
                        key={i}
                        last={(lastTwoElements.length - 1) === i ? true : false}
                        clickHandler={clickHandler}
                    />
                })}
            </>
        }
        return folderStack.map((item, i) => {
            return <FilePath
                currentId={item.id}
                folderName={item.name}
                item={item}
                key={i}
                last={(folderStack.length - 1) === i ? true : false}
                clickHandler={clickHandler}
            />
        })
    }
    
    useEffect(() => {
        if (pathElemCount !== folderStack.length) {
            setPathElemCount(folderStack.length)
        }
    }, [folderStack])
    return (
        <div className={styles.FileControl}>
            <div className={styles.FileControl_header}>
                <div className={styles.FileControl_path}>
                    {renderFolderStack()}
                </div>
                <div className={styles.FileControl_view}>
                    <div className={styles.FileControl_view_popup_wrapper}>
                        <button className={styles.FileControl_view_popup_btn} onClick={(e) => togglePopup(e)}>
                            <div>{getSortName(sortName)}</div>
                            <img src={arrow_drop_down} />
                        </button>
                        {isOpen && (
                            <div className={styles.FileControl_view_popup} ref={popupRef}>
                                <button
                                    className={styles.FileControl_view_popup_item}
                                    onClick={() => changeSortNameHandler("date")}
                                >По дате
                                </button>
                                <button
                                    className={styles.FileControl_view_popup_item}
                                    onClick={() => changeSortNameHandler("name")}
                                >По названию
                                </button>
                                <button
                                    className={styles.FileControl_view_popup_item}
                                    onClick={() => changeSortNameHandler("size")}
                                >По размеру
                                </button>
                            </div>
                        )}
                    </div>
                    <button className={styles.FileControl_view_btn} onClick={changeSortTypeHandler}>
                        <img src={sortType === "inc" ? sortInc : sortDec} />
                    </button>
                    <button className={styles.FileControl_view_btn} onClick={() => changeViewType("list")}>
                        <img src={list} />
                    </button>
                    <button className={styles.FileControl_view_btn} onClick={() => changeViewType("plate")}>
                        <img src={plate} />
                    </button>
                </div>
            </div>
            <div className={styles.FileControl_filters}>
                {[{ name: "Тип", type: "type" }].map((item, i) => <FilterItem item={item} key={i} />)}
            </div>
        </div>
    )
}

export default FileControl