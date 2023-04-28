
class Image {
    url: string;
    data: ArrayBuffer

    constructor(data: ArrayBuffer) {
        const base64 = btoa(
            new Uint8Array(data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
            )
        )
        this.data = data;
        this.url = 'data:;base64,' + base64;
    }

    getSource() {
        return this.url;
    }
}

export default Image;