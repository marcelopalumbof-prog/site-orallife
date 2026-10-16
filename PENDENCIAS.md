# Pendências — informações que faltam da clínica

Este site foi entregue **completo e funcional**. Os itens abaixo são os campos que
dependem de confirmação da clínica. Nada foi inventado: onde o dado não existe, o site
mostra um espaço reservado ou um texto honesto em vez de uma informação falsa.

Cada item indica **exatamente onde** editar.

---

## 🔴 Prioridade alta (aparece visivelmente no site)

### 1. Dias e horário de atendimento
Hoje o site mostra: **“Seg. a sex. — atendimento até as 17h”** (o único dado confirmado
foi “fecha às 17:00”).

- **`index.html`** → seção Contato, item “Horário de atendimento”
  *(procure por `COMPLETAR: confirmar os dias`)*
- **`index.html`** → rodapé, coluna Contato (`<span>Seg. a sex. — até as 17h</span>`)
- **`index.html`** → JSON-LD, no fim do arquivo: adicionar o campo `openingHours`
  depois de confirmar (ex.: `"openingHours": "Mo-Fr 08:00-17:00"`)

### 2. Nomes dos planos odontológicos (opcional)
✅ **Especialidades já publicadas** na seção Convênios, exatamente como enviado:
**Facetas · Próteses · Implantes · Ortodontia · Endodontia · Periodontia · Atendimento Infantil.**

⏳ Falta apenas a lista de **nomes de planos/operadoras** (ex.: OdontoPrev, Amil Dental,
Bradesco Dental…), caso a clínica queira exibir quais convênios aceita. Como nenhum nome
foi informado, essa parte está **oculta** — nada foi inventado.

Para ativar, abra **`assets/js/main.js`** e preencha o array:

```js
var CONVENIOS = [
  'Nome do plano 1',
  'Nome do plano 2',
];
```

Ao preencher, o título “Planos odontológicos atendidos” e os cartões aparecem
automaticamente. A grade se ajusta sozinha, então pode colar todos os planos.

> ℹ️ Observação: a lista que você enviou (Facetas, Próteses, Implantes, Ortodontia,
> Endodontia, Periodontia e Atendimento Infantil) descreve **especialidades e serviços**,
> não operadoras de plano de saúde. Por isso, ela foi publicada com o rótulo correto —
> “Especialidades atendidas” — dentro da seção Convênios. Se algum desses nomes for, na
> verdade, uma operadora, é só avisar.

### 3. Equipe (nomes, CRO, especialidades e fotos)
Os 3 cartões da seção **Equipe** estão com espaço reservado: `[Nome do profissional]`,
`[CRO-BA 00.000]` e `[Especialidade]`.

- **`index.html`** → seção `id="equipe"`. Cada cartão tem um comentário explicando
  como trocar o placeholder `person__placeholder` por
  `<img src="assets/img/equipe-01.jpg" alt="Foto de [nome]">`.
- **Fotos**: salve em `assets/img/` como `equipe-01.jpg`, `equipe-02.jpg`, `equipe-03.jpg`
  (ver `assets/img/LEIA-ME.txt`).

### 4. Responsável técnico + CRO
Aparece em dois lugares, ambos com placeholder `[Nome do profissional] — [CRO-BA 00.000]`:

- **`index.html`** → rodapé, bloco `.footer__legal`
- **`index.html`** → JSON-LD (campo `founder`, ainda não incluído — pode ser adicionado)

> Obrigatório por normas do CFO: nome e CRO do responsável técnico visíveis no site.

### 5. Fotos reais da clínica ✅
As fotos reais já foram aplicadas ao site (convertidas para JPG no tamanho certo para web,
~150–210 KB cada). Não é preciso fazer nada.

| Arquivo | Foto | Onde aparece |
|---|---|---|
| `hero-consultorio.jpg` | ⚠️ imagem de banco (consultório moderno) | Topo do site — ver observação abaixo |
| `agendar-consultorio.jpg` | Sala de atendimento com o logo na parede | “Como agendar” |
| `etapa-avaliacao.jpg` | Consultório com cadeira e equipamentos | Etapa 1 · Avaliação |
| `etapa-diagnostico.jpg` | Procedimento odontológico | Etapa 2 · Diagnóstico |
| `etapa-plano.jpg` | Dentista explicando o plano à paciente | Etapa 3 · Plano |
| `sorriso-paciente.jpg` | Paciente sorrindo | Depoimentos |
| `cta-paciente.jpg` | Paciente saindo sorrindo | Bloco “Pronto para cuidar do seu sorriso?” |
| `convenios-recepcao.jpg` | Recepção da clínica | Seção Convênios |

> 📌 **Ajustes pedidos pela clínica (já feitos):**
> - O **logo em imagem foi removido** — a marca no site é só a escrita (“Oral Life” +
>   “Odontologia Especializada”) na navbar, no menu mobile e no rodapé. O arquivo oficial
>   continua guardado em `Criação de Site\Oral life 01\public\images\logo-oral-life.png`.
> - A **foto do topo voltou a ser a imagem de consultório** (a foto do paciente foi
>   removida). É a única imagem de banco que ainda está em uso: quando quiser colocar uma
>   foto real no topo, basta salvar uma foto horizontal (mín. 1920px) como
>   `assets/img/hero-consultorio.jpg`.

