import React, { useEffect, useState, useRef } from 'react';
import Cookies from "js-cookie";
import site_logo from "../images/logo-light-mode.png";
import white_site_logo from "../images/logo-dark-mode.png";

const CompanyLogo = ({ user, userData }) => {
    let getCompanyLogo = Cookies.get("company_logo");

    return (
        <>
            {((user?.role === "agent") &&
                <a href="https://www.consumerlawdispute.ai/">
                    {user && (user?.company_logo || getCompanyLogo) ? (
                        <img width={150} height={110} src={getCompanyLogo ? getCompanyLogo : user?.company_logo} className="py-2" style={{ maxHeight: "60px", backgroundColor: "" }}></img>
                    ) :
                        (<img width={150} height={110} src={site_logo}></img>
                        )}
                </a>
            )}
            {(user && (user?.role === "agency_agent" || user?.role === "client") &&
                (getCompanyLogo ?
                    <img width={170} height={120} src={getCompanyLogo} className="py-2" style={{ maxHeight: "60px", backgroundColor: "" }}></img>
                    :
                    <a href="https://www.consumerlawdispute.ai/">
                        {user?.role === "client" ? (
                            <img width={150} height={110} src={white_site_logo} alt="White Site Logo" />
                        ) : (
                            <img width={150} height={110} src={site_logo} alt="Site Logo" />
                        )}
                    </a>

                )
            )}
        </>
    )
}

export default CompanyLogo