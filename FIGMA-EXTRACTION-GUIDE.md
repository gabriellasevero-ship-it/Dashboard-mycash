# Guia de Extração de Valores do Figma MCP

## 📋 Processo Obrigatório

Antes de implementar qualquer componente, **EXTRAIR TODOS OS VALORES** do Figma MCP.

## 🎯 Valores a Extrair da Sidebar

### 1. Cores (Hex do Figma → Token Primitivo)

**Background:**
- Sidebar background: `#_____` → `--gray-XXX` ou criar `--background-sidebar`
- Item ativo background: `#_____` → `--lime-XXX` ou `--color-primary`
- Item inativo background: `transparent` ou `#_____`
- Hover background: `#_____` → `--gray-XXX`

**Bordas:**
- Sidebar border: `#_____` → `--gray-XXX` ou `--color-border`
- Border width: `___px`

**Textos:**
- Texto item ativo: `#_____` → `--color-text-inverse` ou `--gray-XXX`
- Texto item inativo: `#_____` → `--gray-XXX`
- Texto hover: `#_____` → `--gray-XXX`

**Ícones:**
- Ícone ativo: `#_____` → `--lime-XXX` ou `--color-primary`
- Ícone inativo: `#_____` → `--gray-XXX`

### 2. Espaçamentos (px do Figma → Token)

**Sidebar:**
- Width expanded: `___px` (ex: 240px)
- Width collapsed: `___px` (ex: 64px)

**Header:**
- Padding top: `___px` → `--spacing-XXX`
- Padding bottom: `___px` → `--spacing-XXX`
- Padding left/right: `___px` → `--spacing-XXX`

**Items:**
- Padding vertical: `___px` → `--spacing-XXX`
- Padding horizontal: `___px` → `--spacing-XXX`
- Gap entre ícone e texto: `___px` → `--spacing-XXX`
- Gap entre items: `___px` → `--spacing-XXX`

**Footer:**
- Padding: `___px` → `--spacing-XXX`
- Gap avatar-text: `___px` → `--spacing-XXX`

### 3. Tipografia (px/weight do Figma → Token)

**Logo:**
- Font size: `___px` → `--font-size-XXX`
- Font weight: `___` → `--font-weight-XXX`
- Line height: `___` → `--line-height-XXX`

**Labels:**
- Font size: `___px` → `--font-size-XXX`
- Font weight: `___` → `--font-weight-XXX`

**Email/User info:**
- Font size: `___px` → `--font-size-XXX`
- Font weight: `___` → `--font-weight-XXX`

### 4. Shape/Radius (px do Figma → Token)

- Item border-radius: `___px` → `--radius-XXX`
- Avatar border-radius: `___px` → `--radius-full` ou `--radius-XXX`
- Toggle button border-radius: `___px` → `--radius-full`

### 5. Shadows

- Item shadow (se houver): `___` → `--shadow-XXX`
- Toggle button shadow: `___` → `--shadow-XXX`

### 6. Transitions/Animations

- Duration: `___ms` → `--transition-XXX`
- Easing: `___`

## 📝 Template de Extração

```markdown
### Sidebar - [Nome do Elemento]

#### Background
- Valor Figma: `#F5F6F8`
- Token aplicado: `--gray-100` (atualizado)
- Conversão: ✅ Direto (valor exato)

#### Espaçamento
- Valor Figma: `16px`
- Token aplicado: `--spacing-md`
- Conversão: ✅ Mapeado

#### Tipografia
- Valor Figma: `20px / 600`
- Token aplicado: `--font-size-xl / --font-weight-semibold`
- Conversão: ✅ Mapeado
```

## ⚠️ Regras Críticas

1. **NUNCA** usar valores hardcoded sem mapear para token
2. **SEMPRE** documentar a conversão
3. Se valor não mapeia exatamente, usar o **MAIS PRÓXIMO** existente
4. Se não existe token próximo, **CRIAR NOVO TOKEN PRIMITIVO** (não inventar na hora)

## 🔄 Próximos Passos

1. Acessar Figma MCP e extrair JSON completo da Sidebar
2. Mapear cada propriedade CSS para token
3. Atualizar `tokens.css` com valores exatos
4. Refatorar componentes usando tokens mapeados
5. Documentar todas as conversões em `TOKEN-CONVERSIONS.md`
