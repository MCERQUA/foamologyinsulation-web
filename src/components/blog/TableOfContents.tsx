import React, { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

const TableOfContents: React.FC = () => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Get all h2 and h3 elements from the article
    const articleHeadings = Array.from(
      document.querySelectorAll('article h2, article h3')
    ).map((heading) => ({
      id: heading.id || '',
      text: heading.textContent || '',
      level: parseInt(heading.tagName.substring(1))
    }));

    setHeadings(articleHeadings);

    // Intersection Observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66%' }
    );

    articleHeadings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav
      className="hidden lg:block sticky top-32 p-6 rounded-2xl bg-soft-white/80 border border-white/20"
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(74, 63, 54, 0.08)',
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto'
      }}
    >
      <h4 className="text-sm font-bold text-espresso uppercase tracking-wide mb-4">
        Table of Contents
      </h4>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? 'ml-4' : ''}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-1 transition-colors duration-200 border-l-2 pl-3 ${
                activeId === heading.id
                  ? 'border-terra-cotta text-terra-cotta font-medium'
                  : 'border-transparent text-warm-gray hover:text-espresso hover:border-khaki'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
