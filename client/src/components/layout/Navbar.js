import React, { Fragment} from 'react'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import { logout} from '../../actions/auth'


//Destructuing : Need only isAuthenticated and loading before logout option
const Navbar = ({ auth : {isAuthenticated, loading}, logout }) => {
  
  const authLinks = (
    <ul>
        <li><a onClick={logout} href='#!'> 
        <i className="fas fa-sign-out-alt"></i>
        Logout</a></li>
      </ul>
  )

  const guestLinks = (
    <ul>
        <li><a href="#!" className="fas fa-user"> Developers</a></li>
        <li><Link to="/register" className="fas fa-clipboard"> Register</Link></li>
        <li><Link to="/login" className="fas fa-sign-in-alt"> Login</Link></li>
      </ul>
  )
  
  return (
      <nav className="navbar bg-dark">
      <h1>
        {/* Proxy already set in package.json */}
        <Link to ="/" className="fas fa-code">DevConnector</Link>
      </h1>
        { !loading && (<Fragment>{ isAuthenticated ? authLinks : guestLinks }</Fragment>) }
    </nav>
    )
}

Navbar.propTypes = {
  logout : PropTypes.func.isRequired,
  auth : PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, {logout})(Navbar)