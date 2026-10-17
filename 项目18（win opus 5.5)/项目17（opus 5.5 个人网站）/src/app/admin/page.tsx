import { Composer } from "./Composer";
export const metadata = {
  title: "内容管理",
  robots: { index: false, follow: false },
};
export default function AdminPage() {
  return <Composer />;
}
