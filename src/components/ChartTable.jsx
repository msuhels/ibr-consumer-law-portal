import React, { useState, useEffect } from 'react';
import experian_logo from "../images/experian.png";
import equifax_logo from "../images/equifax.png";
import trans_union_logo from "../images/trans_union.png";
import PieChart from "./PieChart"
import { Link } from 'react-router-dom';


function ChartTable({ processData, TransUnionSum, ExperianSum, EquifaxSum, userId }) {

    let [chartDataEquafax, setChatDataEquafax] = useState(null);
    let [chartDataExperian, setChatDataExperian] = useState(null);
    let [chartDataTransUnion, setChatDataTransUnion] = useState(null);

    const getColor = (val) => {
        let data = { color: '#EEEFF1', status: "Poor" }
        if (val > 0 && 580 > val) {
            data.color = '#e25655';
            data.status = "Poor";
        } else if (val > 579 && 670 > val) {
            data.color = '#eb8b24';
            data.status = "Fair";
        } else if (val > 669 && 740 > val) {
            data.color = '#f4cf4d';
            data.status = "Good";
        } else if (val > 739 && 800 > val) {
            data.color = '#1fd3c7';
            data.status = "Very Good";
        } else if (val > 799) {
            data.color = '#34a1fe';
            data.status = "Exceptional";
        }
        return data;

    }

    // const getScalValue = (val) => {
    //     let scalMainVal = 0;
    //     let scalMainPer = 0;
    //     let newValue = 0;
    //     let color = "#EEEFF1";
    //     let status= "Poor";
    //     if (580 > val) {
    //         scalMainPer = 0
    //         scalMainVal = 579;
    //         newValue = val
    //         color = '#e25655';
    //         status = "Poor";
    //     } else if (val > 579 && 670 > val) {
    //         scalMainPer = 100
    //         scalMainVal =  89;
    //         newValue = val - 580;
    //         color = '#eb8b24';
    //         status = "Fair";
    //     } else if (val > 669 && 740 > val) {
    //         scalMainPer = 200
    //         scalMainVal = 69;
    //         newValue = val - 670;
    //         color = '#f4cf4d';
    //         status = "Good";
    //     } else if (val > 739 && 800 > val) {
    //         scalMainPer = 300
    //         scalMainVal = 59 ;
    //         newValue = val - 740;
    //         color = '#1fd3c7';
    //         status = "Very Good";
    //     } else if (val > 799) {
    //         scalMainPer = 400
    //         newValue = val - 800;
    //         scalMainVal = 50;
    //         color = '#34a1fe';
    //         status = "Exceptional";
    //     }

    //     let per = (newValue * 100)/scalMainVal;
    //     let firstVal = per + scalMainPer;
    //     let secondVal = 500 - firstVal;

    //     return {firstVal,secondVal,color,status};
    // }
    const getScalValue = (val) => {
        let scalMainVal = 0;
        let scalMainPer = 0;
        let newValue = 0;
        let color = "#EEEFF1";
        let status = "Very Bad";

        if (val <= 599) {
            scalMainPer = 0;
            scalMainVal = 598;
            newValue = val;
            color = '#bc1f26';
            status = "Very Bad";
        } else if (val >= 600 && val <= 649) {
            scalMainPer = 100;
            scalMainVal = 49;
            newValue = val - 600;
            color = '#ef4723';
            status = "Poor";
        } else if (val >= 650 && val <= 699) {
            scalMainPer = 200;
            scalMainVal = 49;
            newValue = val - 650;
            color = '#f68e1f';
            status = "Fair";
        } else if (val >= 700 && val <= 749) {
            scalMainPer = 300;
            scalMainVal = 49;
            newValue = val - 700;
            color = '#fecc09';
            status = "Good";
        } else if (val >= 750 && val <= 799) {
            scalMainPer = 400;
            scalMainVal = 49;
            newValue = val - 750;
            color = '#7ebb42';
            status = "Very Good";
        } else if (val >= 800 && val <= 850) {
            scalMainPer = 500;
            scalMainVal = 50;
            newValue = val - 800;
            color = '#0f9246';
            status = "Excellent";
        }

        let per = (newValue * 100) / scalMainVal;
        let firstVal = per + scalMainPer;
        let secondVal = 600 - firstVal;

        return { firstVal, secondVal, color, status };
    }

    const charDataFun = () => {
        let equafaxVal = processData?.mergedValues?.ficoScores[0]?.Equifax ? processData?.mergedValues?.ficoScores[0]?.Equifax : 0;
        let equafaxData = getScalValue(Number(equafaxVal));
        let equafax = {
            datasets: [
                {
                    label: "Indice",
                    data: [equafaxData.firstVal, equafaxData.secondVal],
                    backgroundColor: [equafaxData.color, "#EEEFF1"],
                    display: true,
                    borderColor: "#D1D6DC",
                    spacing: 12,
                    borderWidth: 0,
                }
            ],
            status: equafaxData.status
        }
        setChatDataEquafax(equafax);

        let experianVal = processData?.mergedValues?.ficoScores[0]?.Experian ? processData?.mergedValues?.ficoScores[0]?.Experian : 0;
        let experianData = getScalValue(Number(experianVal));

        let experian = {
            datasets: [
                {
                    data: [experianData.firstVal, experianData.secondVal],
                    backgroundColor: [experianData.color, "#EEEFF1"],
                    display: true,
                    borderColor: "#D1D6DC",
                    spacing: 12,
                    borderWidth: 0
                }
            ],
            status: experianData.status
        }
        setChatDataExperian(experian);

        let transUnionVal = processData?.mergedValues?.ficoScores[0]?.TransUnion ? processData?.mergedValues?.ficoScores[0]?.TransUnion : 0;
        let transUnionData = getScalValue(Number(transUnionVal));
        let transUnion = {
            datasets: [
                {
                    data: [transUnionData.firstVal, transUnionData.secondVal],
                    backgroundColor: [transUnionData.color, "#EEEFF1"],
                    display: true,
                    borderColor: "#D1D6DC",
                    spacing: 12,
                    borderWidth: 0
                }
            ],
            status: transUnionData.status
        }
        setChatDataTransUnion(transUnion);
    }

    useEffect(() => {
        if (processData && processData?.mergedValues != undefined) {
            charDataFun();
        }
    }, [processData])

    return (
        <>
            {processData?.mergedValues != "" && processData?.mergedValues != undefined &&
                <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800  rounded-[20px] border border-slate-200 dark:border-slate-700">
                    <header className="px-5 py-4 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-[20px] rounded-tl-[20px]">
                        <h2 className="font-semibold text-3xl text-slate-100 dark:text-slate-100">Scores</h2>
                    </header>
                    <div className='grid md:grid-cols-3 lg:grid-cols-3 gap-3'>
                        <div className='my-8'>
                            <div className="font-semibold flex justify-center"> <img src={equifax_logo} width={100} alt="logo" /></div>
                            {chartDataEquafax && <PieChart
                                data={chartDataEquafax}
                                score={processData?.mergedValues?.ficoScores[0]?.Equifax ? processData?.mergedValues?.ficoScores[0]?.Equifax : 0}
                            />}
                            <div className='flex justify-center'>
                                <div>
                                    <div className='flex justify-center'>
                                        <p className='text-5xl text-center '>{processData?.mergedValues?.ficoScores[0]?.Equifax ? processData?.mergedValues?.ficoScores[0]?.Equifax : 0}</p>
                                        {EquifaxSum &&
                                            <p className='font-medium text-center flex' >
                                                <>
                                                    {EquifaxSum >= 0 ? (
                                                        <> <svg xmlns="http://www.w3.org/2000/svg" style={{ color: "green" }} class="icon icon-tabler icon-tabler-arrow-badge-up-filled" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ff0000" fill="#ff0000" stroke-linecap="round" stroke-linejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                            <path d="M11.375 6.22l-5 4a1 1 0 0 0 -.375 .78v6l.006 .112a1 1 0 0 0 1.619 .669l4.375 -3.501l4.375 3.5a1 1 0 0 0 1.625 -.78v-6a1 1 0 0 0 -.375 -.78l-5 -4a1 1 0 0 0 -1.25 0z" stroke-width="0" fill="currentColor" />
                                                        </svg>
                                                            <span>{EquifaxSum}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg" style={{ color: "red" }} class="icon icon-tabler icon-tabler-arrow-badge-down-filled" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                <path d="M16.375 6.22l-4.375 3.498l-4.375 -3.5a1 1 0 0 0 -1.625 .782v6a1 1 0 0 0 .375 .78l5 4a1 1 0 0 0 1.25 0l5 -4a1 1 0 0 0 .375 -.78v-6a1 1 0 0 0 -1.625 -.78z" stroke-width="0" fill="currentColor" />
                                                            </svg>
                                                            <span>{EquifaxSum.toString().slice(1)}</span>
                                                        </>
                                                    )}
                                                </>
                                            </p>
                                        }

                                    </div>
                                </div>

                            </div>
                            <p className='font-thin text-sm text-center'>{chartDataExperian?.status}</p>

                            <div className='text-center mt-8'>
                                {processData?.mergedValues?.length > 0 &&
                                    <Link to={`/response-pdf/${userId}?did=${processData?.mergedValues?.id}`} className='bg-gray-300 py-1.5 px-4 rounded-full'>View Report</Link>
                                }
                            </div>
                        </div>

                        <div className='my-8'>
                            <div className="font-semibold flex justify-center"> <img src={experian_logo} width={100} alt="logo" /></div>
                            {chartDataExperian && <PieChart
                                data={chartDataExperian}
                                score={processData?.mergedValues?.ficoScores[0]?.Experian ? processData?.mergedValues?.ficoScores[0]?.Experian : 0}
                            />}
                            <div className='flex justify-center'>
                                <div className='flex justify-center' >
                                    <p className='text-5xl text-center'>{processData?.mergedValues?.ficoScores[0]?.Experian ? processData?.mergedValues?.ficoScores[0]?.Experian : 0}</p>
                                    {ExperianSum &&
                                        <p className='font-medium text-center flex' >
                                            <>
                                                {ExperianSum >= 0 ? (
                                                    <> <svg xmlns="http://www.w3.org/2000/svg" style={{ color: "green" }} class="icon icon-tabler icon-tabler-arrow-badge-up-filled" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ff0000" fill="#ff0000" stroke-linecap="round" stroke-linejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M11.375 6.22l-5 4a1 1 0 0 0 -.375 .78v6l.006 .112a1 1 0 0 0 1.619 .669l4.375 -3.501l4.375 3.5a1 1 0 0 0 1.625 -.78v-6a1 1 0 0 0 -.375 -.78l-5 -4a1 1 0 0 0 -1.25 0z" stroke-width="0" fill="currentColor" />
                                                    </svg>
                                                        <span>{ExperianSum}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" style={{ color: "red" }} class="icon icon-tabler icon-tabler-arrow-badge-down-filled" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                            <path d="M16.375 6.22l-4.375 3.498l-4.375 -3.5a1 1 0 0 0 -1.625 .782v6a1 1 0 0 0 .375 .78l5 4a1 1 0 0 0 1.25 0l5 -4a1 1 0 0 0 .375 -.78v-6a1 1 0 0 0 -1.625 -.78z" stroke-width="0" fill="currentColor" />
                                                        </svg>
                                                        <span>{ExperianSum.toString().slice(1)}</span>
                                                    </>
                                                )}
                                            </>
                                        </p>
                                    }
                                </div>
                            </div>
                            <p className='font-thin text-sm text-center'>{chartDataExperian?.status}</p>

                            <div className='text-center mt-8'>
                                {processData?.mergedValues?.length > 0 &&
                                    <Link to={`/response-pdf/${userId}?did=${processData?.mergedValues?.id}`} className='bg-gray-300 py-1.5 px-4 rounded-full'>View Report</Link>
                                }
                            </div>
                        </div>

                        <div className='my-8'>
                            <div className="font-semibold flex justify-center"> <img src={trans_union_logo} width={100} alt="logo" /></div>
                            {chartDataTransUnion && <PieChart
                                data={chartDataTransUnion}
                                score={processData?.mergedValues?.ficoScores[0]?.TransUnion ? processData?.mergedValues?.ficoScores[0]?.TransUnion : 0}
                            />}
                            <div className='flex justify-center'>
                                <div className='flex justify-center'> 
                                    <p className='text-5xl text-center'>{processData?.mergedValues?.ficoScores[0]?.TransUnion ? processData?.mergedValues?.ficoScores[0]?.TransUnion : 0}</p>
                                    {TransUnionSum &&
                                        <p className='font-medium text-center flex' >
                                            <>
                                                {TransUnionSum >= 0 ? (
                                                    <> <svg xmlns="http://www.w3.org/2000/svg" style={{ color: "green" }} class="icon icon-tabler icon-tabler-arrow-badge-up-filled" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ff0000" fill="#ff0000" stroke-linecap="round" stroke-linejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M11.375 6.22l-5 4a1 1 0 0 0 -.375 .78v6l.006 .112a1 1 0 0 0 1.619 .669l4.375 -3.501l4.375 3.5a1 1 0 0 0 1.625 -.78v-6a1 1 0 0 0 -.375 -.78l-5 -4a1 1 0 0 0 -1.25 0z" stroke-width="0" fill="currentColor" />
                                                    </svg>
                                                        <span>{TransUnionSum}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" style={{ color: "red" }} class="icon icon-tabler icon-tabler-arrow-badge-down-filled" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                            <path d="M16.375 6.22l-4.375 3.498l-4.375 -3.5a1 1 0 0 0 -1.625 .782v6a1 1 0 0 0 .375 .78l5 4a1 1 0 0 0 1.25 0l5 -4a1 1 0 0 0 .375 -.78v-6a1 1 0 0 0 -1.625 -.78z" stroke-width="0" fill="currentColor" />
                                                        </svg>
                                                        <span>{TransUnionSum.toString().slice(1)}</span>
                                                    </>
                                                )}
                                            </>
                                        </p>
                                    }
                                </div>
                            </div>
                            <p className='font-thin text-sm text-center'>{chartDataExperian?.status}</p>
                            <div className='text-center mt-8'>
                                {processData?.mergedValues?.length > 0 &&
                                    <Link to={`/response-pdf/${userId}?did=${processData?.mergedValues?.id}`} className='bg-gray-300 py-1.5 px-4 rounded-full'>View Report</Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default ChartTable;