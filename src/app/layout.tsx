import type { ReactNode } from 'react';
import './style.css';
export const metadata = { title: 'Подбор подрядчиков', description: 'Подрядчики для вашего мероприятия из предоставленного каталога' };
export default function Layout({ children }: { children: ReactNode }) {
  return <html lang="ru"><body>{children}</body></html>;
}
