"use client";

import { useMemo, useState } from "react";

const journey = [
  {
    id: "token",
    icon: "01",
    name: "切成 Token",
    eyebrow: "Tokenizer / Token",
    text: "先把一句话切成电脑能处理的小积木。每一块叫 Token；Tokenizer 就是负责切块的规则。",
    note: "真实模型不一定按汉字切，也可能按词或词的一部分切。这里用词块来帮助理解。",
  },
  {
    id: "attention",
    icon: "02",
    name: "看看谁重要",
    eyebrow: "Attention",
    text: "每个 Token 都会问：理解我时，句子里的其他词谁最值得参考？答案是一组会加总为 100% 的注意力分数。",
    note: "不是删除不重要的词，而是临时把更多注意力放在有关的词上。",
  },
  {
    id: "heads",
    icon: "03",
    name: "从多角度看",
    eyebrow: "Multi-head Attention",
    text: "多头注意力像几位观察员同时读同一句话：有人留意主语，有人留意动作，有人留意位置或语气。",
    note: "每个“头”有自己的关注方式，最后把它们的发现合并起来。",
  },
  {
    id: "ffn",
    icon: "04",
    name: "独立想一想",
    eyebrow: "Feed-Forward Network",
    text: "收集完上下文后，每个 Token 再经过同一套小型全连接网络，整理并提炼自己获得的新信息。",
    note: "它不会再看整句话；“互相交流”主要发生在注意力层。",
  },
  {
    id: "output",
    icon: "05",
    name: "猜下一个词",
    eyebrow: "Prediction",
    text: "很多层重复后，模型会给所有候选 Token 打分，选出最合适的一个，接着继续生成下一个。",
    note: "训练的目标，就是让正确答案的分数越来越高。",
  },
];

const tokenSamples = ["小猫", "追着", "球", "跑"];

const headViews = [
  { name: "头 1 · 谁在做事", color: "cyan", weights: [0.62, 0.16, 0.12, 0.1], sentence: "更关注「小猫」：谁是动作的主体？" },
  { name: "头 2 · 做了什么", color: "violet", weights: [0.12, 0.64, 0.14, 0.1], sentence: "更关注「追着」：动作是什么？" },
  { name: "头 3 · 对象是谁", color: "orange", weights: [0.08, 0.16, 0.66, 0.1], sentence: "更关注「球」：动作指向哪里？" },
  { name: "头 4 · 句子节奏", color: "lime", weights: [0.22, 0.2, 0.2, 0.38], sentence: "更关注「跑」：句子如何收束？" },
];

const dataSets = {
  train: {
    label: "训练集",
    percent: "80%",
    title: "模型用它认真做题",
    text: "模型一遍遍查看训练集，比较自己的预测和标准答案，再调整内部参数。它会“见过”这些题。",
  },
  validation: {
    label: "验证集",
    percent: "10%",
    title: "开发时的模拟考试",
    text: "人们用它挑选学习率、层数等设置，并观察模型有没有开始死记硬背训练题。模型不直接拿它更新参数。",
  },
  test: {
    label: "测试集",
    percent: "10%",
    title: "最后才打开的盲盒",
    text: "在模型和所有设置都确定后才评估。它代表真正没见过的新题，最能说明模型能否举一反三。",
  },
};

