import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <h2 className="mb-3 text-2xl font-semibold text-gray-900">Page not found</h2>
      <p className="mb-6 text-gray-600">The route you requested does not exist.</p>
      <Link
        to="/"
        className="inline-flex rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition hover:bg-purple-700"
      >
        Go home
      </Link>
    </section>
  );
}
