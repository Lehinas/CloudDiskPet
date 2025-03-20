import dirLogoUrl, { ReactComponent as DirLogo } from "../assets/images/dirLogo.svg"
import fileLogoUrl, { ReactComponent as FileLogo } from "../assets/images/file.svg"
import pdfLogoUrl, { ReactComponent as PdfLogo } from "../assets/images/pdfLogo.svg"
import imageLogoUrl, { ReactComponent as ImageLogo } from "../assets/images/imageLogo.svg"
import videoLogoUrl, { ReactComponent as VideoLogo } from "../assets/images/videoLogo.svg"
import textLogoUrl, { ReactComponent as TextLogo } from "../assets/images/textLogo.svg"

const logos = {
    pdf: { component: PdfLogo, url: pdfLogoUrl },
    jpg: { component: ImageLogo, url: imageLogoUrl },
    jpeg: { component: ImageLogo, url: imageLogoUrl },
    svg: { component: ImageLogo, url: imageLogoUrl },
    png: { component: ImageLogo, url: imageLogoUrl },
    mp4: { component: VideoLogo, url: videoLogoUrl },
    dir: { component: DirLogo, url: dirLogoUrl },
    txt: { component: TextLogo, url: textLogoUrl },
}

export const getLogo = (resType, extension, type) => {
    let selectedLogo
    if (type === "dir") {
        selectedLogo = { component: DirLogo, url: dirLogoUrl }
    } else {
        selectedLogo = logos[extension] || { component: FileLogo, url: fileLogoUrl }
    }
    
    if (resType === "component") {
        return selectedLogo.component
    } else if (resType === "default") {
        return selectedLogo.url
    }
    
    return null
}
