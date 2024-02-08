# File handling with s3

This example project serves as an exploration of Amazon Simple Storage Service (S3) capabilities, showcasing an implementation of some key features for developers. The project focuses on various aspects, including upload and download functionalities using signed URLs, bucket versioning, archiving, retrieval, and multipart uploads.

The project uses [SST](https://sst.dev) for deploying AWS Resources and [Turso](https://turso.tech) for storing data in a SQLite Database.
UI is built with [SvelteKit](https://kit.svelte.dev/) but can be easily replaced with a technology of your choosing. [React Form](https://react.email/) is used for
composing a HTML Email.

**TOC:**

1. [Signed URLs for Secure Uploads and Downloads](#signed-urls-for-secure-uploads-and-downloads)
2. [Bucket Versioning](#bucket-versioning)
3. [Archiving and Retrieval](#archiving-and-retrieval)
4. [Multipart Uploads](#multipart-uploads)

## Signed URLs for Secure Uploads and Downloads

Demonstrates the implementation of AWS S3 signed URLs to securely upload and download files. This ensures that only authorized users with the correct credentials can perform these actions.

[🎥 Video](https://youtu.be/1nmJldXxgGY) <br/>
[✍️ Article](https://exanubes.com/blog/upload-and-download-files-using-signed-urls)

## Bucket Versioning

Illustrates the benefits of enabling bucket versioning in AWS S3, allowing for the management of different versions of objects within a bucket. This feature enhances data protection and provides a mechanism for easy rollback in case of unintended modifications.

[🎥 Video](https://youtu.be/pS3OD_G7LxQ) <br/>
[✍️ Article](https://exanubes.com/blog/versioning-documents-in-amazon-s3)

## Archiving and Retrieval

Explores the archival capabilities of AWS S3, demonstrating how to seamlessly transition objects between storage classes to optimize costs while ensuring efficient data retrieval when needed.

[🎥 Video](https://youtu.be/Bqegwv7DDas) <br/>
[✍️ Article](https://exanubes.com/blog/s3-lifecycle-rules-archiving-and-retrieval)

## Multipart Uploads

Provides a detailed guide on leveraging multipart uploads for large file transfers to AWS S3. This feature enhances upload reliability and performance by breaking files into smaller parts, especially useful for handling large datasets.

[🎥 Video](https://youtu.be/U2SVFyU_7Co) <br/>
[✍️ Article](https://exanubes.com/blog/s3-multipart-upload-with-signed-urls)

## Getting Started

- Configure AWS credentials using the AWS CLI
- Install dependencies with `npm install` (assuming Node.js is installed).
- Deploy infrastructure to aws with `npx sst dev`
- Launch app with `npm run dev`

Feel free to use and extend this project as a foundation for integrating AWS S3 features into your applications. If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request. Happy coding!
