/**
 * Utilitário para acessar recursos do Figma via MCP
 * 
 * Este utilitário fornece funções para:
 * - Consultar JSON de nodes do Figma
 * - Exportar imagens/assets programaticamente
 * - Obter valores exatos de cores, espaçamentos, tipografia, etc.
 * 
 * Requer servidor MCP do Figma configurado no Cursor
 */

/**
 * IDs dos nodes importantes do Figma
 */
export const FIGMA_NODES = {
  LOGO: '30-1549',
  SIDEBAR: '30-1517',
  DASHBOARD: '42-3096',
} as const

/**
 * Base URL do design no Figma
 */
const FIGMA_DESIGN_URL = 'https://www.figma.com/design/XdjADyb9gBAGbk1vqa56r3/Workshop---Do-figma-MCP-ao-Cursor-AI-v.3--Community-'

/**
 * URI do MCP para um node específico
 */
export function getFigmaNodeURI(nodeId: string): string {
  return `figma://file/XdjADyb9gBAGbk1vqa56r3/node/${nodeId}`
}

// Função removida - usar getFigmaNode do figmaAPI.ts ao invés
// eslint-disable-next-line @typescript-eslint/no-unused-vars

/**
 * URL completa do Figma para um node
 */
export function getFigmaNodeURL(nodeId: string): string {
  return `${FIGMA_DESIGN_URL}?node-id=${nodeId}`
}

/**
 * Extrai valores de design de um node do Figma
 * 
 * @example
 * ```ts
 * const logoData = await fetchFigmaNodeData(FIGMA_NODES.LOGO)
 * // Retorna: { colors, spacing, typography, etc }
 * ```
 */
export async function fetchFigmaNodeData(_nodeId: string): Promise<any> {
  // Esta função será implementada quando o MCP do Figma estiver configurado
  // Por enquanto, retorna um placeholder
  throw new Error(
    'Figma MCP não está configurado. ' +
    'Configure o servidor MCP do Figma no Cursor para usar esta função.'
  )
}

/**
 * Exporta uma imagem/asset do Figma
 * 
 * @param nodeId - ID do node no Figma
 * @param format - Formato de exportação (svg, png, jpg)
 * @param downloadPath - Caminho onde salvar o arquivo
 */
export async function exportFigmaAsset(
  _nodeId: string,
  _format: 'svg' | 'png' | 'jpg' = 'svg',
  _downloadPath?: string
): Promise<string> {
  // Esta função será implementada quando o MCP do Figma estiver configurado
  throw new Error(
    'Figma MCP não está configurado. ' +
    'Configure o servidor MCP do Figma no Cursor para usar esta função.'
  )
}

/**
 * Extrai tokens de design de um node do Figma
 * Retorna cores, espaçamentos, tipografia, radius, shadows, etc.
 */
export async function extractDesignTokens(_nodeId: string): Promise<{
  colors: Record<string, string>
  spacing: Record<string, number>
  typography: {
    fontSizes: Record<string, number>
    fontWeights: Record<string, number>
    lineHeights: Record<string, number>
  }
  radius: Record<string, number>
  shadows: Record<string, string>
}> {
  // Esta função será implementada quando o MCP do Figma estiver configurado
  throw new Error(
    'Figma MCP não está configurado. ' +
    'Configure o servidor MCP do Figma no Cursor para usar esta função.'
  )
}

/**
 * Mapeia valores do Figma para tokens do design system
 */
export function mapFigmaValueToToken(
  value: string | number,
  _type: 'color' | 'spacing' | 'fontSize' | 'fontWeight' | 'radius'
): string {
  // Esta função usa o tokenMapper existente
  // Será expandida quando tivermos acesso ao Figma MCP
  return String(value)
}
