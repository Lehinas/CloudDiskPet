import React, { forwardRef } from "react"
import styles from "./UiPopup.module.css"

const UiPopup = forwardRef(({ items, clickHandler, layout, parentStyles }, ref) => {
    return (
        <div className={`${styles.UiPopup} ${parentStyles?.popup || ""}`} ref={ref}>
            {
                items.map((item, i) => (
                    <button
                        key={i}
                        className={styles.UiPopup_item}
                        onClick={(e) => clickHandler(e, item)}
                    >
                        <img src={item.logo} className={styles.UiPopup_img} />
                        <div className={styles.UiPopup_text}>{item.name}</div>
                        {layout && layout(item)}
                    </button>
                ))
            }
        </div>
    )
})

export default UiPopup