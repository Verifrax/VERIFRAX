export interface DistributedReceipt {
  version: "v1";
  root: string;
  workers: string[];
  signature: string;
}
