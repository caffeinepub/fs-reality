import { HttpAgent } from "@icp-sdk/core/agent";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";
import { useInternetIdentity } from "./useInternetIdentity";

/**
 * Returns a function that uploads a File to blob storage and returns the
 * direct HTTP URL. Uploads are authenticated with the current identity.
 */
export function useStorageUpload() {
  const { identity } = useInternetIdentity();

  async function uploadFile(
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<string> {
    const config = await loadConfig();

    const agentOptions: Record<string, unknown> = {
      host: config.backend_host,
    };
    if (identity) {
      agentOptions.identity = identity;
    }

    const agent = await HttpAgent.create(agentOptions);

    const storageClient = new StorageClient(
      config.bucket_name,
      config.storage_gateway_url,
      config.backend_canister_id,
      config.project_id,
      agent,
    );

    const bytes = new Uint8Array(await file.arrayBuffer());
    const { hash } = await storageClient.putFile(bytes, onProgress);
    const url = await storageClient.getDirectURL(hash);
    return url;
  }

  return { uploadFile };
}
