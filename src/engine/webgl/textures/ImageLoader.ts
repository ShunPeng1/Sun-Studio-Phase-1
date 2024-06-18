import ImageElement from "./ImageElements";


class ImageLoader {
    private static urlToImageElement: Map<string, ImageElement> = new Map<string, ImageElement>();

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
                        
                        ImageLoader.urlToImageElement.set(url, imageElement);
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
                    ImageLoader.urlToImageElement.set(imageUrl, imageElement);
                    callbackEach(imageElement);
                    callbackAll(imageElements);
                    resolve(imageElements);
                };
                imageElement.onerror = reject;
            }
        });
    }

    private getImageElementByUrl(url: string): ImageElement{
        if (!ImageLoader.urlToImageElement.has(url)) {
            throw new Error(`Image with url ${url} not found`);
        }
        return ImageLoader.urlToImageElement.get(url)!;
    }

    public getImageElements(urls : string[] | string): ImageElement[]{
        if (typeof urls === 'string') {
            urls = [urls];
        }
    
        return urls.map((url) => this.getImageElementByUrl(url));
    }

}

export default ImageLoader;