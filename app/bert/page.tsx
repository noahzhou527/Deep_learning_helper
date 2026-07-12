import DeepLesson from "../components/DeepLesson";

export const metadata = { title: "BERT 架构详解｜AI 架构实验室", description: "理解双向 Encoder、MLM 与 BERT 微调。" };

export default function BertPage() {
  return <DeepLesson
    slug="bert" code="BERT" label="双向 Encoder 语言模型"
    title="把一句话两边都看完，再理解其中每个词。"
    subtitle="BERT（Bidirectional Encoder Representations from Transformers）使用 Transformer Encoder，让每个 Token 同时关注左边和右边。它不以自由续写为主，而是学习高质量上下文表示，再用少量任务数据完成分类、抽取和匹配。"
    analogy="像做完形填空：先通读整句话，再根据前后文判断被遮住的词；而不是只看左边一路续写。"
    accent="cyan"
    steps={[
      { label: "特殊 Token", title: "[CLS] / [SEP] / [MASK]", summary: "给序列增加任务边界与聚合位置。", detail: "[CLS] 放在开头，其最终向量常作为整句表示；[SEP] 分隔句子或标记结尾；[MASK] 只在预训练中遮住部分 Token。Padding 让批次等长，attention mask 防止模型关注填充位。", input: "一句或两句文本", output: "带特殊标记的 Token 序列" },
      { label: "三种 Embedding", title: "Token + Segment + Position", summary: "词是什么、属于哪句话、位于哪里，三类信息相加。", detail: "Token embedding 表示子词身份；Position embedding 表示绝对顺序；Segment embedding（A/B）区分句子对中的第一句和第二句。三者逐元素相加后再归一化，送入 Encoder。", input: "Token ID、位置、句段 A/B", output: "统一的输入向量" },
      { label: "双向注意力", title: "Bidirectional self-attention", summary: "每个位置可同时读取左右两侧所有非填充 Token。", detail: "BERT 没有因果遮罩，所以“银行”可以同时看到前面的“去”和后面的“存钱”，据此形成上下文化含义。Q、K、V 都来自当前层，多个头并行关注语法、指代和语义关系。", input: "完整输入序列", output: "每个 Token 的上下文表示" },
      { label: "Encoder 堆叠", title: "Attention + FFN + residual", summary: "多层 Encoder 逐步形成更抽象的语言表示。", detail: "每层包含多头自注意力、逐位置 FFN、残差连接和 LayerNorm。浅层常捕获词形和局部句法，深层更偏语义与任务线索；但这种分工是经验现象，不是硬编码规则。", input: "上一层表示", output: "更深的双向表示" },
      { label: "预训练目标", title: "Masked Language Modeling", summary: "遮住一部分词，让模型用双向上下文恢复它们。", detail: "原始 BERT 随机选约 15% Token：其中 80% 换成 [MASK]、10% 换成随机词、10% 保持原词，以减轻预训练与微调时 [MASK] 不出现的差异。只对被选位置计算 MLM 损失。", input: "被破坏的文本", output: "被选位置的原 Token 概率" },
      { label: "下游微调", title: "Task-specific head", summary: "在预训练表示上接一个很小的任务输出层。", detail: "文本分类常读取 [CLS]；序列标注读取每个 Token；问答分别预测答案起止位置。整个 BERT 与任务头通常一起微调，所以表示会针对少量标注数据轻微调整。", input: "预训练 BERT + 标注样本", output: "类别、标签或答案位置" },
    ]}
    concepts={[
      { term: "Bidirectional", plain: "一个词能同时看左边和右边。", deep: "这使 BERT 能利用完整句子消歧，但也意味着它不能像 GPT 一样用同一训练方式自然地逐词生成。" },
      { term: "Masked Language Model", plain: "隐藏少量词，再让模型猜回来。", deep: "它是去噪式目标，只在被选位置产生直接监督，因此每批次有效预测位比自回归模型少，但每次预测拥有双向上下文。", formula: "L_MLM = −Σᵢ∈M log P(xᵢ | x\\M)" },
      { term: "[CLS] 表示", plain: "放在句首的专用“整句摘要位”。", deep: "它通过多层注意力汇集其他 Token 信息。预训练中的 NSP 与后续分类微调鼓励其成为句级表示，但平均池化有时更适合语义相似度。" },
      { term: "Segment Embedding", plain: "告诉模型 Token 属于句子 A 还是句子 B。", deep: "用于问答、蕴含等句对任务。单句通常全设为 A；RoBERTa 等后续模型弱化或移除了部分原始设计。" },
      { term: "NSP", plain: "判断两句话在原文中是否相邻。", deep: "原始 BERT 用 Next Sentence Prediction 学句间关系；后续研究发现其构造方式未必最优，RoBERTa 删除 NSP 仍能提升性能。" },
      { term: "Fine-tuning", plain: "用少量任务数据调整整个预训练模型。", deep: "学习率通常远小于从头训练。参数高效方法如 adapters、LoRA 可冻结大部分主干，只训练少量新增参数。" },
    ]}
    phases={[
      { name: "构造预训练样本", goal: "制造可自监督的题目", action: "从无标签文本选出 MLM 位置并做 80/10/10 替换。", signal: "原文本自己提供答案" },
      { name: "双向编码", goal: "整合完整上下文", action: "所有非 padding Token 经过多层 Encoder 互相注意。", signal: "上下文隐藏状态" },
      { name: "恢复被遮词", goal: "学词义、句法与语义", action: "只在选中位置预测原始词表 ID。", signal: "MLM cross-entropy" },
      { name: "下游微调", goal: "迁移到具体任务", action: "接分类、标注或问答头，用标注数据端到端更新。", signal: "任务损失与验证集指标" },
    ]}
    comparisons={[
      { title: "BERT vs GPT", text: "BERT 是 Encoder-only、双向、以理解表征为主；GPT 是 Decoder-only、因果单向、以生成下一个 Token 为主。" },
      { title: "BERT vs 原始 Transformer Encoder", text: "结构核心相近；BERT 的关键贡献是大规模 MLM 预训练、特殊 Token 设计，以及把同一 Encoder 微调到多种 NLP 任务。" },
      { title: "BERT vs Sentence-BERT", text: "普通 BERT 直接比较两个 [CLS] 向量不一定适合语义检索；Sentence-BERT 用孪生结构和对比学习专门优化句向量。" },
    ]}
    pitfalls={[
      { title: "[CLS] 不一定是万能句向量", text: "分类微调中很好用，但未专门训练时，余弦相似度可能不能准确表达语义距离。", fix: "使用 Sentence-BERT、对比学习或合适的 pooling" },
      { title: "[MASK] 与真实输入存在差异", text: "下游任务不会看到 [MASK]，这产生预训练—微调不一致。", fix: "80/10/10 替换策略或 ELECTRA 等替代预训练目标" },
      { title: "双向不等于能自然生成长文本", text: "BERT 同时利用未来上下文，没有直接定义从左到右的联合概率。", fix: "生成任务采用 GPT、Encoder–Decoder 或专门迭代填空方法" },
    ]}
    questions={[
      { question: "BERT 为什么能看右边，GPT 却不能？", answer: "两者训练目标不同。BERT 要恢复句中被遮 Token，完整上下文在题目中已给出；GPT 要模拟真实生成，预测时未来内容尚不存在，所以训练必须用因果遮罩保持一致。" },
      { question: "为什么不把所有词都 Mask 掉？", answer: "如果全部遮住，模型就没有上下文线索，只能猜词频；遮少量位置既保留可用上下文，又让原文本自动提供监督答案。" },
      { question: "微调时只训练最后一层吗？", answer: "经典 BERT 微调通常同时更新整个 BERT 和新任务头；也可以冻结主干，或使用 LoRA/adapters 等参数高效方法，只更新少量参数。" },
    ]}
  />;
}
