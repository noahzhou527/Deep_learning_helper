import Link from "next/link";

const courses = [
  { href: "/", code: "01", name: "Transformer", tag: "注意力与序列建模", text: "理解 Encoder–Decoder、注意力、多头、FFN、Token 与训练数据。", color: "blue" },
  { href: "/gan", code: "02", name: "GAN", tag: "生成模型", text: "看生成器和判别器如何对抗，以及为何训练不稳定。", color: "coral" },
  { href: "/gpt", code: "03", name: "GPT", tag: "Decoder-only LLM", text: "从下一个 Token 预测走到预训练、对齐和逐词生成。", color: "violet" },
  { href: "/bert", code: "04", name: "BERT", tag: "双向语言理解", text: "理解掩码语言模型、[CLS] 表示与下游微调。", color: "cyan" },
  { href: "/reinforcement-learning", code: "05", name: "强化学习", tag: "从奖励中学习行动", text: "沿 Agent–Environment 循环理解策略、价值与探索。", color: "lime" },
];

export default function LearnPage() {
  return <main className="course-hub">
    <header className="lesson-nav"><Link href="/learn" className="lesson-brand"><span>✦</span> AI 架构实验室</Link><nav><Link href="/" >Transformer</Link><Link href="/gan">GAN</Link><Link href="/gpt">GPT</Link><Link href="/bert">BERT</Link><Link href="/reinforcement-learning">强化学习</Link></nav></header>
    <section className="hub-hero"><span>从结构出发，理解 AI</span><h1>别背术语。<br />沿着数据流，<em>看懂模型。</em></h1><p>五个独立专题，把核心架构、训练机制、常见误区和模型差异拆成可点击的视觉教程。</p></section>
    <section className="course-grid">{courses.map((course) => <Link href={course.href} key={course.name} className={`course-card course-${course.color}`}><div><span>{course.code}</span><small>{course.tag}</small></div><h2>{course.name}</h2><p>{course.text}</p><b>进入专题 <i>→</i></b></Link>)}</section>
    <section className="hub-map"><div><span>推荐顺序</span><h2>先建立共同语言，<br />再看架构的分叉。</h2></div><div className="hub-map-flow"><span>Transformer</span><i>→</i><span>GPT / BERT</span><i>→</i><span>GAN / 强化学习</span></div></section>
    <footer className="lesson-footer"><Link href="/learn">AI 架构实验室</Link><p>面向初学者的可视化深度学习教程</p></footer>
  </main>;
}
