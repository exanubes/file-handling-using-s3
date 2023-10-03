import "sst/node/config";
declare module "sst/node/config" {
  export interface ConfigTypes {
    APP: string;
    STAGE: string;
  }
}

import "sst/node/bucket";
declare module "sst/node/bucket" {
  export interface BucketResources {
    "uploads": {
      bucketName: string;
    }
  }
}

import "sst/node/site";
declare module "sst/node/site" {
  export interface SvelteKitSiteResources {
    "site": {
      url: string;
    }
  }
}

