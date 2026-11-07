export type CourseLink = { href: string; label: string };

export function CourseLinks({ links }: { links: CourseLink[] }) {
  return <nav className="course-links" aria-label="继续学习：LLM 实验与推理">
    <strong>把概念放进实际计算</strong>
    {links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}
  </nav>;
}
