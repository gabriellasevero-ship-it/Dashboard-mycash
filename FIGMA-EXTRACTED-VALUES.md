# Valores Extraídos do Figma via API

## 🎨 Cores da Sidebar

### Item Ativo (botão sidebar)
- **Cor de fundo**: `#D7FF00` (verde-limão do Figma)
- **Texto**: `#080B12` (preto escuro)
- **Ícone ativo**: `#FFFFFF` (branco)

### Item Inativo
- **Texto**: `#080B12` (preto escuro)
- **Ícone inativo**: `#080B12` (preto escuro)

### Sidebar Background
- **Background**: `#FFFFFF` (branco)

### Avatar
- **Avatar placeholder**: `#D9D9D9` (cinza claro)

## 📏 Espaçamentos

- **Padding**: `8px` → `--spacing-sm`
- **Item spacing**: `26px` → mais próximo de `--spacing-lg` (24px) ou usar valor específico

## 🔤 Tipografia

### Labels de Navegação (Home, Cartões, etc.)
- **Font size**: `18px` → `--font-size-lg`
- **Font weight**: `600` → `--font-weight-semibold`
- **Line height**: `24px` → próximo de `--line-height-normal` (1.5 * 18px = 27px) ou usar específico

### Nome do Usuário
- **Font size**: `16px` → `--font-size-base`
- **Font weight**: `600` → `--font-weight-semibold`
- **Line height**: `20px` → `--line-height-normal` (1.5 * 16px = 24px, mas Figma usa 20px)

### Email do Usuário
- **Font size**: `14px` → `--font-size-sm`
- **Font weight**: `400` → `--font-weight-normal`
- **Line height**: `20px` → `--line-height-normal` (1.43 * 14px ≈ 20px)

## 🔲 Radius

- **Sidebar corner**: `5px` → mais próximo de `--radius-sm` (4px) ou `--radius-md` (8px)
- **Botão toggle**: `100` (full radius) → `--radius-full`
- **Botão close**: `100` (full radius) → `--radius-full`

## ⚠️ Diferenças Encontradas

### Cor Primária
- **Token atual**: `#84CC16` (--lime-500)
- **Figma sidebar**: `#D7FF00` (mais claro/amarelado)

**Ação**: Precisamos decidir qual usar ou se o Figma usa uma variante.

### Item Spacing
- **Token mais próximo**: `--spacing-lg` (24px)
- **Valor do Figma**: `26px`

**Ação**: Usar `--spacing-lg` ou criar token específico se necessário.

### Line Heights
- Figma usa valores específicos (20px, 24px) que não correspondem exatamente aos tokens de line-height (1.5, 1.25, etc.)

**Ação**: Usar valores do Figma diretamente ou mapear para tokens mais próximos.
