import { Link, useMatch, useResolvedPath } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        <div className="logo-container">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>PDF Extractor</span>
        </div>
      </Link>
      <ul className="nav-links">
        <CustomLink to="/">Home</CustomLink>
        <CustomLink to="/pricing">Learn More</CustomLink>
        <CustomLink to="/about">About</CustomLink>
      </ul>

      {/* Mobile menu button */}
      <div className="mobile-menu-button">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Inline styles */}
      <style jsx>{`
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 0.75rem 2rem;
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .site-title {
          text-decoration: none;
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          transition: color 0.3s ease;
        }

        .site-title:hover {
          color: #4776E6;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 24px;
          height: 24px;
          color: #4776E6;
        }

        .nav-links {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 1.5rem;
        }

        .nav-links li {
          padding: 0;
        }

        .nav-links a {
          text-decoration: none;
          color: #4a5568;
          font-weight: 500;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-links a:hover {
          color: #4776E6;
          background-color: rgba(71, 118, 230, 0.1);
        }

        .nav-links li.active a {
          color: #4776E6;
          font-weight: 600;
        }

        .nav-links li.active a::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
          border-radius: 3px;
        }

        .mobile-menu-button {
          display: none;
          cursor: pointer;
          width: 24px;
          height: 24px;
          color: #4a5568;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .nav {
            padding: 0.75rem 1.25rem;
          }

          .site-title {
            font-size: 1.25rem;
          }

          .nav-links {
            display: none; /* Hide nav links on mobile by default */
          }

          .mobile-menu-button {
            display: block;
          }

          /* When menu is active - you would add this class with JavaScript */
          .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 1rem;
            gap: 1rem;
          }
        }
      `}</style>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}