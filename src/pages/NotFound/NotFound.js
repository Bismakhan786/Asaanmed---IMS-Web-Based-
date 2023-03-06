import React from 'react'
import { Link } from 'react-router-dom'
import "./NotFound.css"

const NotFound = () => {
    return(
        <div className='notfound'>
            <div>
                <h1>🥲</h1>
                <h1 className='heading'>Page Not Found</h1>
                <p>Requested url cannot be reached</p>
                <Link to={"/"}>
                <p>Go to Home Page</p>
                </Link>
            </div>
        </div>
    )
}

export default NotFound