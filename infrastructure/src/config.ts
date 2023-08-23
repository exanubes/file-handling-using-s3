import {join} from 'path'

require('dotenv').config({path: join(process.cwd(), '..', '.env')})
export const BUCKET_NAME = String(process.env.BUCKET_NAME)

