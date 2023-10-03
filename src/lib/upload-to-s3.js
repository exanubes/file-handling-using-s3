/**
 * @description upload file by sending a post request to aws s3 signed url
 * @param {File} file
 * @param {string} url
 * @param {Record<string, string>} fields
 * */
export function uploadToS3(file, url, fields) {
    const formData = new FormData();

    Object.entries(fields).forEach(([key, value])=>{
        formData.append(key, value);
    })

    formData.append('file', file);

    return fetch(url, {
        method: 'POST',
        body: formData
    })
}