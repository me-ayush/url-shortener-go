import React from 'react'
import './style.scss'

const Loader = () => {
    return (
        <>
            <div id="loader">
                {/* <div className="solid-loading"></div> */}
                <div className="cssload-container">
                    <div className="cssload-whirlpool"></div>
                </div>
            </div>
        </>
    )
}

export default Loader