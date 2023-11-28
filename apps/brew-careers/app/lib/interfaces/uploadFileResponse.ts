import {
  AbortMultipartUploadCommandOutput,
  CompleteMultipartUploadCommandOutput,
} from "@aws-sdk/client-s3";

interface IUploadFileResponse
  extends CompleteMultipartUploadCommandOutput,
    AbortMultipartUploadCommandOutput {
  Location: string;
}

export default IUploadFileResponse;
