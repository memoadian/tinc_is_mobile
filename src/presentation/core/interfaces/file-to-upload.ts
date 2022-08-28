export interface FileToUpload {
    fileName: string
    fileSize: number
    fileType: string
    lastModifiedTime: number
    lastModifiedDate: Date
    fileAsBase64: string
    file?: any;
    filetype: string;
    S3_URL: string;
    url : string;
    altName: string;
  }