import { BlogPost } from '../types';

// Static blog posts data - easier to manage than file-based system
export const staticBlogPosts: BlogPost[] = [
//   {
//     id: "weight-ensembling-reasoning",
//     title: "Weight Ensembling for Better Reasoning in Language Models", 
//     slug: "weight-ensembling-reasoning",
//     excerpt: "Exploring how weight interpolation between checkpoints can recover generation diversity and improve test-time performance in reasoning tasks.",
//     content: `# Weight Ensembling for Better Reasoning in Language Models

// Recent work has shown that language models can exhibit impressive reasoning capabilities, but training these models often leads to failure modes where generation diversity collapses, hurting test-time scaling performance.

// ## The Problem: Diversity Collapse

// During supervised fine-tuning (SFT) of reasoning models, we often observe that the model's generation diversity begins to collapse. This means:

// - The model starts producing very similar reasoning paths
// - Test-time scaling becomes less effective
// - Overall reasoning performance deteriorates

// ## Our Solution: WiSE-FT

// We propose **WiSE-FT** (Weight Interpolation for Supervised fine-tuning Enhancement), which involves:

// $$\\theta_{\\text{final}} = \\alpha \\theta_{\\text{latest}} + (1-\\alpha) \\theta_{\\text{earlier}}$$

// Where $\\theta_{\\text{latest}}$ is the latest SFT checkpoint and $\\theta_{\\text{earlier}}$ is an earlier checkpoint from the same training run.

// ## Key Findings

// 1. **Diversity Recovery**: Weight interpolation significantly recovers generation diversity
// 2. **Better Test-time Scaling**: Models show improved performance when generating multiple reasoning paths
// 3. **Robust Performance**: The method works across different model sizes and reasoning tasks

// ## Implications

// This work suggests that the training dynamics of reasoning models are more complex than previously thought, and simple interpolation techniques can unlock better performance.

// *This research was conducted in collaboration with Christina Baek, Kaiyue Wen, Zico Kolter, and Aditi Raghunathan.*`,
//     publishedAt: "2025-01-15",
//     tags: ["Research", "Large Language Models", "Reasoning", "Training"],
//     readingTime: 4
//   },
];