"use client";

import { useMemo, useState } from "react";
import { Latex } from "./components/Latex";

const TOKENS = ["猫", "坐", "在", "垫子上"];
const X = [[1, 0.5], [0.2, 1], [0.4, 0.8], [0.8, 0.2]];
const WQ = [[1, 0], [0, 1]];
const WK = [[0.8, 0.2], [0.1, 0.9]];
const WV = [[0.6, 0.4], [-0.2, 0.8]];

const multiply = (matrix: number[][], weights: number[][]) => matrix.map((row) =>
  weights[0].map((_, col) => row.reduce((sum, value, i) => sum + value * weights[i][col], 0))
);
const dot = (a: number[], b: number[]) => a.reduce((sum, value, i) => sum + value * b[i], 0);
const softmax = (values: number[]) => {
  const max = Math.max(...values);
  const exps = values.map((value) => Math.exp(value - max));
  const total = exps.reduce((sum, value) => sum + value, 0);
  return exps.map((value) => value / total);
};
const f = (value: number) => value.toFixed(3);

const steps = [
  { number: "1", label: "投影 Q / K / V" },
  { number: "2", label: "Q · Kᵀ" },
  { number: "3", label: "缩放 ÷ √dₖ" },
  { number: "4", label: "softmax → α" },
  { number: "5", label: "α · V" },
];

