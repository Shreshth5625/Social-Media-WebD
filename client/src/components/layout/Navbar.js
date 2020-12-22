import React from 'react'
import {Link} from 'react-router-dom';

const Navbar = () => {
    return (
      <nav className="navbar bg-dark">
      <h1>
        <Link to ="/" className="fas fa-code">DevConnector</Link>
      </h1>
      <ul>
        <li><a href="!#" className="fas fa-user"> Developers</a></li>
        <li><Link to="/register" className="fas fa-clipboard"> Register</Link></li>
        <li><Link to="/login" className="fas fa-sign-in-alt"> Login</Link></li>
      </ul>
    </nav>
    )
}

export default Navbar