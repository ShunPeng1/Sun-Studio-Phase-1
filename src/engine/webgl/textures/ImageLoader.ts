import ImageElements from "./ImageElements";


class ImageLoader {
    
    constructor(){

    }

    public loadImageFromUrls(url : string | string[], callbackEach : (imageElement : ImageElements) => void = () => {}, callbackAll : (imageElements : ImageElements[]) => void = () =>{}) {
        let imageElements : ImageElements[] = [];

        if (url instanceof Array) {
            let loadedImages = 0;
            url.forEach((url, index) => {
                let imageElement = new Image();
                
                imageElements.push(imageElement);

                imageElement.src = url;
                imageElement.onload = () => {
                    loadedImages++;

                    callbackEach(imageElement);

                    if (loadedImages === url.length) {
                        callbackAll(imageElements);
                    }
                }
            });
        }
        else{
            let imageElement = new Image();
            
            imageElements.push(imageElement);

            imageElement.src = url;
            imageElement.onload = () => {
                callbackEach(imageElement);
                callbackAll(imageElements);
            }
        }
    }
}

export default ImageLoader;