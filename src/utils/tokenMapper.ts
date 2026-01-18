/**
 * Token Mapper - Utilitário para conversão de valores do Figma para tokens
 * 
 * Este utilitário ajuda a converter valores hardcoded (hex, px, etc) encontrados
 * no Figma para os tokens do design system, seguindo a hierarquia:
 * 1. Semântico → 2. Primitivo → 3. Conversão inteligente
 */

/**
 * Mapeamento de cores hex para tokens primitivos
 */
const COLOR_MAP: Record<string, string> = {
  // Gray scale
  '#FAFAFA': 'var(--gray-50)',
  '#F5F5F5': 'var(--gray-100)',
  '#E5E5E5': 'var(--gray-200)',
  '#D4D4D4': 'var(--gray-300)',
  '#A3A3A3': 'var(--gray-400)',
  '#737373': 'var(--gray-500)',
  '#525252': 'var(--gray-600)',
  '#404040': 'var(--gray-700)',
  '#262626': 'var(--gray-800)',
  '#171717': 'var(--gray-900)',
  
  // Lime scale
  '#F7FEE7': 'var(--lime-50)',
  '#ECFCCB': 'var(--lime-100)',
  '#D9F99D': 'var(--lime-200)',
  '#BEF264': 'var(--lime-300)',
  '#A3E635': 'var(--lime-400)',
  '#84CC16': 'var(--lime-500)',
  '#65A30D': 'var(--lime-600)',
  '#4D7C0F': 'var(--lime-700)',
  '#3F6212': 'var(--lime-800)',
  '#365314': 'var(--lime-900)',
  
  // Red scale
  '#EF4444': 'var(--red-500)',
  '#DC2626': 'var(--red-600)',
  '#B91C1C': 'var(--red-700)',
  
  // Green scale
  '#22C55E': 'var(--green-500)',
  '#16A34A': 'var(--green-600)',
  
  // Yellow scale
  '#EAB308': 'var(--yellow-500)',
  '#CA8A04': 'var(--yellow-600)',
  
  // Common colors
  '#FFFFFF': '#FFFFFF', // Branco - pode usar diretamente
  '#000000': 'var(--gray-900)', // Preto → gray-900
};

/**
 * Mapeamento de espaçamentos px para tokens
 */
const SPACING_MAP: Record<number, string> = {
  4: 'var(--spacing-xs)',
  8: 'var(--spacing-sm)',
  16: 'var(--spacing-md)',
  24: 'var(--spacing-lg)',
  32: 'var(--spacing-xl)',
  48: 'var(--spacing-2xl)',
  64: 'var(--spacing-3xl)',
  96: 'var(--spacing-4xl)',
};

/**
 * Mapeamento de font sizes px para tokens
 */
const FONT_SIZE_MAP: Record<number, string> = {
  12: 'var(--font-size-xs)',
  14: 'var(--font-size-sm)',
  16: 'var(--font-size-base)',
  18: 'var(--font-size-lg)',
  20: 'var(--font-size-xl)',
  24: 'var(--font-size-2xl)',
  30: 'var(--font-size-3xl)',
  36: 'var(--font-size-4xl)',
  48: 'var(--font-size-5xl)',
};

/**
 * Mapeamento de border radius px para tokens
 */
const RADIUS_MAP: Record<number, string> = {
  0: 'var(--radius-none)',
  4: 'var(--radius-sm)',
  8: 'var(--radius-md)',
  12: 'var(--radius-lg)',
  16: 'var(--radius-xl)',
  24: 'var(--radius-2xl)',
  9999: 'var(--radius-full)',
};

/**
 * Converte uma cor hex para token primitivo ou semântico
 * @param hex - Cor em formato hex (#RRGGBB ou #RRGGBBAA)
 * @returns Token CSS ou hex original se não encontrado
 */
export function mapColorToToken(hex: string): string {
  const normalizedHex = hex.toUpperCase();
  
  // Verifica mapeamento direto
  if (COLOR_MAP[normalizedHex]) {
    return COLOR_MAP[normalizedHex];
  }
  
  // Se não encontrado, retorna o hex original
  // Em produção, você pode querer logar um warning aqui
  console.warn(`Cor ${hex} não mapeada. Considere adicionar ao tokenMapper.`);
  return hex;
}

/**
 * Converte um espaçamento em px para token
 * @param px - Valor em pixels
 * @returns Token CSS ou valor mais próximo
 */
export function mapSpacingToToken(px: number): string {
  // Verifica mapeamento exato
  if (SPACING_MAP[px]) {
    return SPACING_MAP[px];
  }
  
  // Encontra o valor mais próximo
  const spacingValues = Object.keys(SPACING_MAP).map(Number).sort((a, b) => a - b);
  let closest = spacingValues[0];
  let minDiff = Math.abs(px - closest);
  
  for (const value of spacingValues) {
    const diff = Math.abs(px - value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = value;
    }
  }
  
  return SPACING_MAP[closest] || `${px}px`;
}

/**
 * Converte um font size em px para token
 * @param px - Valor em pixels
 * @returns Token CSS ou valor mais próximo
 */
export function mapFontSizeToToken(px: number): string {
  if (FONT_SIZE_MAP[px]) {
    return FONT_SIZE_MAP[px];
  }
  
  // Encontra o valor mais próximo
  const fontSizeValues = Object.keys(FONT_SIZE_MAP).map(Number).sort((a, b) => a - b);
  let closest = fontSizeValues[0];
  let minDiff = Math.abs(px - closest);
  
  for (const value of fontSizeValues) {
    const diff = Math.abs(px - value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = value;
    }
  }
  
  return FONT_SIZE_MAP[closest] || `${px}px`;
}

/**
 * Converte um border radius em px para token
 * @param px - Valor em pixels
 * @returns Token CSS ou valor mais próximo
 */
export function mapRadiusToToken(px: number): string {
  if (RADIUS_MAP[px]) {
    return RADIUS_MAP[px];
  }
  
  // Encontra o valor mais próximo
  const radiusValues = Object.keys(RADIUS_MAP).map(Number).sort((a, b) => a - b);
  let closest = radiusValues[0];
  let minDiff = Math.abs(px - closest);
  
  for (const value of radiusValues) {
    const diff = Math.abs(px - value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = value;
    }
  }
  
  return RADIUS_MAP[closest] || `${px}px`;
}

/**
 * Converte um valor de peso de fonte para token
 * @param weight - Peso da fonte (300, 400, 500, 600, 700, 800)
 * @returns Token CSS
 */
export function mapFontWeightToToken(weight: number): string {
  const weightMap: Record<number, string> = {
    300: 'var(--font-weight-light)',
    400: 'var(--font-weight-normal)',
    500: 'var(--font-weight-medium)',
    600: 'var(--font-weight-semibold)',
    700: 'var(--font-weight-bold)',
    800: 'var(--font-weight-extrabold)',
  };
  
  return weightMap[weight] || 'var(--font-weight-normal)';
}

/**
 * Documenta uma conversão realizada
 */
export interface TokenConversion {
  original: string | number;
  token: string;
  type: 'color' | 'spacing' | 'fontSize' | 'radius' | 'fontWeight';
  justification?: string;
}

/**
 * Lista de conversões realizadas (para documentação)
 */
export const conversions: TokenConversion[] = [];

/**
 * Registra uma conversão para documentação
 */
export function recordConversion(conversion: TokenConversion): void {
  conversions.push(conversion);
}

/**
 * Obtém todas as conversões registradas
 */
export function getConversions(): TokenConversion[] {
  return [...conversions];
}
