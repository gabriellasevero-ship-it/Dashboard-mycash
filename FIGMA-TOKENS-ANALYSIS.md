# Análise de Tokens do Figma MCP

## Valores Extraídos do Figma

### CSS Example fornecido:
```css
/* home-dashboard-responsive */
background: #F5F6F8; /* Colors/Background/background-400 */
```

### Conversão Aplicada:
- `#F5F6F8` → `--gray-100` (atualizado de `#F5F5F5` para `#F5F6F8` - valor exato do Figma)

### Próximos Passos:
1. Extrair todos os valores de cores, espaçamentos, tipografia do Figma MCP
2. Mapear cada valor para token primitivo ou criar novo se necessário
3. Documentar todas as conversões
4. Refatorar componentes para usar valores exatos do Figma

## Tokens a Extrair do Figma MCP:

### Sidebar:
- [ ] Background color
- [ ] Border color
- [ ] Item ativo (cor de fundo, texto, ícone)
- [ ] Item inativo (cor de fundo, texto, ícone)
- [ ] Hover states
- [ ] Espaçamentos (padding, gap, margin)
- [ ] Tipografia (font-size, font-weight, line-height)
- [ ] Radius (border-radius)
- [ ] Shadows
- [ ] Transitions

### Header:
- [ ] Logo colors
- [ ] Text colors
- [ ] Spacing

### Footer:
- [ ] Avatar size
- [ ] Text colors
- [ ] Spacing
