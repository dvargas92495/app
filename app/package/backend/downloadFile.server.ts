import { S3, GetObjectCommandInput } from "@aws-sdk/client-s3";
import fs from "fs";
import { Readable } from "stream";

const downloadFile = ({
  Key = "",
}: Partial<Pick<GetObjectCommandInput, "Key">>) => {
  if (process.env.NODE_ENV === "development") {
    const path = `public/${Key}`;
    if (!fs.existsSync(path)) return Promise.resolve(new Readable());
    return Promise.resolve(fs.createReadStream(path));
  } else {
    const s3 = new S3({ region: "us-east-1" });
    const Bucket = (process.env.ORIGIN || "").replace(/^https:\/\//, "");
    return s3.listObjectsV2({ Bucket, Prefix: Key }).then((r) => {
      if (r.KeyCount === 0) return new Readable();
      return s3
        .getObject({
          Bucket,
          Key,
        })
        .then((r) => r.Body as Readable);
    });
  }
};

export const downloadFileContent = (
  args: Parameters<typeof downloadFile>[0]
): Promise<string> =>
  downloadFile(args).then((fil) => {
    const chunks: Buffer[] = [];
    return new Promise<string>((resolve, reject) => {
      fil.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      fil.on("error", (err) => reject(err));
      fil.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
  });

export default downloadFile;
