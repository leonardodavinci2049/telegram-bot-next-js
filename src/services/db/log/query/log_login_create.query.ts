import { serverEnvs } from "@/core/config/envs.server";
import type { LogLoginCreateDto } from "../dto/log_login_create.dto";

export function LogLoginCreateQuery(dataJsonDto: LogLoginCreateDto): string {
  const PE_APP_ID = serverEnvs.APP_ID;
  const PE_ORGANIZATION_ID = "";
  const PE_USER_ID =  "AAA";
  const PE_MODULE_ID = 1;
  const PE_RECORD_ID = 1;;
  const PE_LOG = dataJsonDto.PE_LOG || "";
  const PE_NOTE = dataJsonDto.PE_NOTE || "";

  const queryString = ` call sp_log_login_create_v1(
        ${PE_APP_ID},
        '${PE_ORGANIZATION_ID}',
        '${PE_USER_ID}',
        ${PE_MODULE_ID},
        ${PE_RECORD_ID},
        '${PE_LOG}',
        '${PE_NOTE}'
        ) `;

  return queryString;
}
