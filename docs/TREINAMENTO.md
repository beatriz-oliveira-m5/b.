# Como usar a plataforma da Agência B

Guia rápido de cada parte do sistema. Não precisa decorar nada — volta aqui
sempre que tiver dúvida.

---

## Entrando no sistema

Acesse o link do site (a URL da Vercel) e entre com seu email e senha. Se
esqueceu a senha, me avisa que eu resolvo direto no painel do Supabase.

---

## Calendário

É a tela principal — mostra todos os posts planejados de todos os clientes,
organizados por dia.

- Cada cor de bolinha é um cliente diferente.
- Clique em **"+ Novo post"** pra criar um post novo: escolhe o cliente, dá um
  título, marca em quais redes vai sair, escolhe a data e (se quiser) já
  escreve a legenda.
- Use as setas **← →** pra navegar entre os meses.
- Dá pra filtrar por um cliente só, usando o menu no topo.
- Clique em qualquer post pra abrir os detalhes dele.

---

## O fluxo de um post (workflow)

Todo post passa por 4 estágios, nessa ordem:

1. **Rascunho** — acabou de ser criado, ainda em construção.
2. **Em revisão** — pronto pra você (ou quem revisar) dar uma olhada.
3. **Aprovado** — já pode publicar. Assim que a data/hora chegar, ele aparece
   no aviso de lembrete (veja abaixo).
4. **Publicado** — você já postou na rede social e marcou como feito aqui.

Pra mudar o estágio, abre o post e clica no botão do estágio que quer (dentro
de **Calendário → clique no post**). Não tem aprovação de cliente aqui dentro
— é só pra organizar o fluxo interno da agência.

**Importante: o sistema NÃO publica nada sozinho.** Ele é um calendário +
lembrete. Quando chegar a hora, você mesma posta direto no Instagram, TikTok,
etc., e depois volta aqui pra marcar como "Publicado".

---

## Lembretes de publicação

Sempre que um post estiver **Aprovado** e a hora de publicar já tiver
chegado, aparece um aviso amarelo no topo de qualquer tela do sistema,
listando esses posts. É o sinal de "hora de postar".

---

## Tarefas

Lista de pendências por cliente — coisas que não são exatamente um post
(aprovar uma arte, ligar pro cliente, etc.). Adiciona uma tarefa, escolhe o
cliente e (se quiser) um prazo. Marca a caixinha quando terminar.

---

## Clientes

Cadastro simples: nome, cor (usada no calendário) e notas gerais. Clique num
cliente pra ver o resumo dele (tarefas pendentes, posts em andamento) e
acessar direto o calendário e os relatórios filtrados só daquele cliente.

---

## Gerar legenda com Inteligência Artificial

Dentro de qualquer post (Calendário → clique no post → seção "Gerar legenda
com IA"):

1. Escreve o tema do post (ex: "promoção de dia das mães").
2. Escolhe o tom de voz (descontraído, profissional, etc.).
3. Clica em **"Gerar legendas com IA"**.

A IA gera uma legenda adaptada pra cada rede que o post tem marcada (o texto
pro Instagram é diferente do texto pro LinkedIn, por exemplo — cada rede tem
seu próprio jeito). Clica em **"Usar esta legenda"** na que você gostar, e ela
já entra no campo de legenda do post. Pode gerar quantas vezes quiser até
achar uma boa.

---

## Redes sociais (conectar as contas dos clientes)

Aqui você conecta cada cliente com cada rede social (Instagram, Facebook,
TikTok, LinkedIn, YouTube).

Tem dois jeitos de conectar:

- **"Conectar com dados de teste"** — não depende de nada, funciona na hora.
  Serve pra testar o resto do sistema (relatórios, etc.) enquanto a aprovação
  de verdade não sai. Os números que aparecem são fictícios (marcados como
  "dados de teste" em laranja).
- **"Conectar de verdade"** — usa a conta real da rede social. Só funciona
  depois que a aprovação daquela plataforma sair (isso é um processo de dias
  a semanas em cada rede, feito por fora do sistema — pergunta pro seu marido
  se quiser entender os detalhes técnicos).

Depois de conectar (de qualquer um dos dois jeitos), clica em **"Sincronizar
métricas agora"** pra puxar os números mais recentes pros Relatórios.

---

## Relatórios

Mostra, por rede social, o alcance e a taxa de engajamento dos últimos 30
dias de cada cliente, comparado com uma média de mercado (benchmark).

Clique em **"Gerar insight"** pra IA escrever um resumo em português simples:
o que está indo bem, o que está abaixo da média, e uma sugestão prática do
que fazer a seguir.

Se aparecer a etiqueta laranja "dados de teste" num card, é porque aquele
cliente ainda está em modo mock naquela rede — os números não são reais
ainda.

---

## Ads (impulsionamento)

Só funciona hoje pra Instagram e Facebook (é a Meta Marketing API).

1. Clica em **"+ Nova campanha"**, escolhe o cliente, a rede, o objetivo e o
   orçamento.
2. Isso cria um **rascunho** da campanha.
3. Clica em **"Impulsionar"** pra ativar. Se o cliente estiver em modo
   "dados de teste", isso só simula (não gasta dinheiro nenhum, nem posta
   nada de verdade). Se estiver em modo real (com a conta de anúncios da
   Meta aprovada), aí sim ele cria a campanha de verdade no Gerenciador de
   Anúncios da Meta.

---

## Dúvidas

Qualquer coisa estranha na tela, chama o suporte técnico (seu marido) — ele
consegue ver os logs e resolver rapidinho. Este documento vai crescendo
conforme a gente for usando o sistema no dia a dia.
