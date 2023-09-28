import {createPresignedPost} from "@aws-sdk/s3-presigned-post";
import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const client = new S3Client()

/**
 * @description create a signed upload url valid for 60 seconds
 * @param {{
 * bucket: string;
 * key: string;
 * fileName: string;
 * }} props
 * */
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

/**
 * @description create a signed download url valid for 60 seconds
 * @param {{
 * bucket: string;
 * key: string;
 * version?: string | null;
 * }} props
 */
export async function createDownloadUrl(props) {
    /**@type {import('@aws-sdk/client-s3').GetObjectCommandInput}*/
    const input = {
        Bucket: props.bucket,
        Key: props.key
    }

    const command = new GetObjectCommand(input);

    return getSignedUrl(client, command, {expiresIn: 60});
}