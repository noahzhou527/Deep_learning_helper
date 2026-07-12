import DeepLesson from "../components/DeepLesson";

export const metadata = { title: "GAN 架构详解｜AI 架构实验室", description: "从生成器与判别器的对抗训练理解 GAN。" };

export default function GanPage() {
  return <DeepLesson
    slug="gan" code="GAN" label="生成对抗网络"
    title="两个模型对抗，逼出一个生成高手。"
    subtitle="GAN（Generative Adversarial Network）不直接学习“怎样画一张真实图片”，而是让生成器不断骗过判别器，让判别器不断识破假货。双方一起进步，最后生成器学会逼近真实数据分布。"
    analogy="生成器像造假者，判别器像鉴定师；鉴定师越严格，造假者就必须学得越像真的。"
    accent="coral"
    steps={[
      { label: "采样噪声 z", title: "Latent vector", summary: "从一个简单随机分布取出“生成种子”。", detail: "通常从高斯分布或均匀分布采样一个低维向量 z。它本身不是图片，也没有人工标签；不同 z 对应潜在空间中的不同位置。训练充分后，沿潜在空间平滑移动，生成结果也常会平滑变化。", input: "z ~ N(0, I) 或 U(-1, 1)", output: "潜在向量 z" },
      { label: "生成器 G", title: "Generator", summary: "把随机向量逐层变成看起来真实的样本。", detail: "生成器是可微神经网络。图像 GAN 常用上采样和卷积，把低维 z 映射成高维像素；条件 GAN 还会输入类别、文本或其他条件 c。它不直接看真实图，只从判别器返回的梯度得知哪里不像。", input: "噪声 z（可加条件 c）", output: "伪样本 x̂ = G(z)" },
      { label: "真假混合", title: "Real + Fake batch", summary: "把真实样本和生成样本一起交给鉴定师。", detail: "真实样本 x 来自训练数据，伪样本 G(z) 来自生成器。训练时要控制两类样本的比例与批次，且在更新判别器时通常暂时阻断生成器参数的梯度，避免一次更新同时改动双方。", input: "x ~ p_data 与 G(z)", output: "真假混合批次" },
      { label: "判别器 D", title: "Discriminator", summary: "给样本打一个“像真实数据”的分数。", detail: "判别器本质上是二分类器，输出 D(x)。经典 GAN 将其解释为样本来自真实分布的概率；WGAN 则输出未压缩的 critic 分数，衡量真实与生成分布的差异。判别器既要提高 D(x)，又要降低 D(G(z))。", input: "真实或生成样本", output: "真假分数 D(·)" },
      { label: "反向传播", title: "Adversarial gradients", summary: "同一个判别结果，给双方相反方向的学习信号。", detail: "判别器因误判而更新；生成器则穿过判别器反向传播，但只更新 G，使 D(G(z)) 更像真实。实践常用非饱和生成器损失 −log D(G(z))，比原始 log(1−D(G(z))) 在早期提供更强梯度。", input: "判别误差", output: "分别更新 θD 与 θG" },
      { label: "分布逼近", title: "Distribution matching", summary: "最终目标不是复制训练图片，而是学到它们的分布。", detail: "理想平衡下，生成分布 p_g 与真实分布 p_data 一致，判别器对任何样本都只能输出 0.5。有限数据、有限网络和不稳定优化会让现实偏离这个理想，因此需要结构、损失和正则化技巧。", input: "反复交替训练", output: "p_g ≈ p_data" },
    ]}
    concepts={[
      { term: "生成器 Generator", plain: "负责从随机种子制造样本。", deep: "它通过判别器的梯度间接学习真实分布；条件生成时优化 p(x|c)，无条件生成时优化 p(x)。", formula: "x̂ = Gθ(z)" },
      { term: "判别器 Discriminator", plain: "判断输入像真还是像假。", deep: "它提供一个会随训练变化的损失面。判别器太弱，反馈没用；太强，经典损失可能让生成器梯度接近 0。", formula: "Dφ(x) ∈ [0, 1]" },
      { term: "极小极大博弈", plain: "D 想把真假分开，G 想让假样本被当成真。", deep: "这是两名玩家的动态优化，不是固定目标上的普通最小化。一个模型更新后，另一个模型面对的目标也变了。", formula: "min_G max_D E[log D(x)] + E[log(1-D(G(z)))]" },
      { term: "潜在空间 Latent space", plain: "生成结果背后的压缩坐标系。", deep: "相近的 z 常映射为相似样本；插值、属性方向和风格混合都利用这一几何结构，但可解释性不是自动保证的。" },
      { term: "Mode Collapse", plain: "生成器只会少数几种答案，却能暂时骗过 D。", deep: "它忽略真实分布的部分模态。例如人脸 GAN 反复生成相似面孔。根因与博弈动力学、损失和容量不平衡有关。" },
      { term: "Wasserstein 距离", plain: "用更平滑的方式衡量真假分布有多远。", deep: "WGAN 用 critic 近似 Earth Mover 距离，并要求 1-Lipschitz；WGAN-GP 用梯度惩罚比权重裁剪更稳定。", formula: "L_GP = λ(‖∇x̂ D(x̂)‖₂ - 1)²" },
    ]}
    phases={[
      { name: "训练 D：真实样本", goal: "真实判为真", action: "采样真实批次 x，让 D(x) 升高。", signal: "−log D(x)" },
      { name: "训练 D：生成样本", goal: "伪样本判为假", action: "采样 z 并生成 G(z)，暂不更新 G。", signal: "−log(1−D(G(z)))" },
      { name: "训练 G", goal: "骗过当前 D", action: "固定 D，梯度穿过 D 回到 G。", signal: "−log D(G(z))" },
      { name: "评估与平衡", goal: "质量与多样性兼顾", action: "看样本、损失曲线，并用 FID 等指标比较分布。", signal: "FID ↓，覆盖度 ↑" },
    ]}
    comparisons={[
      { title: "GAN vs VAE", text: "VAE 明确优化重建与概率下界，潜在空间通常更规整；GAN 常生成更锐利的样本，但没有直接的似然值且训练更不稳定。" },
      { title: "GAN vs Diffusion", text: "GAN 一次前向传播就能生成，速度快；扩散模型通过多步去噪生成，训练通常更稳、覆盖更好，但采样计算更大。" },
      { title: "GAN vs GPT", text: "GAN 学真实与生成样本的整体分布对抗；GPT 把序列概率拆成逐 Token 条件概率，并用最大似然训练。" },
    ]}
    pitfalls={[
      { title: "损失下降不等于图片变好", text: "双方目标同时变化，GAN 损失不像普通监督学习那样容易解释。", fix: "结合样本可视化、FID、precision/recall 与过拟合检查" },
      { title: "判别器越强不一定越好", text: "D 完美区分后，经典 GAN 的生成器可能拿不到有效梯度。", fix: "控制更新比、标签平滑、谱归一化或改用 WGAN-GP" },
      { title: "生成结果多不等于覆盖真实分布", text: "模型可能在视觉上多样，却仍遗漏重要模态。", fix: "同时评估质量 precision 与覆盖 recall" },
    ]}
    questions={[
      { question: "生成器为什么不直接和真实图片比较像素误差？", answer: "像素误差要求一个生成样本对应唯一标准答案，但无条件生成有无数合理答案。判别器学习一个数据驱动的相似性标准，让 G 对齐整个分布，而不是复刻某一张图。" },
      { question: "为什么要交替训练，不能同时一步更新？", answer: "双方的目标依赖对方当前状态。先固定一方更新另一方，可以得到清晰的梯度目标；完全同步容易造成梯度互相干扰，甚至让博弈绕圈或发散。" },
      { question: "GAN 训练到最后，判别器是不是没用了？", answer: "部署时通常只保留生成器；但训练平衡时 D≈0.5 不是判别器失效，而是 p_g 已接近 p_data，真假在分布层面无法区分。" },
    ]}
  />;
}
