import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to Gov Price Checker</h1>
      <p>This platform helps prevent overpricing in government procurement.</p>

      <nav>
        <Link to="/upload">Upload Prices</Link> |{" "}
        <Link to="/compare">Compare Prices</Link>
      </nav>
    </div>
  );
}

export default Home;