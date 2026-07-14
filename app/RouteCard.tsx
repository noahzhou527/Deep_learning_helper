"use client";

import { useState } from "react";

const routeSteps = [
  { id: "foundation", number: "01", title: "共同地基", detail: "线性层 · 激活 · 反向传播" },
  { id: "map", number: "02", title: "四类网络", detail: "FNN · CNN · RNN · Transformer" },
  { id: "attention", number: "03", title: "手算 Attention", detail: "QKV · score · α · context" },
  { id: "block", number: "04", title: "组装 Block", detail: "Multi-head · Residual · LN · FFN" },
];

export function RouteCard() {
  const [activeId, setActiveId] = useState("foundation");

  function goToStep(id: string) {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <aside className="route-card" aria-label="本页复习路线">
      <div className="route-head">
        <span>本页路线</span>
        <strong>约 25 MIN</strong>
      </div>
      <ol>
        {routeSteps.map((step) => {
          const active = activeId === step.id;
          return (
            <li className={active ? "active" : undefined} key={step.id}>
              <button
                type="button"
                onClick={() => goToStep(step.id)}
                aria-current={active ? "step" : undefined}
                aria-label={`跳转到第 ${step.number} 步：${step.title}`}
              >
                <b>{step.number}</b>
                <span><strong>{step.title}</strong><small>{step.detail}</small></span>
                <i aria-hidden="true">↘</i>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="route-note">点击步骤跳转，高亮会保留在你刚刚选择的学习环节。</p>
    </aside>
  );
}
