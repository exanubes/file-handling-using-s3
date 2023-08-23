namespace global {
    export type SignedUrlRequest = {
        bucket: string;
        key: string;
    }

    export type SignedPostUrlRequest = SignedUrlRequest & {
        fileName: string;
    }
}