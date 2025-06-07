import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <nav style={{
      background: '#282c34',
      padding: '10px',
      display: 'flex',
      gap: '20px'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
      <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link>
      <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link>
    </nav>
  );
}
