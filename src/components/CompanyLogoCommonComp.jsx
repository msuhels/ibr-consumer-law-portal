import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making API requests
import { toast } from 'react-toastify';
import AuthImage from '../images/forgetPage.png';
import AuthDecoration from '../images/auth-decoration.png';
import logo from '../images/consumer_logo.png';
import { useNavigate } from "react-router-dom";
import CompanyLogo from '../components/CompanyLogo';
import AuthCopmanyImage from '../images/forgetPage-company-img.png';
import { BackendUrl, FrontendUrl } from "../Config.js";
import Cookies from "js-cookie";

const CompanyLogoCommonComp = ({subId}) => {
    let getCompanyLogo = Cookies.get("company_logo");
    const [companyLogo, setCompanyLogo] = useState(null);
    const [loadingWait, setLoadingWait] = useState(false);
    const [mainUserID, setMainUserID] = useState(null);

    const setLoading = () => {
        setLoadingWait(true)
    }

    useEffect(() => {
        setTimeout(() => {
            setLoading();
        }, 5000);
    }, []);

    return (
        <>
            {subId &&
                (getCompanyLogo !== "undefined" ?
                    <img width={170} height={120} src={getCompanyLogo} className="py-2" style={{ maxHeight: "60px", backgroundColor: "" }}></img>
                    :
                    (loadingWait ?
                        <img width={200} src={logo}></img> : ''
                    )
                )
            }
        </>
    )
}

export default CompanyLogoCommonComp;