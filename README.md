# Level Up - Inscrições

Site do curso de desenvolvimento de jogos no Roblox Studio.

Página estática responsiva com a identidade visual da Level Up Academy, apresentação curta do curso e pré-inscrição em uma etapa, integrada ao FormSubmit e WhatsApp.

O botão **Já sou aluno** abre o login em https://0srgood.github.io/levelup-academy-web/.

## Publicação

No GitHub, acesse Settings > Pages e selecione Deploy from a branch, branch main e pasta / (root).

## Conteúdo

Os arquivos ativos são `index.html`, `inscricoes-v3.css`, `inscricoes-v3.js` e a pasta `assets/`. Os novos nomes dos arquivos de estilo e script evitam misturar o HTML novo com arquivos antigos em cache. O arquivo `.nojekyll` desativa o processamento Jekyll. Não há etapa de build nem dependências para servir a página.

## Imagens

Veja `image-credits.txt`. O logotipo, o emblema e os mascotes vêm dos materiais da própria Level Up. A fotografia da apresentação é o quadro 16 do acervo enviado pelo responsável pelo site, recortado e tratado com ImageGen. O PNG transparente e o prompt estão documentados em `docs/professor-tallyson-prompt.md`. As imagens de exibição são otimizadas em WebP. As fontes DM Sans e Outfit são servidas localmente; a licença da Outfit acompanha os arquivos.

As imagens e os arquivos das versões anteriores foram preservados para compatibilidade com páginas em cache. A página atual apresenta o professor, cinco materiais com os respectivos mascotes e a captura real do laboratório em molduras de dispositivos. O formulário fica diretamente sobre o fundo da página, o cabeçalho é fixo e o guia Uppi pode ser recolhido. A barra de rolagem fica oculta sem desativar a rolagem.

## Formulário

As respostas são encaminhadas a goodvswins@gmail.com pelo FormSubmit. O recebimento depende da ativação do destinatário e da disponibilidade desse serviço. O botão de WhatsApp utiliza o número +55 84 99421-2725.

Para verificar o tratamento do formulário sem enviar dados para serviços externos: `node scripts/check-inscricoes.mjs`.

