import { AttentionLab } from "./AttentionLab";
import { Latex } from "./components/Latex";

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
    <main>
      <nav className="topbar" aria-label="主导航">
        <a className="brand" href="#top" aria-label="深度学习复习站首页">
          <span className="brand-dot" />
          NEURAL NOTES <em>复习版</em>
        </a>
        <div className="nav-links">
          <a href="#map">网络地图</a>
          <a href="#attention">注意力计算</a>
          <a href="#compare">结构对比</a>
          <a href="/learn">全部专题</a>
        </div>
        <span className="level-badge">INTERMEDIATE</span>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span>●</span> 给已经认识 Transformer 的你</p>
          <h1>把每一步<br /><span>重新算一遍。</span></h1>
          <p className="hero-lead">
            从一个神经元的 <code>Wx + b</code> 出发，沿着 Q、K、V、缩放点积、
            softmax 与 α 权重，走到完整 Transformer Block。
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#attention">开始计算 <span>↘</span></a>
            <a className="text-link" href="/learn">进入完整知识地图 →</a>
          </div>
        </div>
        <aside className="route-card" aria-label="本页复习路线">
          <div className="route-head">
            <span>本页路线</span>
            <strong>约 25 MIN</strong>
          </div>
          <ol>
            <li><b>01</b><div><strong>共同地基</strong><span>线性层 · 激活 · 反向传播</span></div></li>
            <li><b>02</b><div><strong>四类网络</strong><span>FNN · CNN · RNN · Transformer</span></div></li>
            <li className="active"><b>03</b><div><strong>手算 Attention</strong><span>QKV · score · α · context</span></div></li>
            <li><b>04</b><div><strong>组装 Block</strong><span>Multi-head · Residual · LN · FFN</span></div></li>
          </ol>
          <p className="route-note">不是从零入门，而是把熟悉的名词重新接回计算图。</p>
        </aside>
      </section>

      <section className="foundation strip">
        <div><span>共同地基</span><Latex expression="z=Wx+b" /></div>
        <i>→</i><div><span>非线性</span><Latex expression="a=\\sigma(z)" /></div>
        <i>→</i><div><span>损失</span><Latex expression="\\mathcal L(\\hat y,y)" /></div>
        <i>→</i><div><span>链式法则</span><Latex expression="\\partial\\mathcal L/\\partial W" /></div>
        <i>→</i><div><span>参数更新</span><Latex expression="W\\leftarrow W-\\eta\\nabla_W\\mathcal L" /></div>
      </section>

      <section className="section" id="map">
        <header className="section-heading">
          <div><p className="kicker">01 — THE MAP</p><h2>先把四类网络放回同一张图</h2></div>
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
        <a className="topic-gateway" href="/learn">
          <div><span>完整课程地图</span><h3>继续学习 Tokenizer、Encoder–Decoder、GPT、BERT、GAN 与强化学习</h3></div>
          <b>进入 AI 架构实验室 →</b>
        </a>
      </section>

      <section className="attention-section" id="attention">
        <header className="section-heading light">
          <div><p className="kicker">02 — COMPUTE IT</p><h2>Self-Attention，不跳步</h2></div>
          <p>固定一个极小的 2 维例子。切换查询 token，再逐步查看矩阵如何变成 α 和上下文向量。</p>
        </header>
        <AttentionLab />
      </section>

      <section className="section block-section">
        <header className="section-heading">
          <div><p className="kicker">03 — ASSEMBLE</p><h2>把 Attention 装回 Transformer Block</h2></div>
          <p>注意力只是一个子层。真正稳定训练深层 Transformer，还需要残差、归一化和逐位置 FFN。</p>
        </header>
        <div className="block-flow">
          <div className="block-step input"><b>01</b><strong>X + 位置编码</strong><span>加入顺序信息</span></div>
          <i>→</i>
          <div className="block-step purple"><b>02</b><strong>Multi-Head Attention</strong><span>不同子空间并行关注</span></div>
          <i>→</i>
          <div className="block-step"><b>03</b><strong>Add & LayerNorm</strong><span>残差保信息，归一化稳尺度</span></div>
          <i>→</i>
          <div className="block-step pink"><b>04</b><strong>Position-wise FFN</strong><span>每个 token 独立做非线性变换</span></div>
          <i>→</i>
          <div className="block-step"><b>05</b><strong>Add & LayerNorm</strong><span>得到下一层表示</span></div>
        </div>
        <div className="detail-grid">
          <article><span>MULTI-HEAD</span><h3>为什么要多头？</h3><p>每个头拥有自己的 W<sup>Q</sup>、W<sup>K</sup>、W<sup>V</sup>，可以分别学习语法依赖、指代或局部搭配。各头输出拼接后再乘 W<sup>O</sup>。</p><Latex expression="\\operatorname{Concat}(head_1,\\ldots,head_h)W^O" block className="detail-formula" /></article>
          <article><span>RESIDUAL</span><h3>为什么加回输入？</h3><p>子层只需学习对原表示的“修正量”，也为梯度提供更短的通路。维度必须一致，才能逐元素相加。</p><Latex expression="y=\\operatorname{LayerNorm}(x+\\operatorname{Sublayer}(x))" block className="detail-formula" /></article>
          <article><span>FFN</span><h3>和 FNN 是一回事吗？</h3><p>结构上就是两层前馈网络，但它对序列中每个位置独立、共享参数地计算；token 之间的信息交换已经在 Attention 完成。</p><Latex expression="\\operatorname{FFN}(x)=W_2\\operatorname{GELU}(W_1x+b_1)+b_2" block className="detail-formula" /></article>
        </div>
      </section>

      <section className="compare-section" id="compare">
        <header className="section-heading">
          <div><p className="kicker">04 — COMPARE</p><h2>最后，用五个问题区分它们</h2></div>
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

      <footer>
        <div><span className="brand-dot" /><strong>NEURAL NOTES</strong></div>
        <p>复习不是再读一遍定义，而是重新走通一次计算。</p>
        <a href="#top">回到顶部 ↑</a>
      </footer>
    </main>
  );
}
