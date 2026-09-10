import { AttentionLab } from "../AttentionLab";
import { Latex } from "../components/Latex";
import { RouteCard } from "../RouteCard";

const networkCards = [
  {
    id: "fnn",
    index: "01",
    name: "FNN",
    cn: "前馈神经网络",
    formula: "h = \\sigma(Wx+b)",
    copy: "信息只向前流动。每个输入维度与每个神经元相连，是理解线性层、激活函数与反向传播的地基。",
    tags: ["固定长度输入", "全连接", "无记忆"],
    nodes: ["x", "Wx+b", "σ", "ŷ"],
  },
  {
    id: "cnn",
    index: "02",
    name: "CNN",
    cn: "卷积神经网络",
    formula: "y_{ij}=\\sum_{m,n}K_{mn}X_{i+m,j+n}",
    copy: "小卷积核在局部滑动并共享参数，先提取边缘，再组合纹理与形状；尤其适合网格结构数据。",
    tags: ["局部感受野", "权重共享", "平移等变"],
    nodes: ["图像", "卷积", "池化", "分类"],
  },
  {
    id: "rnn",
    index: "03",
    name: "RNN",
    cn: "循环神经网络",
    formula: "h_t=\\tanh(W_xx_t+W_hh_{t-1}+b)",
    copy: "把上一时刻的隐藏状态带到下一时刻，天然表达顺序；但长距离梯度容易消失或爆炸。",
    tags: ["顺序计算", "隐藏状态", "参数共享"],
    nodes: ["xₜ", "hₜ₋₁", "hₜ", "yₜ"],
  },
  {
    id: "transformer",
    index: "04",
    name: "Transformer",
    cn: "注意力网络",
    formula: "\\operatorname{Attention}(Q,K,V)=\\operatorname{softmax}\\!\\left(\\frac{QK^{\\mathsf T}}{\\sqrt{d_k}}\\right)V",
    copy: "每个 token 直接与其他 token 建立加权连接，能并行计算，并通过位置编码保留次序信息。",
    tags: ["全局连接", "并行训练", "动态权重"],
    nodes: ["tokens", "Q·K", "α", "ΣαV"],
  },
];

