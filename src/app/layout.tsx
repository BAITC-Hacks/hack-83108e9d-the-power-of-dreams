import type { ReactNode } from 'react';
import './style.css';
export const metadata = {
  title: 'join city — подбор подрядчиков для мероприятий',
  description: 'join city помогает организаторам мероприятий в Казахстане находить подходящих подрядчиков без долгого изучения каталога. Пользователь указывает город, дату, формат мероприятия и бюджет, а сервис предлагает до трёх подходящих вариантов с понятным объяснением каждого результата.',
  keywords: ['Искусственный интеллект', 'Подбор подрядчиков', 'Организация мероприятий', 'Объяснимые рекомендации'],
};
export default function Layout({ children }: { children: ReactNode }) {
  return <html lang="ru"><body>{children}</body></html>;
}
