import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import axios from "axios";
import { createLogger } from "@/core/logger";

const logger = createLogger("VoiceUpload");

const DOWNLOAD_DIR = join(
  process.cwd(),
  "src/services/telegram/bot1/download/voice",
);

interface DownloadVoiceResult {
  filePath: string;
  fileName: string;
}

export async function downloadVoice(
  botToken: string,
  fileId: string,
): Promise<DownloadVoiceResult | null> {
  try {
    const getFileUrl = `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`;
    const getResponse = await axios.get(getFileUrl);
    const telegramFilePath = getResponse.data.result.file_path;

    const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${telegramFilePath}`;
    const fileResponse = await axios.get(downloadUrl, {
      responseType: "arraybuffer",
    });

    await mkdir(DOWNLOAD_DIR, { recursive: true });

    const ext = telegramFilePath.split(".").pop() || "ogg";
    const fileName = `voice_${Date.now()}.${ext}`;
    const fullPath = join(DOWNLOAD_DIR, fileName);

    await writeFile(fullPath, Buffer.from(fileResponse.data));

    logger.info(`Audio de voz salvo: ${fullPath}`);
    return { filePath: fullPath, fileName };
  } catch (error) {
    logger.error("Falha ao baixar audio de voz", error);
    return null;
  }
}
