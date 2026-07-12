import DeepLesson from "../components/DeepLesson";

export const metadata = { title: "GPT 架构详解｜AI 架构实验室", description: "从 Decoder-only Transformer 到预训练、对齐与生成。" };

export default function GptPage() {
  return <DeepLesson
    slug="gpt" code="GPT" label="生成式预训练 Transformer"
    title="不断猜下一个 Token，学会生成整段语言。"
    subtitle="GPT 是 Decoder-only Transformer。它把文本概率拆成一连串“给定左侧上下文，预测下一个 Token”的任务；从海量语料中预训练后，再通过指令微调与偏好对齐，变成能对话、写作和推理的模型。"
    analogy="像一位读了大量文本的续写者：每写一个词，就把刚写的内容加入上下文，再决定下一个词。"
    accent="violet"
    steps={[
      { label: "Tokenizer", title: "Subword tokenization", summary: "文字先被切成模型词表中的离散编号。", detail: "GPT 常用 BPE、byte-level BPE 或类似子词算法。常见词可能是一个 Token，生僻词会拆成多块，空格和标点也可能参与编码。Token 数决定上下文占用和推理成本，不等同于字数或词数。", input: "文本、代码或多模态编码", output: "Token IDs" },
      { label: "Embedding", title: "Token + position representations", summary: "编号变向量，并加入顺序信息。", detail: "词嵌入把每个 Token ID 查成 d_model 维向量。位置信息可用 learned embedding、RoPE 等方式注入；现代 GPT 常用旋转位置编码，让注意力分数表达相对距离。", input: "Token IDs + 位置", output: "序列向量 X" },
      { label: "Causal Attention", title: "Masked self-attention", summary: "每个位置只能读取自己和左侧历史。", detail: "Q、K、V 都来自当前序列，但因果遮罩把未来位置的注意力分数设为 −∞。这样训练时可并行计算所有位置，又保证第 t 个预测不会偷看 t+1 之后的正确答案。多头并行捕获语法、指代、主题和长距离依赖。", input: "当前层隐藏状态", output: "融合左侧上下文的表示" },
      { label: "MLP + 残差", title: "Transformer block", summary: "注意力交流后，每个位置独立加工。", detail: "每个 block 通常包含归一化、注意力、残差连接、MLP 和第二条残差路径。MLP 常扩展到约 4 倍维度，使用 GELU 或 SwiGLU 激活，再压回 d_model。几十到上百层堆叠后形成抽象表示。", input: "上下文化 Token 表示", output: "更高层语义表示" },
      { label: "LM Head", title: "Vocabulary projection", summary: "最后向量变成整个词表的候选分数。", detail: "线性层把 d_model 投影到 vocabulary size 个 logits，常与输入 embedding 权重共享。Softmax 形成概率分布。训练用正确下一个 Token 的负对数似然；推理用 greedy、temperature、top-k 或 top-p 选择。", input: "最后层隐藏向量", output: "P(next token | context)" },
      { label: "自回归生成", title: "Autoregressive decoding", summary: "选中一个 Token，追加，再重复整个过程。", detail: "模型一次通常生成一个 Token。KV cache 保存此前各层的 Key/Value，避免每一步重复计算整个前缀；上下文越长，缓存越大。生成直到 EOS、停止词或长度上限。", input: "已有上下文 + KV cache", output: "新 Token 与更新后的上下文" },
    ]}
    concepts={[
      { term: "Decoder-only", plain: "只使用 Transformer 的解码器式模块。", deep: "没有独立 Encoder 和 Cross-Attention；提示词与已生成答案放在同一序列中，通过因果自注意力连接。" },
      { term: "Next-token prediction", plain: "给左边所有内容，猜紧接着出现什么。", deep: "序列联合概率按链式法则分解，因此一个看似简单的局部任务可以学习语法、事实、风格和一定的推理模式。", formula: "P(x₁:T)=∏ₜ P(xₜ | x<ₜ)" },
      { term: "Cross-entropy loss", plain: "正确 Token 概率越低，惩罚越大。", deep: "训练对所有非 padding 位置求平均负对数概率。困惑度 perplexity = exp(loss)，可理解为平均还在多少候选间犹豫。", formula: "L = −Σₜ log Pθ(xₜ | x<ₜ)" },
      { term: "Context window", plain: "一次能放进模型“工作记忆”的 Token 上限。", deep: "上下文不是模型参数中的长期知识；超出窗口的信息会被截断或压缩。更长窗口还会增加 attention 与 KV cache 成本。" },
      { term: "KV Cache", plain: "把之前算过的注意力 Key/Value 留下来复用。", deep: "它显著减少逐 Token 解码的重复计算，但显存占用随层数、序列长度、KV 头数和维度线性增长。" },
      { term: "Temperature / Top-p", plain: "控制输出更稳还是更多样。", deep: "temperature 缩放 logits；top-p 只在累计概率达到 p 的最小候选集合中采样。它们改变选择策略，不会让模型获得新知识。", formula: "Pᵢ = softmax(logitᵢ / T)" },
    ]}
    phases={[
      { name: "预训练", goal: "学习通用语言分布", action: "在大规模语料上预测下一个 Token。", signal: "Cross-entropy loss" },
      { name: "指令微调 SFT", goal: "学会按要求回答", action: "用高质量指令—回答样本继续训练。", signal: "目标回答的 Token loss" },
      { name: "偏好对齐", goal: "更符合人类偏好与安全要求", action: "用 RLHF、DPO 等区分更好与更差的回答。", signal: "奖励或成对偏好" },
      { name: "推理时生成", goal: "在质量、速度和多样性间取舍", action: "使用 KV cache 与采样策略逐 Token 解码。", signal: "概率分布 + 停止条件" },
    ]}
    comparisons={[
      { title: "GPT vs 原始 Transformer", text: "原始架构有 Encoder 和 Decoder；GPT 通常只保留带因果遮罩的 Decoder block，把所有文本放进同一序列。" },
      { title: "GPT vs BERT", text: "GPT 单向看左侧并擅长生成；BERT 双向看上下文并擅长理解与表征。GPT 预测下一词，BERT 主要恢复被遮住的词。" },
      { title: "GPT vs GAN", text: "GPT 通过最大似然学习可分解的序列概率；GAN 通过判别器提供的对抗信号对齐整体数据分布。" },
    ]}
    pitfalls={[
      { title: "流畅不等于真实", text: "目标是生成高概率文本，不是执行事实数据库查询；模型可能自信地补全错误信息。", fix: "检索增强、工具调用、引用核验与不确定性表达" },
      { title: "上下文不等于永久记忆", text: "对话内容只在当前上下文窗口内有效，且长上下文中的信息不一定被同等利用。", fix: "摘要、外部记忆、检索和结构化提示" },
      { title: "参数更多不自动等于会推理", text: "规模提升能力，但任务分解、数据质量、训练目标和推理时计算同样关键。", fix: "高质量数据、过程监督、工具使用与评测" },
    ]}
    questions={[
      { question: "GPT 训练时为什么能并行，生成时却通常只能逐 Token？", answer: "训练时整段正确文本已知，因果 mask 让每个位置只读左侧，但所有位置可在矩阵中同时计算；生成时下一个 Token 尚不存在，必须先选出它才能计算再下一个。" },
      { question: "模型是在数据库里搜索下一个词吗？", answer: "不是。它用神经网络把上下文映射成词表概率，参数中存的是分布式统计模式。检索增强模型可以额外查询外部数据库，但那是独立机制。" },
      { question: "Temperature 调低会让答案更正确吗？", answer: "它只让输出更偏向最高概率候选，因此通常更稳定、可重复，但最高概率候选也可能是错的。它不能修复知识缺口或错误推理。" },
    ]}
  />;
}
