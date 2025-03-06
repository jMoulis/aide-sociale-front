import { Link } from '@/i18n/routing';

export default async function RootPage() {
  return (
    <nav>
      <Link href='/booking/admin'>Admin Booking</Link>
      <Link href='/booking/user'>User Booking</Link>
    </nav>
  );
}
