"use client";

import Link from "next/link";
import { useState } from "react";
import katex from "katex";

export type LessonStep = {
  label: string;
  title: string;
  summary: string;
  detail: string;
  input: string;
  output: string;
};

export type LessonConcept = {
  term: string;
  plain: string;
  deep: string;
  formula?: string;
};

export type LessonPhase = {
  name: string;
  goal: string;
  action: string;
  signal: string;
};

export type LessonProps = {
  slug: string;
  code: string;
  label: string;
  title: string;
  subtitle: string;
  analogy: string;
  accent: "coral" | "violet" | "cyan" | "lime";
  steps: LessonStep[];
  concepts: LessonConcept[];
  phases: LessonPhase[];
  comparisons: { title: string; text: string }[];
  pitfalls: { title: string; text: string; fix: string }[];
  questions: { question: string; answer: string }[];
};

const topics = [
  { href: "/", label: "精细复习" },
  { href: "/transformer-map", label: "Transformer" },
  { href: "/gan", label: "GAN" },
  { href: "/gpt", label: "GPT" },
  { href: "/bert", label: "BERT" },
  { href: "/reinforcement-learning", label: "强化学习" },
];

function Formula({ expression }: { expression: string }) {
  const html = katex.renderToString(expression, { displayMode: true, throwOnError: false, strict: "ignore" });
  return <div className="math-formula" aria-label={expression} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function DeepLesson(props: LessonProps) {
  const [activeStep, setActiveStep] = useState(0);
  const current = props.steps[activeStep];

  return (
    <main className={`lesson-page lesson-${props.accent}`}>
      <header className="lesson-nav">
        <Link href="/learn" className="lesson-brand"><span>✦</span> AI 架构实验室</Link>
        <nav aria-label="专题导航">
          {topics.map((topic) => <Link key={topic.href} href={topic.href} className={topic.href === `/${props.slug}` ? "active" : ""}>{topic.label}</Link>)}
        </nav>
        <Link href="/learn" className="lesson-index-link">全部专题 →</Link>
      </header>

      <section className="lesson-hero">
        <div className="lesson-hero-copy">
          <span className="lesson-code">{props.code} · 架构专题</span>
          <h1>{props.title}</h1>
          <p>{props.subtitle}</p>
          <div className="lesson-analogy"><span>先记住这个比喻</span><b>{props.analogy}</b></div>
          <a href="#pipeline" className="lesson-start">沿数据流开始学习 <span>↓</span></a>
        </div>
        <div className="lesson-hero-visual" aria-hidden="true">
          <div className="visual-grid" />
          <div className="visual-core">{props.code}</div>
          {props.steps.slice(0, 4).map((step, index) => <div key={step.label} className={`visual-satellite satellite-${index + 1}`}><small>0{index + 1}</small>{step.label}</div>)}
        </div>
      </section>

      <section className="lesson-section pipeline-section" id="pipeline">
        <div className="lesson-heading">
          <div><span>01 · 数据怎样流动</span><h2>点击每一步，看看<br />信息发生了什么变化。</h2></div>
          <p>理解架构最有效的方法，不是背模块名称，而是追踪每一步的输入、运算和输出。</p>
        </div>

        <div className="pipeline-layout">
          <div className="pipeline-steps" role="tablist" aria-label={`${props.label} 数据流程`}>
            {props.steps.map((step, index) => <button key={step.label} role="tab" aria-selected={activeStep === index} className={activeStep === index ? "active" : ""} onClick={() => setActiveStep(index)}><span>{String(index + 1).padStart(2, "0")}</span><b>{step.label}</b><i>→</i></button>)}
          </div>
          <article className="pipeline-detail">
            <div className="pipeline-detail-top"><span>步骤 {String(activeStep + 1).padStart(2, "0")}</span><b>{current.title}</b></div>
            <h3>{current.summary}</h3><p>{current.detail}</p>
            <div className="io-flow"><div><small>输入</small><b>{current.input}</b></div><i>→</i><div><small>输出</small><b>{current.output}</b></div></div>
          </article>
        </div>
      </section>

      <section className="lesson-section concept-section">
        <div className="lesson-heading">
          <div><span>02 · 核心零件</span><h2>每个术语，先用白话懂，<br />再往计算里走一步。</h2></div>
          <p>“白话解释”帮你建立直觉，“深入一层”告诉你模型实际在优化什么。</p>
        </div>
        <div className="concept-grid">
          {props.concepts.map((concept, index) => <article key={concept.term} className="concept-card"><div className="concept-number">{String(index + 1).padStart(2, "0")}</div><h3>{concept.term}</h3><p className="concept-plain">{concept.plain}</p><div className="concept-deep"><span>深入一层</span><p>{concept.deep}</p></div>{concept.formula && <Formula expression={concept.formula} />}</article>)}
        </div>
      </section>

      <section className="lesson-section training-loop-section">
        <div className="lesson-heading light-heading">
          <div><span>03 · 怎样学会</span><h2>一次训练循环，<br />究竟在调整什么？</h2></div>
          <p>模型学习不是突然“理解”，而是重复预测、获得反馈、计算误差、更新参数。</p>
        </div>
        <div className="phase-track">
          {props.phases.map((phase, index) => <article key={phase.name}><div className="phase-index">{index + 1}</div><span>{phase.name}</span><h3>{phase.goal}</h3><p>{phase.action}</p><div><small>学习信号</small><b>{phase.signal}</b></div></article>)}
        </div>
      </section>

      <section className="lesson-section compare-section">
        <div className="comparison-panel">
          <span className="panel-kicker">04 · 放进知识地图</span><h2>它与其他架构<br />有什么本质区别？</h2>
          <div className="comparison-list">{props.comparisons.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
        </div>
        <div className="pitfall-panel">
          <span className="panel-kicker">常见误区与局限</span>
          {props.pitfalls.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p><small>常用应对：{item.fix}</small></article>)}
        </div>
      </section>

      <section className="lesson-section faq-section">
        <div className="lesson-heading"><div><span>05 · 自测问答</span><h2>真正理解，应该能<br />回答这些问题。</h2></div></div>
        <div className="faq-list">{props.questions.map((item, index) => <details key={item.question}><summary><span>Q{index + 1}</span>{item.question}<i>＋</i></summary><p>{item.answer}</p></details>)}</div>
      </section>

      <section className="next-topics"><span>继续探索</span><h2>把几种架构放在一起看，<br />你会更快抓住它们的差别。</h2><div>{topics.filter((topic) => topic.href !== `/${props.slug}`).map((topic) => <Link key={topic.href} href={topic.href}>{topic.label}<span>→</span></Link>)}</div></section>
      <footer className="lesson-footer"><Link href="/learn">AI 架构实验室</Link><p>{props.label} 深度可视化教程</p><a href="#top">回到顶部 ↑</a></footer>
    </main>
  );
}
