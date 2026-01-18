/**
 * Utilitário para acessar recursos do Figma via API REST
 * 
 * Usa fetch direto para:
 * - Consultar JSON de nodes do Figma
 * - Exportar imagens/assets programaticamente
 * - Obter valores exatos de cores, espaçamentos, tipografia, etc.
 */

// File key do design: XdjADyb9gBAGbk1vqa56r3
const FIGMA_FILE_KEY = 'XdjADyb9gBAGbk1vqa56r3'

// Token do Figma - deve ser definido via variável de ambiente
// Crie um arquivo .env.local com: VITE_FIGMA_TOKEN=seu_token_aqui
const FIGMA_ACCESS_TOKEN = import.meta.env.VITE_FIGMA_TOKEN || ''

// Base URL da API do Figma
const FIGMA_API_BASE = 'https://api.figma.com/v1'

/**
 * IDs dos nodes importantes do Figma
 */
export const FIGMA_NODES = {
  LOGO: '30-1549',
  SIDEBAR: '30-1517',
  DASHBOARD: '42-3096',
} as const

/**
 * Converte node-id (30-1549) para formato de API (30:1549)
 */
function convertNodeId(nodeId: string): string {
  return nodeId.replace(/-/g, ':')
}

/**
 * Faz uma requisição autenticada para a API do Figma
 */
async function figmaRequest(endpoint: string): Promise<any> {
  if (!FIGMA_ACCESS_TOKEN) {
    throw new Error('VITE_FIGMA_TOKEN não está definido. Configure a variável de ambiente.')
  }
  
  const url = `${FIGMA_API_BASE}${endpoint}`
  const response = await fetch(url, {
    headers: {
      'X-Figma-Token': FIGMA_ACCESS_TOKEN,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Figma API error: ${response.status} - ${error}`)
  }

  return response.json()
}

/**
 * Obtém dados de um node específico do Figma
 */
export async function getFigmaNode(nodeId: string) {
  try {
    const formattedNodeId = convertNodeId(nodeId)
    const data = await figmaRequest(`/files/${FIGMA_FILE_KEY}/nodes?ids=${formattedNodeId}`)
    
    if (!data.nodes || !data.nodes[formattedNodeId]) {
      throw new Error(`Node ${nodeId} não encontrado`)
    }
    
    return data.nodes[formattedNodeId]
  } catch (error) {
    console.error(`Erro ao obter node ${nodeId}:`, error)
    throw error
  }
}

/**
 * Exporta uma imagem/asset do Figma e retorna a URL
 */
export async function exportFigmaImage(
  nodeId: string,
  format: 'svg' | 'png' | 'jpg' = 'svg',
  scale: number = 1
): Promise<string> {
  try {
    const formattedNodeId = convertNodeId(nodeId)
    const data = await figmaRequest(
      `/images/${FIGMA_FILE_KEY}?ids=${formattedNodeId}&format=${format}&scale=${scale}`
    )
    
    if (!data.images || !data.images[formattedNodeId]) {
      throw new Error(`Imagem não encontrada para node ${nodeId}`)
    }
    
    return data.images[formattedNodeId]
  } catch (error) {
    console.error(`Erro ao exportar imagem do node ${nodeId}:`, error)
    throw error
  }
}

/**
 * Obtém o arquivo completo do Figma
 */
export async function getFigmaFile() {
  try {
    const data = await figmaRequest(`/files/${FIGMA_FILE_KEY}`)
    return data
  } catch (error) {
    console.error('Erro ao obter arquivo do Figma:', error)
    throw error
  }
}

/**
 * Extrai cores de um node
 */
export function extractColors(node: any): Record<string, string> {
  const colors: Record<string, string> = {}
  
  function traverse(node: any) {
    if (!node || typeof node !== 'object') return
    
    // Extrair fill colors
    if (node.fills && Array.isArray(node.fills)) {
      node.fills.forEach((fill: any, index: number) => {
        if (fill.type === 'SOLID' && fill.color) {
          const { r, g, b } = fill.color
          const hex = rgbToHex(r, g, b)
          const name = node.name ? `${node.name}-fill-${index}` : `fill-${index}`
          colors[name] = hex
        }
      })
    }
    
    // Recursão para filhos
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach((child: any) => traverse(child))
    }
  }
  
  traverse(node)
  return colors
}

/**
 * Extrai espaçamentos (padding, gaps) de um node
 */
export function extractSpacing(node: any): Record<string, number> {
  const spacing: Record<string, number> = {}
  
  if (node.paddingLeft) spacing.paddingLeft = node.paddingLeft
  if (node.paddingRight) spacing.paddingRight = node.paddingRight
  if (node.paddingTop) spacing.paddingTop = node.paddingTop
  if (node.paddingBottom) spacing.paddingBottom = node.paddingBottom
  if (node.itemSpacing) spacing.itemSpacing = node.itemSpacing
  if (node.counterAxisSpacing) spacing.counterAxisSpacing = node.counterAxisSpacing
  if (node.primaryAxisSpacing) spacing.primaryAxisSpacing = node.primaryAxisSpacing
  
  return spacing
}

/**
 * Extrai tipografia de um node
 */
export function extractTypography(node: any): {
  fontSizes: Record<string, number>
  fontWeights: Record<string, number>
  lineHeights: Record<string, number>
} {
  const typography = {
    fontSizes: {} as Record<string, number>,
    fontWeights: {} as Record<string, number>,
    lineHeights: {} as Record<string, number>,
  }
  
  function traverse(node: any) {
    if (!node || typeof node !== 'object') return
    
    if (node.style) {
      const name = node.name || 'default'
      if (node.style.fontSize) {
        typography.fontSizes[name] = node.style.fontSize
      }
      if (node.style.fontWeight) {
        typography.fontWeights[name] = node.style.fontWeight
      }
      if (node.style.lineHeightPx) {
        typography.lineHeights[name] = node.style.lineHeightPx
      }
    }
    
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach((child: any) => traverse(child))
    }
  }
  
  traverse(node)
  return typography
}

/**
 * Extrai radius (border-radius) de um node
 */
export function extractRadius(node: any): Record<string, number> {
  const radius: Record<string, number> = {}
  
  function traverse(node: any) {
    if (!node || typeof node !== 'object') return
    
    if (node.cornerRadius !== undefined) {
      radius[node.name || 'default'] = node.cornerRadius
    }
    
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach((child: any) => traverse(child))
    }
  }
  
  traverse(node)
  return radius
}

/**
 * Converte RGB (0-1) para HEX
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (value: number) => {
    const hex = Math.round(value * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

/**
 * Extrai todos os tokens de design de um node
 */
export async function extractDesignTokens(nodeId: string) {
  const nodeData = await getFigmaNode(nodeId)
  const document = nodeData.document
  
  return {
    colors: extractColors(document),
    spacing: extractSpacing(document),
    typography: extractTypography(document),
    radius: extractRadius(document),
  }
}
