import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="not-found">
      <p className="eyebrow">404</p>

      <h1>That page isn't here.</h1>

      <p>Check the address or head back to the home page.</p>

      <Link to="/">Back to home</Link>
    </section>
  );
}

export default NotFoundPage;