export default function Home() {
  return (
    <main className="review-page">
      <nav className="topbar" aria-label="主导航">
        <a className="brand" href="#top" aria-label="深度学习复习站首页">
          <span className="brand-dot" />
          AI 架构 <em>进阶</em>
        </a>
        <div className="nav-links home-nav">
          <div className="nav-cluster" aria-label="本页导航">
            <span className="nav-cluster-label">本页</span>
            <a href="#map">网络地图</a>
            <a href="#attention">注意力</a>
            <a href="#block">Block</a>
            <a href="#compare">对比</a>
            <a href="#advance">综合</a>
          </div>
          <i className="nav-separator" aria-hidden="true" />
          <div className="nav-cluster nav-cluster-global">
            <span className="nav-cluster-label">课程</span>
            <a href="/">全部专题 <b aria-hidden="true">↗</b></a>
          </div>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span>●</span> 在学完各专题之后</p>
          <h1>把不同架构<br /><span>串成一张图。</span></h1>
          <p className="hero-lead">
            回到连接、权重共享、状态与注意力这些共同问题，沿着 <code>Wx + b</code>、Q、K、V、缩放点积、
            softmax 与 α 权重，重新建立跨架构的计算视角。
          </p>
        </div>
        <RouteCard />
      </section>

      <section className="foundation strip" id="foundation">
        <div><span>共同地基</span><strong className="foundation-formula">z = Wx + b</strong></div>
        <i>→</i><div><span>非线性</span><strong className="foundation-formula">a = σ(z)</strong></div>
        <i>→</i><div><span>损失</span><strong className="foundation-formula">ℒ(ŷ, y)</strong></div>
        <i>→</i><div><span>链式法则</span><strong className="foundation-formula">∂ℒ / ∂W</strong></div>
        <i>→</i><div><span>参数更新</span><strong className="foundation-formula">W ← W − η∇Wℒ</strong></div>
      </section>

      <section className="section" id="map">
        <header className="section-heading">
          <div><div className="section-step-line"><p className="kicker">01 — THE MAP</p><a href="#top">回到顶部 ↑</a></div><h2>先把四类网络放回同一张图</h2></div>
          <p>它们都在学习参数，只是对“连接谁、共享什么、记住多久”给出了不同答案。</p>
        </header>
        <div className="network-grid">
          {networkCards.map((network) => (
            <article className={`network-card ${network.id}`} key={network.id}>
              <div className="card-number">{network.index}</div>
              <div className="card-title"><h3>{network.name}</h3><span>{network.cn}</span></div>
              <div className="mini-flow" aria-label={`${network.name} 数据流`}>
                {network.nodes.map((node, index) => (
                  <span key={node}>{node}{index < network.nodes.length - 1 && <i>→</i>}</span>
                ))}
              </div>
              <Latex expression={network.formula} block className="formula" />
              <p>{network.copy}</p>
              <div className="tag-row">{network.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </article>
          ))}
        </div>
        <a className="topic-gateway" href="/">
          <div><span>完整课程地图</span><h3>继续学习 Tokenizer、Encoder–Decoder、GPT、BERT、GAN 与强化学习</h3></div>
          <b>进入 AI 架构实验室 →</b>
        </a>
      </section>

      <section className="attention-section" id="attention">
        <header className="section-heading light">
          <div><div className="section-step-line"><p className="kicker">02 — COMPUTE IT</p><a href="#top">回到顶部 ↑</a></div><h2>Self-Attention，不跳步</h2></div>
          <p>固定一个极小的 2 维例子。切换查询 token，再逐步查看矩阵如何变成 α 和上下文向量。</p>
        </header>
        <AttentionLab />
      </section>

      <section className="section block-section" id="block">
        <header className="section-heading">
          <div><div className="section-step-line"><p className="kicker">03 — ASSEMBLE</p><a href="#top">回到顶部 ↑</a></div><h2>把 Attention 装回 Transformer Block</h2></div>
          <p>注意力只是一个子层。真正稳定训练深层 Transformer，还需要残差、归一化和逐位置 FFN。</p>
        </header>
        <div className="block-flow">
          <div className="block-step sky"><b>01</b><strong>X + 位置编码</strong><span>加入顺序信息</span></div>
          <i>→</i>
          <div className="block-step purple"><b>02</b><strong>Multi-Head Attention</strong><span>不同子空间并行关注</span></div>
          <i>→</i>
          <div className="block-step lime"><b>03</b><strong>Add & LayerNorm</strong><span>残差保信息，归一化稳尺度</span></div>
          <i>→</i>
          <div className="block-step pink"><b>04</b><strong>Position-wise FFN</strong><span>每个 token 独立做非线性变换</span></div>
          <i>→</i>
          <div className="block-step deep"><b>05</b><strong>Add & LayerNorm</strong><span>得到下一层表示</span></div>
        </div>
        <div className="detail-grid">
          <article><span>MULTI-HEAD</span><h3>为什么要多头？</h3><p>每个头拥有自己的 W<sup>Q</sup>、W<sup>K</sup>、W<sup>V</sup>，可以分别学习语法依赖、指代或局部搭配。各头输出拼接后再乘 W<sup>O</sup>。</p><div className="detail-formula" aria-label="拼接各头输出后乘输出投影"><span className="formula-text">H = [h<sub>1</sub>, …, h<sub>m</sub>] W<sup>O</sup></span></div></article>
          <article><span>RESIDUAL</span><h3>为什么加回输入？</h3><p>子层只需学习对原表示的“修正量”，也为梯度提供更短的通路。维度必须一致，才能逐元素相加。</p><div className="detail-formula" aria-label="残差连接与层归一化"><span className="formula-text">y = LayerNorm(x + f(x))</span></div></article>
          <article><span>FFN</span><h3>和 FNN 是一回事吗？</h3><p>结构上就是两层前馈网络，但它对序列中每个位置独立、共享参数地计算；token 之间的信息交换已经在 Attention 完成。</p><div className="detail-formula" aria-label="逐位置前馈网络"><span className="formula-text">FFN(x) = W<sub>2</sub> σ(W<sub>1</sub>x + b<sub>1</sub>) + b<sub>2</sub></span></div></article>
        </div>
      </section>

      <section className="compare-section" id="compare">
        <header className="section-heading">
          <div><div className="section-step-line"><p className="kicker">04 — COMPARE</p><a href="#top">回到顶部 ↑</a></div><h2>最后，用五个问题区分它们</h2></div>
        </header>
        <div className="table-wrap">
          <table>
            <thead><tr><th>模型</th><th>核心操作</th><th>参数共享</th><th>并行性</th><th>长距离依赖</th><th>典型归纳偏置</th></tr></thead>
            <tbody>
              <tr><th>FNN</th><td>矩阵乘法</td><td>跨样本共享</td><td><span className="rating high">高</span></td><td>输入需一次展开</td><td>无结构假设</td></tr>
              <tr><th>CNN</th><td>局部卷积</td><td>跨空间位置</td><td><span className="rating high">高</span></td><td>靠堆叠扩大感受野</td><td>局部性、平移等变</td></tr>
              <tr><th>RNN</th><td>循环状态更新</td><td>跨时间步</td><td><span className="rating low">低</span></td><td>路径长，梯度困难</td><td>强顺序性</td></tr>
              <tr className="accent-row"><th>Transformer</th><td>全局注意力</td><td>跨 token 位置</td><td><span className="rating high">高</span></td><td>任意 token 一步连接</td><td>弱结构 + 位置编码</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="advanced-section" id="advance">
        <header className="section-heading light">
          <div><div className="section-step-line"><p className="kicker">05 — SYNTHESIZE</p><a href="#top">回到顶部 ↑</a></div><h2>进阶不在于记住更多名词，<br />而在于能做出结构判断。</h2></div>
          <p>面对一个新问题时，先判断信息如何连接、参数怎样共享、训练信号从哪里来；模型选择就不再只是背答案。</p>
        </header>
        <div className="advanced-grid">
          <article><span>01 · CONNECTION</span><h3>信息应该连到哪里？</h3><p>图像常需要局部邻域，序列需要历史状态，长上下文则更适合让 token 直接建立全局连接。</p></article>
          <article><span>02 · INDUCTIVE BIAS</span><h3>什么结构假设最有用？</h3><p>CNN 假设局部性，RNN 强调顺序，Transformer 只保留位置线索；假设越贴近数据，学习负担越小。</p></article>
          <article><span>03 · LEARNING SIGNAL</span><h3>模型从什么反馈中变好？</h3><p>监督学习依赖标签误差，GAN 来自对抗，强化学习来自奖励。先看反馈，再看网络名称。</p></article>
          <article><span>04 · TRANSFER</span><h3>哪些部件可以迁移？</h3><p>线性层、归一化、残差与注意力会在不同模型中反复出现；变化的是它们的连接方式与训练目标。</p></article>
        </div>
      </section>

      <footer>
        <div><span className="brand-dot" /><strong>AI 架构进阶</strong></div>
        <p>不是重读定义，而是把不同架构重新连回同一套计算逻辑。</p>
        <a href="#top">回到顶部 ↑</a>
      </footer>
    </main>
  );
}
