import { Link } from '@/i18n/routing';
import { IMenu } from '@/lib/interfaces/interfaces';

type Props = {
  menus: IMenu[];
  className?: string;
};
function MenuLayout({ menus, className }: Props) {
  return (
    <aside
      className={`w-44 m-2 ${className || ''}`}
      style={{
        gridArea: 'menu'
      }}>
      <nav>
        <ul>
          {menus.map((menu, key) => {
            return (
              <li key={key} className='mb-2'>
                <h1>{menu.title}</h1>
                <ul className='ml-4'>
                  {menu.entries.map((entry, entryKey) => {
                    return (
                      <li key={entryKey}>
                        <Link href={entry.uri}>{entry.label}</Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default MenuLayout;
