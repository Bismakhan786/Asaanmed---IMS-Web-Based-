import React from 'react';
import './Header.css'
import { Link } from 'react-router-dom';

function Header() {
    return(
        <div className='Header'>
            <p>ASAANMED Ltd.</p>
            <div>
                <Link to={'/about'}>About</Link>
                <Link to={'/contact'}>Contact</Link>
                <Link to={'/login'}>Login</Link>
            </div>
        </div>
    )
}

export default Header