import config from "./course-links.json";

export function courseUrl(path: string, base = config.llmBaseUrl) {
  const url = new URL(path.replace(/^\/+/, ""), `${base.replace(/\/+$/, "")}/`);
  if (!/^https?:$/.test(url.protocol)) throw new Error("课程地址必须使用 HTTP 或 HTTPS");
  return url.href;
}
export function relatedCourses() {
  return [
    { href: courseUrl("gpt3.html"), label: "GPT-3 数值实验：Block、前向、训练与 Cache →" },
    { href: courseUrl("index.html"), label: "LLM 推理课程：调度、显存与性能 →" },
  ];
}
