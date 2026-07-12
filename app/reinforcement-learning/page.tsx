import DeepLesson from "../components/DeepLesson";

export const metadata = { title: "强化学习机制详解｜AI 架构实验室", description: "沿 Agent–Environment 循环理解策略、价值与奖励。" };

export default function ReinforcementLearningPage() {
  return <DeepLesson
    slug="reinforcement-learning" code="RL" label="Reinforcement Learning"
    title="没有标准答案，只有行动之后的奖励。"
    subtitle="强化学习让 Agent 在环境中反复行动，通过奖励学习长期策略。难点在于：奖励可能延迟、探索会付出代价、当前行动会改变未来能遇到的状态。它优化的不是单步正确率，而是整段轨迹的累计回报。"
    analogy="像学骑自行车：没人逐帧告诉你车把该转几度；你尝试动作，从是否前进、是否摔倒的结果中调整。"
    accent="lime"
    steps={[
      { label: "观察状态 s", title: "State / Observation", summary: "Agent 先接收环境此刻提供的信息。", detail: "状态 s 应足以描述未来转移；现实中常只能看到 observation o，例如摄像头画面而不是世界完整状态。部分可观测问题可用历史帧、RNN 或 belief state 补充记忆。", input: "环境内部状态", output: "Agent 可见的 observation" },
      { label: "策略选动作 a", title: "Policy", summary: "策略把状态映射成动作或动作概率。", detail: "确定性策略输出一个动作 a=μ(s)；随机策略输出分布 π(a|s)，再从中采样。随机性帮助探索，也适合多个动作都合理的场景。神经网络策略的参数就是学习对象之一。", input: "状态 s", output: "动作 a ~ πθ(a|s)" },
      { label: "环境转移", title: "Transition dynamics", summary: "动作改变环境，产生下一个状态。", detail: "环境按未知或已知转移概率 P(s′|s,a) 演化。Agent 通常无法控制随机性，例如机器人轮胎打滑。Model-free 方法不显式学习 P；model-based 方法学习或使用环境模型来规划。", input: "当前 s 与动作 a", output: "下一状态 s′" },
      { label: "收到奖励 r", title: "Reward signal", summary: "环境用一个标量告诉 Agent 这一步有多好。", detail: "奖励定义行为目标，却不告诉 Agent 怎样完成目标。奖励可即时也可延迟；设计不当会造成 reward hacking——Agent 找到高分漏洞，却没有实现人的真实意图。", input: "转移 (s,a,s′)", output: "即时奖励 r" },
      { label: "估计长期价值", title: "Return / Value", summary: "不能只看眼前奖励，要估计未来总收益。", detail: "回报 G_t 是从当前时刻起的折扣奖励和。γ 越接近 1，越重视长期；Vπ(s) 评估状态，Qπ(s,a) 评估在状态执行动作后的长期价值。优势 A(s,a)=Q−V 表示动作比平均水平好多少。", input: "奖励序列 r_t, r_t+1, ...", output: "G、V、Q 或 Advantage" },
      { label: "更新并再探索", title: "Learning update", summary: "用预测误差或策略梯度调整行为，然后继续采样。", detail: "Value-based 方法最小化 TD error；policy gradient 直接提高带来高回报动作的概率；actor–critic 同时训练策略 actor 与价值 critic。新策略又会改变未来收集到的数据分布。", input: "经验 (s,a,r,s′)", output: "更新后的策略或价值函数" },
    ]}
    concepts={[
      { term: "MDP", plain: "强化学习问题的基本数学框架。", deep: "马尔可夫决策过程由状态 S、动作 A、转移 P、奖励 R 和折扣 γ 构成；马尔可夫性指未来在给定当前状态后与更早历史独立。", formula: "MDP = (S, A, P, R, γ)" },
      { term: "Return", plain: "从现在开始，未来奖励加起来有多少。", deep: "折扣让无限时域总和有限，也表达对远期奖励的不确定或偏好。episodic 任务也可在终止状态停止求和。", formula: "Gₜ = rₜ₊₁ + γrₜ₊₂ + γ²rₜ₊₃ + …" },
      { term: "Value / Q-value", plain: "长期来看，一个状态或动作有多值得。", deep: "Vπ 对策略动作取期望；Qπ 保留动作维度，因而可直接用 argmax 选动作。它们都依赖当前策略 π。", formula: "Qπ(s,a)=Eπ[Gₜ | sₜ=s,aₜ=a]" },
      { term: "Bellman Equation", plain: "长期价值 = 眼前奖励 + 下一步的长期价值。", deep: "它把难以直接估计的长轨迹递归拆成一步目标，是动态规划、Q-learning 和 TD 学习的核心。", formula: "Q*(s,a)=E[r+γ maxₐ′Q*(s′,a′)]" },
      { term: "Exploration vs Exploitation", plain: "探索新动作，还是利用当前最优动作。", deep: "只利用会错过更优策略，只探索又无法稳定获益。ε-greedy、熵奖励、UCB 和内在动机是常见机制。" },
      { term: "On-policy / Off-policy", plain: "学习的数据是否来自当前正在优化的策略。", deep: "PPO 是 on-policy，数据新鲜但样本利用率低；DQN、SAC 是 off-policy，可从 replay buffer 重用旧经验，但要处理分布偏移。" },
    ]}
    phases={[
      { name: "采样轨迹", goal: "获得与环境互动经验", action: "用当前策略运行若干步或完整 episode。", signal: "(s,a,r,s′,done)" },
      { name: "计算学习目标", goal: "把延迟奖励分配给早期动作", action: "计算 return、TD target 或 GAE advantage。", signal: "δ = r + γV(s′) − V(s)" },
      { name: "更新价值/策略", goal: "提高高回报行为概率", action: "最小化 value loss，最大化策略目标并控制更新幅度。", signal: "TD loss 或 policy gradient" },
      { name: "评估与再采样", goal: "确认不是偶然高分或奖励漏洞", action: "在独立种子、无探索噪声条件下运行评估。", signal: "平均回报、成功率与安全指标" },
    ]}
    comparisons={[
      { title: "强化学习 vs 监督学习", text: "监督学习每个样本有标准标签且数据分布相对固定；RL 只有稀疏奖励，动作会影响之后收集到的数据。" },
      { title: "Value-based vs Policy-based", text: "DQN 等先学 Q 再取最大动作，适合离散动作；策略梯度直接优化 π，适合连续动作和随机策略。" },
      { title: "Actor–Critic", text: "Actor 决定怎么做，Critic 评估做得如何。Critic 降低策略梯度方差，Actor 让价值学习能用于复杂动作空间。" },
      { title: "RLHF 与普通 RL", text: "RLHF 的环境通常是提示词与语言模型，奖励来自人类偏好训练出的奖励模型；PPO/DPO 等用于让回答更符合偏好。" },
    ]}
    pitfalls={[
      { title: "奖励高不等于真正完成目标", text: "Agent 会优化写下来的奖励，而不是设计者心里的意图，可能钻漏洞。", fix: "奖励审计、多指标约束、人类反馈和红队测试" },
      { title: "训练曲线方差很大", text: "轨迹随机、策略不断变化，同一配置不同随机种子可能结果差异显著。", fix: "多随机种子、置信区间、稳定基线与标准化评测" },
      { title: "离线数据不能随便当在线经验", text: "数据没覆盖的动作上，Q 网络可能产生过高的外推估计。", fix: "保守离线 RL、行为约束或重新收集在线数据" },
    ]}
    questions={[
      { question: "奖励和价值有什么区别？", answer: "奖励 r 是环境在某一步立即给出的标量；价值 V/Q 是 Agent 对未来累计奖励的预测。一个动作眼前奖励低，但若通向更好未来，价值仍可能很高。" },
      { question: "Q-learning 为什么是 off-policy？", answer: "它的目标使用 maxₐ′Q(s′,a′)，学习贪心最优策略，即使数据由 ε-greedy、旧策略或其他行为策略收集。因此行为策略与目标策略可以不同。" },
      { question: "为什么策略梯度要乘 Advantage？", answer: "Advantage 表示某动作比该状态下的平均选择好多少。正优势提高动作概率，负优势降低；减去 V(s) 作为 baseline 不改变期望梯度，却显著降低方差。" },
      { question: "PPO 的核心直觉是什么？", answer: "新策略应该朝更高回报方向移动，但一次别走太远。PPO 用概率比率裁剪限制更新，减少策略突然崩坏，同时保持实现简单。" },
    ]}
  />;
}
