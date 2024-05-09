import { Link } from 'react-router-dom'

function Home() {
    return (
        <div>
            <h1>Home</h1>
            <p>Welcome to the home page</p>
            <Link to="/botornot">Bot or Not</Link>
        </div>
    )
}

export default Home
