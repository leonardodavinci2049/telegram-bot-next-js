import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import axios from "axios";
import { createLogger } from "@/core/logger";

const logger = createLogger("PhotoUpload");

const DOWNLOAD_DIR = join(
  process.cwd(),
  "src/services/telegram/bot1/download/images",
);

interface DownloadPhotoResult {
  filePath: string;
  fileName: string;
}

export async function downloadPhoto(
  botToken: string,
  fileId: string,
): Promise<DownloadPhotoResult | null> {
  try {
    const getFileUrl = `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`;
    const getResponse = await axios.get(getFileUrl);
    const telegramFilePath = getResponse.data.result.file_path;

    const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${telegramFilePath}`;
    const fileResponse = await axios.get(downloadUrl, {
      responseType: "arraybuffer",
    });

    await mkdir(DOWNLOAD_DIR, { recursive: true });

    const ext = telegramFilePath.split(".").pop() || "jpg";
    const fileName = `photo_${Date.now()}.${ext}`;
    const fullPath = join(DOWNLOAD_DIR, fileName);

    await writeFile(fullPath, Buffer.from(fileResponse.data));

    logger.info(`Foto salva: ${fullPath}`);
    return { filePath: fullPath, fileName };
  } catch (error) {
    logger.error("Falha ao baixar foto", error);
    return null;
  }
}
