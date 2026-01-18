# Token Conversions - Documentação de Conversões

Este documento registra todas as conversões de valores hardcoded do Figma para tokens do design system.

## Hierarquia de Conversão

1. **Semântico** → Usar diretamente (ex: `var(--color-primary)`)
2. **Primitivo** → Usar diretamente (ex: `var(--gray-900)`)
3. **Conversão** → Converter hex/px para token mais próximo

---

## Conversões Realizadas

### PROMPT 2: Design Tokens e Sistema de Cores

**Status:** ✅ Concluído

#### Tokens Criados

**Cores Semânticas:**
- `--color-primary`: `var(--lime-500)` (#84CC16)
- `--color-secondary`: `var(--gray-900)` (#171717)
- `--color-bg`: `var(--gray-50)` (#FAFAFA)
- `--color-surface`: #FFFFFF
- `--color-text-primary`: `var(--gray-900)` (#171717)
- `--color-text-secondary`: `var(--gray-600)` (#525252)
- `--color-border`: `var(--gray-200)` (#E5E5E5)
- `--color-error`: `var(--red-500)` (#EF4444)
- `--color-success`: `var(--green-500)` (#22C55E)
- `--color-warning`: `var(--yellow-500)` (#EAB308)

**Cores Primitivas:**
- Escala Gray: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- Escala Lime: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- Escala Red: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- Escala Green: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- Escala Yellow: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

**Espaçamentos:**
- `--spacing-xs`: 4px
- `--spacing-sm`: 8px
- `--spacing-md`: 16px
- `--spacing-lg`: 24px
- `--spacing-xl`: 32px
- `--spacing-2xl`: 48px
- `--spacing-3xl`: 64px
- `--spacing-4xl`: 96px

**Tipografia:**
- Font sizes: xs (12px), sm (14px), base (16px), lg (18px), xl (20px), 2xl (24px), 3xl (30px), 4xl (36px), 5xl (48px)
- Font weights: light (300), normal (400), medium (500), semibold (600), bold (700), extrabold (800)
- Line heights: tight (1.25), normal (1.5), relaxed (1.75), loose (2)

**Shape/Radius:**
- `--radius-sm`: 4px
- `--radius-md`: 8px
- `--radius-lg`: 12px
- `--radius-xl`: 16px
- `--radius-2xl`: 24px
- `--radius-full`: 9999px

**Shadows:**
- `--shadow-xs`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`, `--shadow-2xl`, `--shadow-inner`

**Z-Index:**
- `--z-dropdown`: 1000
- `--z-sticky`: 1020
- `--z-fixed`: 1030
- `--z-modal-backdrop`: 1040
- `--z-modal`: 1050
- `--z-popover`: 1060
- `--z-tooltip`: 1070
- `--z-toast`: 1080

**Transitions:**
- `--transition-fast`: 150ms
- `--transition-base`: 200ms
- `--transition-slow`: 300ms
- `--transition-slower`: 500ms

---

## Mapeamento Tailwind

Todos os tokens foram mapeados no `tailwind.config.js` para uso via classes Tailwind:

**Exemplos de uso:**
- `bg-primary` → `var(--color-primary)`
- `text-text-primary` → `var(--color-text-primary)`
- `p-md` → `var(--spacing-md)`
- `rounded-lg` → `var(--radius-lg)`
- `shadow-card` → `var(--shadow-card)`

---

## Utilitário tokenMapper.ts

Criado utilitário em `src/utils/tokenMapper.ts` com funções para conversão automática:

- `mapColorToToken(hex: string)` - Converte hex para token
- `mapSpacingToToken(px: number)` - Converte px para token de espaçamento
- `mapFontSizeToToken(px: number)` - Converte px para token de font size
- `mapRadiusToToken(px: number)` - Converte px para token de radius
- `mapFontWeightToToken(weight: number)` - Converte peso para token

---

## Notas

- Todos os valores seguem a hierarquia: Semântico → Primitivo → Conversão
- Nenhum valor hardcoded foi usado quando existe token equivalente
- Tokens semânticos têm prioridade sobre primitivos
- Conversões futuras devem ser documentadas aqui
