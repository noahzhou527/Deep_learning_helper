import Link from "next/link";

const courses = [
  { href: "/transformer-map", code: "01", name: "Transformer", tag: "注意力与序列建模", text: "理解 Encoder–Decoder、注意力、多头、FFN、Token 与训练数据。", color: "blue" },
  { href: "/gan", code: "02", name: "GAN", tag: "生成模型", text: "看生成器和判别器如何对抗，以及为何训练不稳定。", color: "coral" },
  { href: "/gpt", code: "03", name: "GPT", tag: "Decoder-only LLM", text: "从下一个 Token 预测走到预训练、对齐和逐词生成。", color: "violet" },
  { href: "/bert", code: "04", name: "BERT", tag: "双向语言理解", text: "理解掩码语言模型、[CLS] 表示与下游微调。", color: "cyan" },
  { href: "/reinforcement-learning", code: "05", name: "强化学习", tag: "从奖励中学习行动", text: "沿 Agent–Environment 循环理解策略、价值与探索。", color: "lime" },
  { href: "/review", code: "06", name: "进阶 AI 架构", tag: "结构总复盘与手算", text: "把 FNN、CNN、RNN、QKV 与 Transformer Block 串回同一套计算视角。", color: "violet" },
];

export default function LearnPage() {
  return <main className="course-hub">
    <header className="lesson-nav"><Link href="/" className="lesson-brand"><span>✦</span> AI 架构实验室</Link><nav className="hub-nav" aria-label="课程导航"><a href="#courses">学习专题</a><Link href="/review">进阶 AI 架构 <span aria-hidden="true">↗</span></Link></nav></header>
    <section className="hub-hero">
      <div className="hub-intro"><span className="hub-eyebrow">从结构出发，理解 AI</span><h1>别背术语。<br />沿着数据流，<em>看懂模型。</em></h1><p>六个按顺序展开的专题，从 Transformer 出发，经过生成、理解与决策，最后完成跨架构的综合判断。</p><a className="hub-start" href="#courses">选择一个专题 <span aria-hidden="true">↓</span></a></div>
      <figure className="hub-flow" aria-label="语言模型的简化数据流：文本经过 Token、Attention 和 FFN，输出下一个 Token 的概率">
        <figcaption><span>从一句话，到一次预测</span><small>简化数据流</small></figcaption>
        <div className="hub-flow-input"><small>输入文本</small><span>小猫追着球跑</span></div>
        <div className="hub-flow-path"><span aria-hidden="true">↓</span><div><b>Token</b><small>把文字变成向量</small></div><span aria-hidden="true">↓</span><div className="hub-flow-focus"><b>Attention</b><small>让信息互相连接</small><div className="hub-token-row"><span>小猫</span><span>追着</span><span>球</span><span>跑</span></div></div><span aria-hidden="true">↓</span><div><b>FFN</b><small>逐个位置加工</small></div></div>
        <div className="hub-flow-output"><small>输出</small><span>下一个 Token 的概率</span></div>
      </figure>
    </section>
    <div className="hub-catalog-heading"><h2>学习专题</h2><p>从一张结构图开始，逐步理解六种视角。</p><span>{courses.length} 个专题</span></div>
    <section className="course-grid" id="courses" aria-label="学习专题">{courses.map((course) => <Link href={course.href} key={course.name} className={`course-card course-${course.color}`}><div><span>{course.code}</span><small>{course.tag}</small></div><h2>{course.name}</h2><p>{course.text}</p><b><span>进入专题</span><i aria-hidden="true">→</i></b></Link>)}</section>
    <footer className="lesson-footer"><Link href="/">AI 架构实验室</Link><p>面向初学者的可视化深度学习教程</p><a href="#courses">学习专题 ↑</a></footer>
  </main>;
}
