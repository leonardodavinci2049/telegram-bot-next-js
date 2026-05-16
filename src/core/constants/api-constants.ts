/**
 * Constantes da API para endpoints e configurações
 */

import { serverEnvs } from "../config/envs.server";


// URL base da API Externa (Servidor NestJS) - apenas server-side
// Esta é a URL do backend que fornece os dados via REST API
export const EXTERNAL_API_BASE_URL = serverEnvs.EXTERNAL_API_MAIN_URL;




// Endpoints de Produto Web
export const PRODUCT_WEB_ENDPOINTS = {
  FIND_BY_ID: "/product/v2/product-web-find-id",
  FIND: "/product/v2/product-web-find",
  SECTIONS: "/product/v2/product-web-sections",
} as const;





// Configurações de timeout (em milissegundos)
export const API_TIMEOUTS = {
  CLIENT_DEFAULT: 15000, // 15 segundos para requisições normais do cliente
  CLIENT_UPLOAD: 60000, // 60 segundos para uploads de arquivos
  SERVER_DEFAULT: 30000, // 30 segundos para requisições normais do servidor
  SERVER_LONG_RUNNING: 120000, // 120 segundos para operações longas (relatórios, exports)
  SERVER_UPLOAD: 180000, // 180 segundos para uploads grandes no servidor
} as const;


// Configurações padrão do sistema
export const SYSTEM_CONFIG = {
  ID_APP: 1,
  ID_CUSTOMER: 1,
  ID_TYPE: 1,
} as const;

// Headers padrão para requisições
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest",
} as const;

// Configurações de retry
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 segundo
  RETRY_CODES: [408, 429, 500, 502, 503, 504],
} as const;

// Tipos de resposta da API
/**
 * Códigos de status da API externa (NestJS)
 * ATENÇÃO: São diferentes dos códigos HTTP padrão
 * A API retorna códigos customizados no formato 100XXX
 */
export const API_STATUS_CODES = {
  SUCCESS: 100200, // Operação bem-sucedida
  EMPTY_RESULT: 100204, // Busca válida mas sem resultados
  ERROR: 100400, // Erro de validação ou regra de negócio
  NOT_FOUND: 100404, // Recurso não encontrado
  UNPROCESSABLE: 100422, // Entidade não processável (deprecated - usar NOT_FOUND)
} as const;

/**
 * Mapeia os códigos de status customizados da API para códigos HTTP padrão
 * Útil para integração com bibliotecas que esperam status HTTP convencionais
 *
 * @param apiStatus - Código de status da API (100XXX)
 * @returns Código HTTP padrão correspondente
 *
 * @example
 * ```typescript
 * const httpStatus = mapApiStatusToHttp(100200); // 200
 * const notFoundStatus = mapApiStatusToHttp(100404); // 404
 * ```
 */
export function mapApiStatusToHttp(apiStatus: number): number {
  switch (apiStatus) {
    case API_STATUS_CODES.SUCCESS:
      return 200;
    case API_STATUS_CODES.EMPTY_RESULT:
      return 204;
    case API_STATUS_CODES.NOT_FOUND:
    case API_STATUS_CODES.UNPROCESSABLE:
      return 404;
    case API_STATUS_CODES.ERROR:
      return 400;
    default:
      return 500;
  }
}

/**
 * Verifica se um código de status da API representa sucesso
 *
 * @param apiStatus - Código de status da API
 * @returns true se for código de sucesso
 */
export function isApiSuccess(apiStatus: number): boolean {
  return (
    apiStatus === API_STATUS_CODES.SUCCESS ||
    apiStatus === API_STATUS_CODES.EMPTY_RESULT
  );
}

/**
 * Verifica se um código de status da API representa erro
 *
 * @param apiStatus - Código de status da API
 * @returns true se for código de erro
 */
export function isApiError(apiStatus: number): boolean {
  return !isApiSuccess(apiStatus);
}