⏳ Ainda falta: **fotos da equipe** (`equipe-01/02/03.jpg`, retratos 4:5). Até chegarem, a
seção Equipe segue com espaço reservado.

Para trocar qualquer foto por uma versão melhor: salve o arquivo novo em `assets/img/`
**com o mesmo nome** e recarregue com Ctrl+F5. Detalhes em `assets/img/LEIA-ME.txt`.

> ⚠️ **Direito de imagem (exigência do CFO):** as fotos `sorriso-paciente` e `cta-paciente`
> mostram pacientes identificáveis. É necessário ter a **autorização de uso de imagem
> assinada** por cada um deles. Guarde os documentos. Se não houver autorização,
> substitua por fotos sem pessoas identificáveis.

---

## 🟡 Prioridade média

### 6. Links das redes sociais
✅ **Instagram já configurado:** https://www.instagram.com/orallife3/ (ícone no rodapé e
no JSON-LD, para o Google associar o perfil à clínica).

⏳ **Facebook:** como o link não foi informado, o botão foi **removido** para não deixar
um link morto no site. Se a clínica tiver Facebook, envie o endereço que o botão volta em
um minuto (há um comentário no `index.html`, bloco `.footer__social`, mostrando como).

### 7. Domínio real
Canonical, Open Graph e JSON-LD usam `https://www.clinicaorallife.com.br/` como
**exemplo**. Troque pelo domínio real (ex.: `https://orallifeodonto.com.br/`):

- **`index.html`** → `<link rel="canonical">`, `og:url`, `og:image` e JSON-LD
  *(há um comentário `SUBSTITUIR:` no topo)*

### 8. Link da página do Google (avaliações)
O botão “Ver todas as avaliações” usa uma busca pelo nome da clínica. Para ir direto à
página com as 71 avaliações, pegue o link no Google Meu Negócio e substitua o `href` do
botão em **`index.html`** → seção Depoimentos.

### 9. E-mail de contato
Não foi informado. Não incluído no site nem no JSON-LD. Se quiser publicar, adicione em
`index.html` na seção Contato e no JSON-LD.

### 10. Ajuste das descrições “O que inclui”
Os textos de cada card de tratamento foram escritos a partir da lista de procedimentos
informada. Revise se cada lista corresponde à rotina real da clínica:

- **`index.html`** → seção `id="tratamentos"`, blocos `.disclosure__panel`

---

## 🟢 Recomendado (técnico, não é conteúdo)

| Item | Por quê | Onde |
|---|---|---|
| Converter imagens para WebP/AVIF | -60% de peso, mesma qualidade | `assets/img/` |
| Adicionar Google Analytics / Meta Pixel | medir origem dos agendamentos | antes de `</body>` |
| Configurar `sitemap.xml` | indexação completa no Google (o `robots.txt` já está pronto) | raiz do site |
| Criar `favicon.ico` 32×32 | navegadores antigos | raiz do site |
| Cadastrar no Google Meu Negócio com o novo site | SEO local (São Cristóvão) | Google |
| Confirmar se há estacionamento no prédio | se sim, dá para dizer no texto | seção Contato |

---

## ✅ Já está pronto

- Todas as seções, CTAs e links de WhatsApp funcionando
- Todos os CTAs de agendamento apontam para `(71) 99726-6122`
- **Fotos reais da clínica aplicadas em 7 pontos do site** (etapas, depoimentos,
  convênios e bloco final)
- **Marca só com a escrita** (“Oral Life” + “Odontologia Especializada”) na navbar,
  no menu mobile e no rodapé — logo em imagem removido, conforme pedido
- **Instagram oficial (@orallife3) linkado** no rodapé e no JSON-LD
- Telefone fixo `(71) 3377-0606` com links `tel:` clicáveis
- Endereço completo em 3 lugares + mapa incorporado + botão “Como chegar”
- **Especialidades publicadas na seção Convênios:** Facetas, Próteses, Implantes,
  Ortodontia, Endodontia, Periodontia e Atendimento Infantil
- Nota 4,4 e “71 avaliações no Google” + os 2 depoimentos reais
- Mini formulário “Prefere que a gente chame você?” abrindo o WhatsApp
- Botão flutuante de WhatsApp em todas as telas
- SEO local (título, descrição, Open Graph e JSON-LD tipo `Dentist`)
- Acessibilidade: Lighthouse **100/100**, navegação por teclado, foco visível
- Responsivo de 320px a 1440px+, sem rolagem horizontal
- Aviso legal conforme o Código de Ética Odontológica (CFO)

> Nenhum preço foi publicado (os cards mostram “Sob avaliação”), nenhum nome de
> profissional foi inventado e nenhuma promessa de resultado foi escrita —
> tudo conforme as normas de publicidade do CFO.
