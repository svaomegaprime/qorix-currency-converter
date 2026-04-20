// import { redirect, Form, useLoaderData } from "react-router";
// import { login } from "../../shopify.server";
// import styles from "./styles.module.css";

// export const loader = async ({ request }) => {
//   const url = new URL(request.url);

//   if (url.searchParams.get("shop")) {
//     throw redirect(`/app?${url.searchParams.toString()}`);
//   }

//   return { showForm: Boolean(login) };
// };

// export default function App() {
//   const { showForm } = useLoaderData();

//   return (
//     <div className={styles.index}>
//       <div className={styles.content}>
//         <h1 className={styles.heading}>A short heading about [your app]</h1>
//         <p className={styles.text}>
//           A tagline about [your app] that describes your value proposition.
//         </p>
//         {showForm && (
//           <Form className={styles.form} method="post" action="/auth/login">
//             <label className={styles.label}>
//               <span>Shop domain</span>
//               <input className={styles.input} type="text" name="shop" />
//               <span>e.g: my-shop-domain.myshopify.com</span>
//             </label>
//             <button className={styles.button} type="submit">
//               Log in
//             </button>
//           </Form>
//         )}
//         <ul className={styles.list}>
//           <li>
//             <strong>Product feature</strong>. Some detail about your feature and
//             its benefit to your customer.
//           </li>
//           <li>
//             <strong>Product feature</strong>. Some detail about your feature and
//             its benefit to your customer.
//           </li>
//           <li>
//             <strong>Product feature</strong>. Some detail about your feature and
//             its benefit to your customer.
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }



import { redirect, Form, useLoaderData } from "react-router";
import { login } from "../../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData();

  return (
    <>
      <div className="page">
        {/* Navbar */}
        <header className="navbarWrapper">
          <nav className="navbar">
            <div className="navLeft">
              <div className="logo">Q</div>
              <span className="brandName">Qorix Currency Converter</span>
            </div>

            <ul className="navLinks">
              <li>
                <a href="https://qorix-currency-docs.softvenceomega.com/docs">Docs</a>
              </li>
              <li>
                <a href="https://qorix-currency-docs.softvenceomega.com/privacy-policy">Privacy Policy</a>
              </li>
              <li>
                <a href="https://qorix-currency-docs.softvenceomega.com/contact">Contact</a>
              </li>
            </ul>
          </nav>
        </header>

        <section className="hero">
          <div className="heroOverlay"></div>

          <div className="heroContent">
            <span className="badge">Shopify Localization Currency Converter</span>

            <h1 className="heading">Global Shopping & Auto Currency Converter.</h1>

            <p className="subheading">
              Enable global shopping with auto location detection and local currency switching.
            </p>

            {showForm && (
              <Form className="form" method="post" action="/auth/login">
                <label className="label">
                  <span className="labelTitle">Enter your Shopify store URL</span>
                  <input
                    className="input"
                    type="text"
                    name="shop"
                    placeholder="e.g. https://your-store.myshopify.com"
                    required
                  />
                  <span className="helperText">
                    Connect your Shopify store to start using Qorix Currency Converter.
                  </span>
                </label>

                <button className="button" type="submit">
                  Get Started
                </button>
              </Form>
            )}
          </div>
        </section>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html,
        body {
          width: 100%;
          min-height: 100%;
          scroll-behavior: smooth;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: #050f0d;
        }

        body {
          overflow-x: hidden;
        }

        .page {
          min-height: 100vh;
        }

        /* NAVBAR */
        .navbarWrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 18px 20px;
        }

        .navbar {
          max-width: 1180px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 22px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(33, 211, 185, 0.18);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.22);
        }

        .navLeft {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
          color: #050f0d;
          background: linear-gradient(135deg, #21d3b9, #3ef5de, #8ffff2);
          box-shadow: 0 8px 20px rgba(33, 211, 185, 0.38);
        }

        .brandName {
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        .navLinks {
          display: flex;
          align-items: center;
          gap: 28px;
          list-style: none;
        }

        .navLinks a {
          color: #e0fdf8;
          text-decoration: none;
          font-size: 0.96rem;
          font-weight: 600;
          transition: color 0.2s ease, opacity 0.2s ease;
          opacity: 0.88;
        }

        .navLinks a:hover {
          color: #21d3b9;
          opacity: 1;
        }

        /* HERO */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 20px 32px;
          overflow: hidden;
          background:
            radial-gradient(circle at top right, rgba(33, 211, 185, 0.28), transparent 28%),
            radial-gradient(circle at bottom left, rgba(62, 245, 222, 0.18), transparent 34%),
            radial-gradient(circle at center top, rgba(143, 255, 242, 0.1), transparent 40%),
            linear-gradient(135deg, #050f0d 0%, #082018 35%, #0d3028 70%, #104038 100%);
        }

        .heroOverlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(5, 15, 13, 0.15),
            rgba(5, 15, 13, 0.45)
          );
          z-index: 1;
        }

        .heroContent {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 900px;
          text-align: center;
          color: #ffffff;
        }

        .badge {
          display: inline-block;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(33, 211, 185, 0.12);
          color: #a8fff4;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 22px;
          border: 1px solid rgba(33, 211, 185, 0.22);
          backdrop-filter: blur(10px);
        }

        .heading {
          font-size: clamp(2.6rem, 6vw, 4.8rem);
          line-height: 1.05;
          font-weight: 800;
          margin-bottom: 22px;
          letter-spacing: -0.02em;
        }

        .subheading {
          font-size: 1.08rem;
          line-height: 1.9;
          color: #c0f5ee;
          max-width: 720px;
          margin: 0 auto 36px;
        }

        .form {
          max-width: 700px;
          margin: 0 auto;
          padding: 28px;
          background: rgba(33, 211, 185, 0.07);
          border: 1px solid rgba(33, 211, 185, 0.18);
          border-radius: 24px;
          backdrop-filter: blur(14px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.26);
        }

        .label {
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: left;
        }

        .labelTitle {
          font-size: 1rem;
          font-weight: 700;
          color: #e8fdfb;
        }

        .input {
          width: 100%;
          padding: 16px 18px;
          border-radius: 14px;
          border: 1px solid rgba(33, 211, 185, 0.22);
          background: rgba(255, 255, 255, 0.96);
          color: #050f0d;
          font-size: 1rem;
          outline: none;
          transition: all 0.2s ease;
        }

        .input:focus {
          border-color: #21d3b9;
          box-shadow: 0 0 0 4px rgba(33, 211, 185, 0.2);
        }

        .helperText {
          font-size: 0.92rem;
          color: #9af0e4;
        }

        .button {
          margin-top: 18px;
          width: 100%;
          padding: 15px 18px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #18b8a1, #21d3b9, #3ef5de);
          color: #04201a;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 12px 30px rgba(33, 211, 185, 0.32);
        }

        .button:hover {
          transform: translateY(-2px);
          opacity: 0.95;
        }

        @media (max-width: 768px) {
          .navbarWrapper {
            padding: 14px 14px;
          }

          .navbar {
            padding: 14px 16px;
            border-radius: 18px;
          }

          .brandName {
            font-size: 0.95rem;
          }

          .navLinks {
            gap: 14px;
          }

          .navLinks a {
            font-size: 0.86rem;
          }

          .hero {
            padding: 130px 16px 24px;
          }

          .heading {
            font-size: 2.4rem;
          }

          .subheading {
            font-size: 1rem;
          }

          .form {
            padding: 22px;
          }
        }

        @media (max-width: 560px) {
          .navbar {
            flex-direction: column;
            gap: 14px;
          }

          .navLinks {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}