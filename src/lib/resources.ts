import type { Article } from "@/types";
import whatIsGeo from "@/content/articles/what-is-geo";
import buildVsBuy from "@/content/articles/build-vs-buy-ai-automation";
import projectCost from "@/content/articles/ai-automation-project-cost";

// Order shown on the /resources index.
export const ARTICLES: Article[] = [whatIsGeo, buildVsBuy, projectCost];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