export function AttentionLab() {
  const [query, setQuery] = useState(0);
  const [step, setStep] = useState(4);
  const result = useMemo(() => {
    const Q = multiply(X, WQ);
    const K = multiply(X, WK);
    const V = multiply(X, WV);
    const raw = K.map((key) => dot(Q[query], key));
    const scaled = raw.map((score) => score / Math.sqrt(2));
    const alpha = softmax(scaled);
    const context = V[0].map((_, dimension) => V.reduce((sum, value, index) => sum + alpha[index] * value[dimension], 0));
    return { Q, K, V, raw, scaled, alpha, context };
  }, [query]);

  const matrix = step === 0 ? result.Q : step === 1 ? result.raw.map((n) => [n]) : step === 2 ? result.scaled.map((n) => [n]) : step === 3 ? result.alpha.map((n) => [n]) : result.V;

  return (
    <div className="lab-shell">
      <div className="lab-controls">
        <div className="control-group">
          <label>选择 Query token</label>
          <div className="token-tabs" role="group" aria-label="选择 Query token">
            {TOKENS.map((token, index) => <button key={token} className={query === index ? "selected" : ""} onClick={() => setQuery(index)}>{token}<small>x{index + 1}</small></button>)}
          </div>
        </div>
        <div className="control-group">
          <label>计算进度</label>
          <div className="step-tabs" role="group" aria-label="选择注意力计算步骤">
            {steps.map((item, index) => <button key={item.number} className={step === index ? "selected" : step > index ? "done" : ""} onClick={() => setStep(index)}><b>{item.number}</b><span>{item.label}</span></button>)}
          </div>
        </div>
      </div>

      <div className="lab-content">
        <aside className="given-panel">
          <p className="lab-label">GIVEN · 固定参数</p>
          <h3>输入 X 与投影矩阵</h3>
          <Matrix title="X" values={X} rowLabels={TOKENS} />
          <div className="weights-grid">
            <Matrix title="Wᑫ" values={WQ} />
            <Matrix title="Wᵏ" values={WK} />
            <Matrix title="Wᵛ" values={WV} />
          </div>
          <p className="dim-note">本例 d<sub>model</sub> = d<sub>k</sub> = d<sub>v</sub> = 2。真实模型维度更大，运算规则相同。</p>
        </aside>

        <section className="calculation-panel">
          <div className="calc-head">
            <div><p className="lab-label">STEP {step + 1} / 5</p><h3>{steps[step].label}</h3></div>
            <span className="query-chip">当前 q：{TOKENS[query]}</span>
          </div>
          {step === 0 && <div className="explanation"><Latex expression="Q=XW^Q,\\quad K=XW^K,\\quad V=XW^V" block className="explanation-formula" /><p>同一个输入 X 经过三套可学习线性投影。Q 表示“我在找什么”，K 表示“我能被怎样匹配”，V 是最终被加权汇总的内容。</p></div>}
          {step === 1 && <div className="explanation"><Latex expression="s_{ij}=q_i k_j^{\\mathsf T}" block className="explanation-formula" /><p>固定 q<sub>{query + 1}</sub>，依次与每个 key 做内积。方向越一致，分数越高；此时分数还不是概率。</p></div>}
          {step === 2 && <div className="explanation"><Latex expression="z_{ij}=\\frac{s_{ij}}{\\sqrt{d_k}}=\\frac{s_{ij}}{\\sqrt 2}" block className="explanation-formula" /><p>d<sub>k</sub> 较大时，内积方差会随维度增大，softmax 容易饱和。除以 √d<sub>k</sub> 把数值尺度拉回稳定范围。</p></div>}
          {step === 3 && <div className="explanation"><Latex expression="\\alpha_{ij}=\\frac{\\exp(z_{ij})}{\\sum_m\\exp(z_{im})}" block className="explanation-formula" /><p>softmax 沿 key 维度归一化，所以每个 query 对所有 key 的 α 之和为 1。α 就是注意力权重，不是独立训练的参数。</p></div>}
          {step === 4 && <div className="explanation"><Latex expression="\\operatorname{context}_i=\\sum_j\\alpha_{ij}v_j" block className="explanation-formula" /><p>用 α 对所有 value 做加权和。输出不再只代表“{TOKENS[query]}”本身，而是融入了整句中与它相关的信息。</p></div>}

          <div className="live-equation">
            {step === 0 && <><Matrix title="Q" values={result.Q} rowLabels={TOKENS} /><Matrix title="K" values={result.K} rowLabels={TOKENS} /><Matrix title="V" values={result.V} rowLabels={TOKENS} /></>}
            {step > 0 && step < 4 && <div className="score-list">{TOKENS.map((token, index) => <div key={token}><span>{TOKENS[query]} → {token}</span><code>{step === 1 ? `${f(result.Q[query][0])}×${f(result.K[index][0])} + ${f(result.Q[query][1])}×${f(result.K[index][1])} = ${f(result.raw[index])}` : step === 2 ? `${f(result.raw[index])} ÷ 1.414 = ${f(result.scaled[index])}` : `e^${f(result.scaled[index])} / Σeᶻ = ${f(result.alpha[index])}`}</code></div>)}</div>}
            {step === 4 && <div className="context-calc"><div className="alpha-bars">{result.alpha.map((alpha, index) => <div key={TOKENS[index]}><span>{TOKENS[index]} <b>α = {f(alpha)}</b></span><i><em style={{ width: `${alpha * 100}%` }} /></i></div>)}</div><div className="context-output"><span>输出向量</span><strong>[ {f(result.context[0])}, {f(result.context[1])} ]</strong><small>α 总和 = {f(result.alpha.reduce((a, b) => a + b, 0))}</small></div></div>}
          </div>
          <div className="calc-footer">
            <button disabled={step === 0} onClick={() => setStep(step - 1)}>← 上一步</button>
            <div className="shape-note">张量形状：<code>{step === 0 ? "Q,K,V ∈ ℝ⁴ˣ²" : step < 4 ? "scores ∈ ℝ¹ˣ⁴" : "context ∈ ℝ¹ˣ²"}</code></div>
            <button disabled={step === 4} onClick={() => setStep(step + 1)}>下一步 →</button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Matrix({ title, values, rowLabels }: { title: string; values: number[][]; rowLabels?: string[] }) {
  return <div className="matrix-block"><span className="matrix-title">{title}</span><div className="matrix"><div className="bracket left" />{values.map((row, i) => <div className="matrix-row" key={i}>{rowLabels && <small>{rowLabels[i]}</small>}{row.map((value, j) => <code key={j}>{f(value)}</code>)}</div>)}<div className="bracket right" /></div></div>;
}
