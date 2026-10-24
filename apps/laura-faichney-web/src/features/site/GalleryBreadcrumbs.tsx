import { ChevronRight } from 'lucide-react';

type GalleryBreadcrumbsProps = { title: string };

export function GalleryBreadcrumbs(props: GalleryBreadcrumbsProps) {
  return (
    <nav className="gallery-breadcrumbs container" aria-label="Breadcrumb">
      <ol>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <ChevronRight size={14} aria-hidden="true" />
          <a href="/gallery">Gallery</a>
        </li>
        <li>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page">{props.title}</span>
        </li>
      </ol>
    </nav>
  );
}
