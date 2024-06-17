import ImageElement from "./ImageElements";


class ImageLoader {
    
    constructor(){

    }

    public loadImageFromUrls(imageUrl: string | string[], callbackAll: (imageElements: ImageElement[]) => void = () => {} , callbackEach: (imageElement: ImageElement) => void = () => {}): Promise<ImageElement[]> {
        let imageElements: ImageElement[] = [];

        return new Promise((resolve, reject) => {
            if (imageUrl instanceof Array) {
                let loadedImages = 0;
                imageUrl.forEach((url, index) => {
                    let imageElement = new Image();
                    imageElements.push(imageElement);
                    imageElement.src = url;
                    imageElement.onload = () => {
                        loadedImages++;
                        callbackEach(imageElement);
                        if (loadedImages === imageUrl.length) {
                            callbackAll(imageElements);
                            resolve(imageElements);
                        }
                    };
                    imageElement.onerror = reject;
                });
            } else {
                let imageElement = new Image();
                imageElements.push(imageElement);
                imageElement.src = imageUrl;
                imageElement.onload = () => {
                    callbackEach(imageElement);
                    callbackAll(imageElements);
                    resolve(imageElements);
                };
                imageElement.onerror = reject;
            }
        });
    }
}

export default ImageLoader;