const blueprintModules = [
  {
    id: "input",
    lane: "编码器入口",
    title: "Input Embedding + Positional Encoding",
    short: "把输入词变成“有位置的向量”",
    detail: "Input Embedding 会把每个输入 Token 的编号查成一个可训练的高维向量；它不是词典释义，而是一组会在训练中不断调整的数字。接着，Positional Encoding 与这个向量逐元素相加，让模型知道“谁在第 1 个位置、谁在第 2 个位置”。因为注意力一次能看整句，天然没有先后顺序；没有位置编码，“我打你”和“你打我”会像同一袋词。",
    takeaway: "入口产物不是文字，而是：语义线索 + 位置线索。",
    color: "peach",
  },
  {
    id: "encoder-attn",
    lane: "编码器 N×",
    title: "Multi-Head Self-Attention",
    short: "输入中的每个词都能互相看见",
    detail: "Self-Attention 的“self”表示 Q、K、V 全都来自同一段输入。每个 Token 先各自生成 Query（我正在找什么）、Key（我能被怎样匹配）和 Value（我的实际信息）。用 Q·K 的相似度得到分数，除以 √dₖ 稳定数值，再经 Softmax 变成权重；最后用权重对所有 V 加权求和。Multi-Head 把这个过程并行做多次，使不同头可分别学习主谓关系、指代、距离或语义搭配。",
    takeaway: "编码器读的是完整输入，所以这里不需要遮住未来词。",
    color: "cyan",
  },
  {
    id: "addnorm-one",
    lane: "编码器 N×",
    title: "Add & Norm（残差连接 + LayerNorm）",
    short: "保留原信息，再把数值拉回稳定范围",
    detail: "图中绕过子层的弧线就是残差连接：输出 = x + Sublayer(x)。它让原始信息能直接向后流，也让很深的网络更容易训练；若新子层暂时学得不好，模型仍保留 x。随后 Layer Normalization 会在每个 Token 自己的特征维度上做标准化，再用可训练的缩放与平移恢复合适尺度。它不是把不同样本混在一起算，因此在变长序列和小批量中很稳。",
    takeaway: "Add 解决“信息与梯度怎么走”，Norm 解决“数值怎么稳定”。",
    color: "violet",
  },
  {
    id: "ffn-deep",
    lane: "编码器 N×",
    title: "Feed Forward Network（逐 Token 全连接层）",
    short: "交流后，每个词单独进行非线性加工",
    detail: "注意力负责跨 Token 汇集信息；FFN 不再让 Token 彼此通信，而是对每个位置使用同一套两层全连接网络，例如 FFN(x) = W₂ · σ(W₁x + b₁) + b₂。中间层通常先扩宽维度、经过 GELU 或 ReLU 等激活函数，再压回模型维度。非线性很重要：没有它，多层线性变换仍可合并成一层，表达能力不会真正增加。FFN 后还会再经过一次 Add & Norm。",
    takeaway: "Attention 负责“交流”，FFN 负责“思考与提炼”。",
    color: "lime",
  },
  {
    id: "decoder-input",
    lane: "解码器入口",
    title: "Outputs (shifted right) + Output Embedding",
    short: "训练时把正确答案右移一格，作为提示",
    detail: "假设目标答案是“我 爱 学习”。解码器训练时收到的是 <BOS>、我、爱；它要依次预测 我、爱、学习。这个“右移一位”叫 shifted right，<BOS> 是开始标记。它让模型始终根据已经给出的前缀来猜下一个 Token。输出 Token 同样先做 Output Embedding，再加位置编码；输入和输出的词表或嵌入有时会共享参数，但并非必须。",
    takeaway: "训练时能一次并行算整句，但每个位置只被允许使用左边的答案。",
    color: "peach",
  },
  {
    id: "masked-attn",
    lane: "解码器 N×",
    title: "Masked Multi-Head Self-Attention",
    short: "只看过去，不偷看未来答案",
    detail: "这是解码器第一层注意力。它仍是 Self-Attention，但在分数矩阵的右上角加上 −∞ 的因果遮罩（causal mask）。Softmax 之后这些位置的权重变成 0，于是第 t 个位置只能关注 1…t 位置。训练时如果让“爱”直接看到后面的“学习”，训练分数会虚高，真实生成时却拿不到这些信息；遮罩正是为了避免这种信息泄漏。其后同样有 Add & Norm。",
    takeaway: "Masked 的含义不是删除词，而是把“不该看的连接”权重强制归零。",
    color: "coral",
  },
  {
    id: "cross-attn",
    lane: "解码器 N×",
    title: "Encoder–Decoder Attention（交叉注意力）",
    short: "解码器带着问题，回头查询输入内容",
    detail: "图里第二个 Multi-Head Attention 的 Q 来自解码器刚处理过的表示；K 和 V 来自编码器最终输出。因此它也叫 Cross-Attention：解码器在生成当前 Token 时，可以从源句中挑最相关的信息。翻译“猫在睡觉”到英文时，生成 cat、is、sleeping 的每一步都会以不同权重回看中文输入。这里不遮住编码器序列，因为整个输入在生成前已完整给出。之后仍会接 Add & Norm、FFN、Add & Norm。",
    takeaway: "编码器负责把输入读透；交叉注意力负责在生成时“查阅这份读书笔记”。",
    color: "gold",
  },
  {
    id: "head",
    lane: "输出头",
    title: "Linear → Softmax → Output Probabilities",
    short: "把最后状态变成词表中每个 Token 的概率",
    detail: "解码器最后一个向量的长度是 d_model，但候选 Token 可能有几万甚至几十万。Linear 层把 d_model 投影到词表大小，得到每个候选 Token 的原始分数（logits）。Softmax 把全部 logits 转成总和为 1 的概率分布；概率最高的可以直接选，也可用 temperature、top-k、top-p 等采样策略增加多样性。推理时选出的 Token 会追加到输入，再生成下一个，直到遇到 <EOS> 或达到长度上限。",
    takeaway: "Softmax 输出的是一整张候选表，不是模型“唯一确定”的答案。",
    color: "violet",
  },
];

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedToken, setSelectedToken] = useState(2);
  const [head, setHead] = useState(0);
  const [dataset, setDataset] = useState<keyof typeof dataSets>("train");
  const [blueprint, setBlueprint] = useState(0);
  const currentStep = journey[activeStep];
  const currentHead = headViews[head];
  const selectedDataset = dataSets[dataset];
  const currentBlueprint = blueprintModules[blueprint];
  const tokenDescription = useMemo(
    () => `「${tokenSamples[selectedToken]}」现在是一个 Token。模型会把它变成一串数字（向量），方便后续计算。`,
    [selectedToken],
  );

  return (
    <main className="study-map">
      <nav className="topbar" aria-label="页面导航">
        <a className="brand" href="#top"><span>✦</span> Transformer 一图懂</a>
        <div className="nav-links">
          <a href="/">精细复习</a>
          <a href="/learn">全部专题</a>
          <a href="#architecture">架构地图</a>
          <a href="#attention">注意力实验</a>
          <a href="#training">数据集</a>
        </div>
        <a className="nav-cta" href="#try">从一句话开始 <span>↓</span></a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse" /> 给第一次接触 Transformer 的你</div>
          <h1>把一句话，<br /><em>读懂得更有联系。</em></h1>
          <p>Transformer 不像人一样理解语言；它靠一层层“关注、交流、整理”的计算，从大量例子中学会预测下一个 Token。</p>
          <div className="hero-actions">
            <a href="#architecture" className="button primary">进入架构地图 <span>→</span></a>
            <a href="#attention" className="button quiet">先看注意力怎么做</a>
          </div>
          <div className="legend-row" aria-label="颜色图例">
            <span><i className="dot token" />输入 Token</span>
            <span><i className="dot attention" />关注与交流</span>
            <span><i className="dot ffn" />独立加工</span>
          </div>
        </div>

        <div className="hero-map" aria-label="Transformer 数据流程预览">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="stars">✦　·　✧</div>
          <div className="map-caption"><span>一条句子的旅程</span><b>从文字到预测</b></div>
          <div className="flow-visual">
            <div className="mini-node mini-tokens"><small>输入</small><div><b>小猫</b><b>追着</b><b>球</b></div></div>
            <div className="flow-line" />
            <div className="mini-node mini-attn"><small>Attention</small><strong>×<sup>4</sup></strong><div className="matrix">▦</div></div>
            <div className="flow-line" />
            <div className="mini-node mini-ffn"><small>FFN</small><strong>⋮⋮⋮</strong></div>
            <div className="flow-line short" />
            <div className="mini-output">?</div>
          </div>
          <div className="map-badges"><span>并行视角</span><span>逐层加深</span><span>预测下一个</span></div>
        </div>
      </section>

      <section className="intro-strip">
        <span className="strip-mark">01</span>
        <p><b>先记住一个画面：</b>像一群同学读同一篇短文。注意力层让大家互相交换线索；全连接层让每个人安静地整理自己的笔记。</p>
        <a href="#try">试试看 <span>↓</span></a>
      </section>

      <section className="section architecture" id="architecture">
        <div className="section-heading">
          <div><span className="section-kicker">架构地图</span><h2>Transformer 的一层，<br />到底做了什么？</h2></div>
          <p>点击任一步，沿着 <b>“小猫追着球跑”</b> 的旅程看它如何从原始文字变成下一步预测。</p>
        </div>

        <div className="journey-grid">
          <div className="journey-rail" role="tablist" aria-label="Transformer 处理步骤">
            {journey.map((item, index) => (
              <button key={item.id} role="tab" aria-selected={activeStep === index} className={activeStep === index ? "journey-step active" : "journey-step"} onClick={() => setActiveStep(index)}>
                <span className="step-number">{item.icon}</span><span>{item.name}</span><i>→</i>
              </button>
            ))}
          </div>

          <article className={`step-card step-${currentStep.id}`}>
            <div className="step-card-top"><span>{currentStep.eyebrow}</span><b>第 {currentStep.icon} 步</b></div>
            <h3>{currentStep.name}</h3><p>{currentStep.text}</p>
            <div className="step-illustration" aria-hidden="true">
              {currentStep.id === "token" && <><span>小猫</span><span>追着</span><span>球</span><span>跑</span></>}
              {currentStep.id === "attention" && <><div className="attn-grid"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="attn-arrow">关注分数<br />0–100%</div></>}
              {currentStep.id === "heads" && <><div className="head-pill">主体</div><div className="head-pill">动作</div><div className="head-pill">对象</div><div className="head-pill">位置</div></>}
              {currentStep.id === "ffn" && <><div className="neuron-row"><i /><i /><i /></div><span className="arrow-symbol">→</span><div className="neuron-row strong"><i /><i /><i /></div></>}
              {currentStep.id === "output" && <><div className="choice muted">睡觉　12%</div><div className="choice selected">玩耍　71%</div><div className="choice muted">吃饭　17%</div></>}
            </div>
            <div className="beginner-note"><span>给小白的翻译</span><p>{currentStep.note}</p></div>
          </article>
        </div>
      </section>

      <section className="section deep-architecture" id="full-architecture">
        <div className="deep-heading">
          <div><span className="section-kicker">对照原图 · 完整拆解</span><h2>这不是一条流水线，<br />而是<strong>两支协作的队伍。</strong></h2></div>
          <p><b>Encoder（编码器）</b>把输入读成一份上下文笔记；<b>Decoder（解码器）</b>依据已生成的前缀与这份笔记，一个 Token 一个 Token 地写出答案。点击图中任一模块，查看它的输入、计算和作用。</p>
        </div>

        <div className="architecture-map" aria-label="Transformer Encoder Decoder 完整架构图">
          <div className="arch-column encoder-column">
            <div className="arch-column-title"><span>Encoder</span><small>理解输入 · N× 重复</small></div>
            <button className="arch-block embed peach" onClick={() => setBlueprint(0)}><b>Input Embedding</b><small>输入 Token → 向量</small></button>
            <button className="arch-addon" onClick={() => setBlueprint(0)}>＋ Positional Encoding</button>
            <div className="arch-stack"><span className="repeat-mark">N×</span><button className="arch-block cyan" onClick={() => setBlueprint(1)}><b>Multi-Head<br />Self-Attention</b><small>Q / K / V 都来自输入</small></button><button className="arch-block norm" onClick={() => setBlueprint(2)}><b>Add &amp; Norm</b><small>残差 + LayerNorm</small></button><button className="arch-block lime" onClick={() => setBlueprint(3)}><b>Feed Forward</b><small>逐 Token 的非线性网络</small></button><button className="arch-block norm" onClick={() => setBlueprint(2)}><b>Add &amp; Norm</b><small>再一次稳定信息流</small></button></div>
            <div className="arch-output">Encoder memory<br /><small>供解码器查询的上下文</small></div>
          </div>

          <div className="cross-bridge"><span>编码器输出</span><i>→</i><b>供交叉注意力读取</b></div>

          <div className="arch-column decoder-column">
            <div className="arch-column-title"><span>Decoder</span><small>生成答案 · N× 重复</small></div>
            <button className="arch-block embed peach" onClick={() => setBlueprint(4)}><b>Output Embedding</b><small>已生成的 Token（右移）</small></button>
            <button className="arch-addon" onClick={() => setBlueprint(4)}>＋ Positional Encoding</button>
            <div className="arch-stack decoder-stack"><span className="repeat-mark">N×</span><button className="arch-block coral" onClick={() => setBlueprint(5)}><b>Masked Multi-Head<br />Self-Attention</b><small>只能看自己左边</small></button><button className="arch-block norm" onClick={() => setBlueprint(2)}><b>Add &amp; Norm</b><small>残差 + LayerNorm</small></button><button className="arch-block gold" onClick={() => setBlueprint(6)}><b>Encoder–Decoder<br />Attention</b><small>Q 来自 Decoder；K/V 来自 Encoder</small></button><button className="arch-block norm" onClick={() => setBlueprint(2)}><b>Add &amp; Norm</b><small>残差 + LayerNorm</small></button><button className="arch-block lime" onClick={() => setBlueprint(3)}><b>Feed Forward</b><small>逐 Token 的非线性网络</small></button><button className="arch-block norm" onClick={() => setBlueprint(2)}><b>Add &amp; Norm</b><small>残差 + LayerNorm</small></button></div>
            <button className="arch-head" onClick={() => setBlueprint(7)}><span>Linear</span><i>→</i><span>Softmax</span><i>→</i><b>Output probabilities</b></button>
          </div>
        </div>

        <div className={`blueprint-explainer ${currentBlueprint.color}`}>
          <div className="blueprint-tabs" role="tablist" aria-label="Transformer 完整架构模块">
            {blueprintModules.map((module, index) => <button key={module.id} role="tab" aria-selected={blueprint === index} className={blueprint === index ? "active" : ""} onClick={() => setBlueprint(index)}><small>{module.lane}</small>{module.title}</button>)}
          </div>
          <article className="blueprint-detail">
            <div className="blueprint-label"><span>{currentBlueprint.lane}</span><b>模块 {String(blueprint + 1).padStart(2, "0")}</b></div>
            <h3>{currentBlueprint.title}</h3><h4>{currentBlueprint.short}</h4><p>{currentBlueprint.detail}</p>
            <div className="takeaway"><span>一句话抓重点</span><b>{currentBlueprint.takeaway}</b></div>
          </article>
        </div>

        <div className="deep-notes">
          <article><span>01 · N× 到底是什么？</span><h3>不是同一层来回执行，而是堆叠 N 个<strong>各有参数</strong>的层。</h3><p>图里的 N× 表示编码器块和解码器块会重复多次。第 1 层常学局部、表面的关联；更深层可以组合成更抽象的语义。层数 N、隐藏维度 d_model、注意力头数 h 都是超参数。原始 Transformer 使用 6 层编码器和 6 层解码器；现代模型的规模可能大得多。</p></article>
          <article><span>02 · 训练和生成为何不同？</span><h3>训练可以并行；真实回答必须<strong>自回归</strong>地逐个生成。</h3><p>训练时，正确目标序列已经在手中，右移后可一次送入解码器；因果遮罩保证每个位置只用过去信息。这种做法叫 teacher forcing。推理时未来 Token 不存在，模型只能先预测一个、把它接回去、再预测下一个，所以回答越长，生成步骤越多。</p></article>
          <article><span>03 · 经典图与现代 LLM</span><h3>这张图是完整 Encoder–Decoder Transformer；聊天模型通常只保留<strong>Decoder</strong>。</h3><p>机器翻译、摘要等“读一段再写一段”的任务很适合完整结构。GPT 类语言模型多为 Decoder-only：提示词直接作为左侧上下文，用掩码自注意力持续预测下一个 Token。BERT 类理解模型多为 Encoder-only：让 Token 双向互看，擅长表征和分类。</p></article>
        </div>
      </section>

      <section className="section tokenizer-section" id="try">
        <div className="tokenizer-panel">
          <div className="section-kicker">动手试试看</div><h2>Tokenizer：把文字<br />变成可计算的小积木。</h2>
          <p>模型不直接看到“句子”。它先用 <b>Tokenizer</b> 切分文字，再给每个 <b>Token</b> 贴上数字编号，最后换成一串数字向量。</p>
          <div className="token-explainer"><span>一句话</span><b>→</b><span>Tokens</span><b>→</b><span>数字向量</span></div>
        </div>
        <div className="token-lab">
          <div className="lab-header"><span>小实验</span><small>点击词块</small></div>
          <div className="sentence-box">小猫追着球跑</div>
          <div className="token-row" role="list" aria-label="Token 示例">
            {tokenSamples.map((token, index) => <button key={token} className={selectedToken === index ? "token-chip active" : "token-chip"} onClick={() => setSelectedToken(index)}>{token}<small>#{101 + index * 38}</small></button>)}
          </div>
          <div className="lab-result"><span className="result-icon">⌁</span><p>{tokenDescription}</p></div>
          <p className="microcopy">不同模型的切法会不同；Token 是“模型阅读语言的基本单位”。</p>
        </div>
      </section>

      <section className="section attention-section" id="attention">
        <div className="attention-title"><span className="section-kicker">核心机制</span><h2>注意力不是“记住”，<br />而是<strong>此刻该看谁。</strong></h2><p>阅读某个 Token 时，模型会把对其他 Token 的关注程度变成分数。下面把“跑”当作正在理解的词。</p></div>
        <div className="attention-lab">
          <div className="query-card"><span>正在理解</span><b>跑</b><small>Query：我现在需要什么线索？</small></div>
          <div className="attention-links" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="weight-list">
            {[["小猫", "主体", 62], ["追着", "动作关系", 20], ["球", "对象", 13], ["跑", "自己", 5]].map(([word, reason, weight]) => <div className="weight-row" key={String(word)}><div className="weight-label"><b>{word}</b><span>{reason}</span></div><div className="weight-track"><i style={{ width: `${weight}%` }} /></div><strong>{weight}%</strong></div>)}
          </div>
          <div className="value-card"><span>收集结果</span><b>“小猫”最关键</b><p>加权汇总后，“跑”获得了带着上下文的新表示。</p></div>
        </div>
        <div className="qkv-guide"><div><span>Q · Query</span><p>我现在想找什么？</p></div><i>×</i><div><span>K · Key</span><p>你能提供什么线索？</p></div><i>→</i><div><span>V · Value</span><p>把有用信息拿回来。</p></div></div>
      </section>

      <section className="section heads-section">
        <div className="section-heading heads-heading"><div><span className="section-kicker">Attention Layer</span><h2>一个注意力层，<br />为何要有多个头？</h2></div><p>因为一句话有不止一种关系。多个头并行计算，再把不同观察角度合并，信息会更丰富。</p></div>
        <div className="heads-workbench">
          <div className="head-tabs" role="tablist" aria-label="不同注意力头">
            {headViews.map((item, index) => <button key={item.name} className={head === index ? `head-tab active ${item.color}` : `head-tab ${item.color}`} onClick={() => setHead(index)}>{item.name}</button>)}
          </div>
          <div className="head-view">
            <div className="head-view-copy"><span className={`color-tag ${currentHead.color}`}>并行视角 {head + 1}</span><h3>{currentHead.sentence}</h3><p>同一句话，经由不同参数的注意力头，会得出不同的“谁更重要”。这不是人工指定的，而是模型从训练数据里学到的。</p><div className="combine-note">4 个头的结果 <b>拼接 + 混合</b> → 送给下一层</div></div>
            <div className="head-bars">{tokenSamples.map((word, index) => <div key={word}><span>{word}</span><i><b style={{ height: `${currentHead.weights[index] * 100}%` }} /></i><small>{Math.round(currentHead.weights[index] * 100)}%</small></div>)}</div>
          </div>
        </div>
      </section>

      <section className="section ffn-section">
        <div className="ffn-copy"><span className="section-kicker">Full-connect / FFN</span><h2>交流之后，<br />再各自<strong>消化一下。</strong></h2><p><b>全连接层（Feed-Forward Network）</b>会用同一套小网络，分别处理每一个 Token。它负责把注意力带回来的线索重新组合、筛选和转换。</p><div className="ffn-compare"><div><i>Attention</i><span>Token 之间<br />交换信息</span></div><b>＋</b><div><i>FFN</i><span>每个 Token<br />独立加工</span></div></div></div>
        <div className="ffn-visual"><div className="ffn-label input-label">“跑”的新向量</div><div className="node-columns"><div className="node-column">{[1,2,3].map(n => <i key={n} />)}</div><div className="connections" aria-hidden="true">╲╱╲<br />╱╲╱</div><div className="node-column middle">{[1,2,3,4].map(n => <i key={n} />)}</div><div className="connections" aria-hidden="true">╲╱╲<br />╱╲╱</div><div className="node-column output">{[1,2,3].map(n => <i key={n} />)}</div></div><div className="ffn-label">更有用的“跑”</div><span className="activation">扩展 → 激活 → 压缩</span></div>
      </section>

      <section className="section training-section" id="training">
        <div className="training-intro"><span className="section-kicker">模型怎样学习</span><h2>同一份数据，<br />三种不同的职责。</h2><p>把它想成备考：练习题、模拟考试、最终闭卷考，不能混在一起用。</p></div>
        <div className="dataset-console">
          <div className="dataset-bar" aria-label="数据集比例">
            {(Object.entries(dataSets) as [keyof typeof dataSets, typeof dataSets[keyof typeof dataSets]][]).map(([key, item]) => <button key={key} className={dataset === key ? `dataset-segment ${key} active` : `dataset-segment ${key}`} style={{ flexGrow: Number(item.percent.replace("%", "")) }} onClick={() => setDataset(key)}><b>{item.percent}</b><span>{item.label}</span></button>)}
          </div>
          <div className="dataset-detail"><div><span className={`dataset-badge ${dataset}`}>{selectedDataset.percent}</span><h3>{selectedDataset.label} · {selectedDataset.title}</h3></div><p>{selectedDataset.text}</p></div>
          <div className="exam-flow"><span>大量样本</span><i>→</i><span>训练并调整</span><i>→</i><span>验证设置</span><i>→</i><span>最后测试</span></div>
        </div>
      </section>

      <section className="recap">
        <div><span className="section-kicker">最后复盘</span><h2>现在，你已经<br />能读懂这张地图了。</h2></div>
        <div className="recap-list"><p><b>Token</b> 是模型阅读文字的小单位；<b>Tokenizer</b> 负责切分。</p><p><b>注意力层</b>让 Token 互相参考；<b>多头</b>让模型并行看多种关系。</p><p><b>全连接层</b>让每个 Token 整理所得线索；三种数据集则让学习与评估各司其职。</p></div>
      </section>

      <footer><span>Transformer 一图懂</span><p>一个面向初学者的交互式概念地图 · 从好奇开始理解 AI</p><a href="#top">回到顶部 ↑</a></footer>
    </main>
  );
}
