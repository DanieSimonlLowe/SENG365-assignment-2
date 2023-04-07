
enum ImageType {
    GIF,
    PNG,
    JPEG
}


function _arrayBufferToBase64( buffer: ArrayBuffer ) {
    let binary: string = '';
    const bytes: Uint8Array = new Uint8Array( buffer );
    const len: number = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

class Image {
    type: ImageType;
    data: string;

    constructor(data: ArrayBuffer, type: string) {
        if (type === "type/png") {
            this.type = ImageType.PNG;
        } else if (type === 'type/jpeg') {
            this.type = ImageType.JPEG;
        } else if (type === 'type/gif') {
            this.type = ImageType.GIF;
        } else {
            throw new Error('Image type is invalid.');
        }
        //this.data = Buffer.from(data, 'binary').toString('base64');
        this.data = _arrayBufferToBase64(data);
        console.log(this.data);
    }

    getSource() {
        if (this.type === ImageType.GIF) {
            return 'data:image/gif;base64,<%= '+this.data+' %>'
        } else if (this.type === ImageType.PNG) {
            return 'data:image/png;base64,<%= '+this.data+' %>'
        } else {
            return 'data:image/jpeg;base64,<%= '+this.data+' %>'
        }
    }
}

export default Image;