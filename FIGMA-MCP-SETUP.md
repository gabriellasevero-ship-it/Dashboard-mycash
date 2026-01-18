# Configuração do Figma MCP

## 📋 Pré-requisitos

Para usar o Figma MCP e extrair recursos automaticamente, você precisa:

1. **Token de Acesso do Figma**
   - Acesse: https://www.figma.com/developers/api#access-tokens
   - Crie um Personal Access Token
   - Copie o token gerado

2. **Configurar MCP no Cursor**
   - Abra Settings do Cursor
   - Vá para a seção MCP (Model Context Protocol)
   - Adicione o servidor Figma com seu token

## 🔧 Configuração do Servidor MCP

### Opção 1: Servidor MCP do Figma (se disponível)

No arquivo de configuração do Cursor (geralmente `~/.cursor/mcp.json` ou similar):

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-figma"
      ],
      "env": {
        "FIGMA_ACCESS_TOKEN": "seu-token-aqui"
      }
    }
  }
}
```

### Opção 2: Usar API do Figma diretamente

Se o MCP não estiver disponível, podemos usar a API do Figma diretamente:

```bash
npm install @figma/rest-api-sdk
```

## 📦 Como Usar

### 1. Extrair Logo do Figma

```typescript
import { exportFigmaAsset, FIGMA_NODES } from '@/utils/figmaMCP'

// Exportar logo como SVG
await exportFigmaAsset(
  FIGMA_NODES.LOGO,
  'svg',
  'public/logo-mycash.svg'
)
```

### 2. Consultar Dados de um Node

```typescript
import { fetchFigmaNodeData, FIGMA_NODES } from '@/utils/figmaMCP'

// Obter dados completos do node
const sidebarData = await fetchFigmaNodeData(FIGMA_NODES.SIDEBAR)
console.log(sidebarData)
```

### 3. Extrair Tokens de Design

```typescript
import { extractDesignTokens, FIGMA_NODES } from '@/utils/figmaMCP'

// Extrair todos os tokens de um componente
const tokens = await extractDesignTokens(FIGMA_NODES.SIDEBAR)
// Retorna: { colors, spacing, typography, radius, shadows }
```

## 🎯 Nodes Importantes

- **Logo**: `30-1549` - Logo do mycash+
- **Sidebar**: `30-1517` - Componente Sidebar completo
- **Dashboard**: `42-3096` - Página principal do dashboard

## 🔗 Links dos Nodes

- Logo: https://www.figma.com/design/XdjADyb9gBAGbk1vqa56r3/Workshop---Do-figma-MCP-ao-Cursor-AI-v.3--Community-?node-id=30-1549
- Sidebar: https://www.figma.com/design/XdjADyb9gBAGbk1vqa56r3/Workshop---Do-figma-MCP-ao-Cursor-AI-v.3--Community-?node-id=30-1517
- Dashboard: https://www.figma.com/design/XdjADyb9gBAGbk1vqa56r3/Workshop---Do-figma-MCP-ao-Cursor-AI-v.3--Community-?node-id=42-3096

## ⚠️ Nota Importante

Atualmente, o servidor MCP do Figma não está configurado. Para usar estas funções:

1. Configure o servidor MCP do Figma no Cursor
2. Ou use a API do Figma diretamente via `@figma/rest-api-sdk`
3. Ou exporte manualmente os assets do Figma

## 🚀 Próximos Passos

Quando o MCP estiver configurado, podemos:

1. ✅ Extrair logo automaticamente
2. ✅ Obter valores exatos de cores, espaçamentos, tipografia
3. ✅ Exportar todos os assets necessários
4. ✅ Sincronizar tokens do Figma com o código
