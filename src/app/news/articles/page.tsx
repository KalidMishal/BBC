import { redirect } from 'next/navigation';

export default function ArticlesRootPage() {
  redirect(encodeURI("/news/articles/How-a-movement-of-students-brought-down-Serbia's-Vučić"));
}
