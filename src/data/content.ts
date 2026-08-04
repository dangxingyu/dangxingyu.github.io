import { PersonalInfo, Publication } from '../types';

export const personalInfo: PersonalInfo = {
  name: "Xingyu Dang",
  title: "PhD Student at Princeton University",
  bio: "Hi! I am Xingyu Dang, a first-year PhD student at CS department of Princeton University, working with [Prof. Sanjeev Arora](https://www.cs.princeton.edu/~arora/). I graduated from Yao Class, Tsinghua University. During my undergraduate study, I was fortunate to work under the guidance of [Prof. Aditi Raghunathan](https://www.cs.cmu.edu/~aditirag/), [Prof. Kaifeng Lyu](https://kaifeng.ac/) and [Prof. Yang Yuan](http://people.iiis.tsinghua.edu.cn/~yuanyang/en.html). \n\n My research interests lie in the training dynamics of large language models: how pretraining scales, and how reasoning capability emerges.",
  email: "xingyudang@gmail.com",
  avatar: "/avatar.jpg",
  social: {
    github: "https://github.com/dangxingyu",
    linkedin: "https://www.linkedin.com/in/xingyu-dang-87b315267/",
    twitter: "https://x.com/xingyudang",
    scholar: "https://scholar.google.com/citations?hl=en&user=_qG6rGkAAAAJ"
  },
  researchInterests: [
    "Large Language Models",
    "Pretraining & Scaling",
    "Reasoning",
    "Learning Theory"
  ]
};

export const publications: Publication[] = [
  {
    id: "5",
    title: "Fantastic Pretraining Optimizers and Where to Find Them II: Hyperball Optimization",
    authors: ["Kaiyue Wen", "Xingyu Dang", "Kaifeng Lyu", "Tengyu Ma", "Percy Liang"],
    venue: "arXiv preprint",
    year: 2026,
    type: "preprint",
    pdf: "https://arxiv.org/abs/2606.16899",
    abstract: "Matrix-based optimizers such as Muon speed up language model pretraining, but their gains over AdamW shrink as model and data scale grow under constant decoupled weight decay. We propose Hyperball, an optimizer wrapper that fixes the Frobenius norms of weight matrices and their updates to constants. On Qwen3-style models up to 1.2B parameters, Muon+Hyperball achieves a 20-30% token-equivalent speedup over weight decay baselines, and improves learning rate transfer across widths and depths."
  },
  {
    id: "4",
    title: "The Power of Power Law: Asymmetry Enables Compositional Reasoning",
    authors: ["Zixuan Wang", "Xingyu Dang", "Jason D. Lee", "Kaifeng Lyu"],
    venue: "ICML 2026 (Spotlight)",
    year: 2026,
    type: "conference",
    pdf: "https://arxiv.org/abs/2604.22951",
    abstract: "Natural language data follows a power law, with most knowledge and skills appearing at very low frequency. Counter to the intuition that reweighting toward a uniform distribution helps long-tail skills, we find that across compositional reasoning tasks such as state tracking and multi-step arithmetic, training under power-law distributions consistently outperforms uniform training. We show power-law sampling induces a beneficial asymmetry in the loss landscape, letting models first acquire high-frequency skill compositions that then serve as stepping stones to rare long-tail skills."
  },
  {
    id: "3",
    title: "Escaping the Cognitive Well: Efficient Competition Math with Off-the-Shelf Models",
    authors: ["Xingyu Dang", "Rohit Agarwal*", "Rodrigo Porto", "Anirudh Goyal", "Liam H Fowl*", "Sanjeev Arora"],
    venue: "arXiv preprint",
    year: 2026,
    type: "preprint",
    pdf: "https://arxiv.org/abs/2602.16793",
    abstract: "We present an inference pipeline that attains best-in-class performance on IMO-style math problems at an average cost orders of magnitude below competing methods, using only general-purpose off-the-shelf models. The method targets grader failure in solver-grader pipelines, which we call the Cognitive Well: iterative refinement converging on a wrong solution that both the solver and the pipeline's internal grader consider basically correct. We address it via conjecture extraction, isolating candidate lemmas and verifying them alongside their negations in a fresh context."
  },
  {
    id: "1",
    title: "Weight Ensembling Improves Reasoning in Language Models",
    authors: ["Xingyu Dang*", "Christina Baek*", "Kaiyue Wen", "Zico Kolter", "Aditi Raghunathan"],
    venue: "COLM 2025",
    year: 2025,
    type: "conference",
    pdf: "https://arxiv.org/abs/2504.10478",
    abstract: "This work investigates failure modes in reasoning model training where generation diversity begins to collapse, leading to poor test-time scaling. We find that interpolating weights between the latest supervised fine-tuning (SFT) checkpoint and earlier checkpoints (called WiSE-FT) can significantly recover generation diversity and improve test-time performance."
  },
  {
    id: "2",
    title: "RNNs are not Transformers: The Key Bottleneck on In-context Retrieval",
    authors: ["Kaiyue Wen*", "Xingyu Dang*", "Kaifeng Lyu"],
    venue: "ICLR 2025",
    year: 2024,
    type: "conference",
    pdf: "https://arxiv.org/abs/2402.18510",
    abstract: "This paper studies the representational capacity gap between recurrent neural networks (RNNs) and Transformers when solving algorithmic problems. We find that despite their memory efficiency for long sequences, RNNs still cannot match Transformer performance even with enhanced chain-of-thought (CoT) prompting. The key bottleneck is RNNs' inability to perfectly retrieve information from context."
  }
];
