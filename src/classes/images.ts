
class Image {
    url: string;

    constructor(data: ArrayBuffer, type: string) {
        let blob: Blob;
        if (type === "type/png") {
            blob = new Blob([data], {type: 'image/png'});
        } else if (type === 'type/jpeg') {
            blob = new Blob([data], {type: 'image/jpeg'});
        } else if (type === 'type/gif') {
            blob = new Blob([data], {type: 'image/gif'});
        } else {
            throw new Error('Image type is invalid.');
        }
        const urlCreator  = window.URL || window.webkitURL;
        this.url = urlCreator.createObjectURL(blob);
    }

    getSource() {
        return this.url;
    }
}

export default Image;