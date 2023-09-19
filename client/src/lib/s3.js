import {createPresignedPost} from "@aws-sdk/s3-presigned-post";
import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const client = new S3Client()
export async function createPostUrl(props) {
    const contentDisposition = `attachment; filename=${props.fileName}`
    return createPresignedPost(client, {
        Bucket: props.bucket,
        Key: props.key,
        Expires: 60,
        Fields: {
            'Content-Disposition': contentDisposition
        }
    })
}

export async function createDownloadUrl(props) {
    const input = {
        Bucket: props.bucket,
        Key: props.key
    }

    const command = new GetObjectCommand(input);

    return getSignedUrl(client, command, {expiresIn: 60});
}