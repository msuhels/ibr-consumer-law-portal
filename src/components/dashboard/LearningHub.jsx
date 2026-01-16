import { Link } from "react-router-dom"

function LearningHub() {
    return (
        <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-2xl border border-slate-200 dark:border-slate-700">
            <header className="px-5 py-4 border-b-4 bg-[#080D18] border-gray-400 dark:border-slate-400 rounded-tr-2xl rounded-tl-2xl">
                <h2 className="font-semibold text-3xl text-slate-100 dark:text-slate-100">Learning Hub</h2>
            </header>
            <div className="p-3">
                <div className="overflow-x-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2">
                        <div className="w-full">
                            <div className="w-full h-[200px] py-4">
                                <iframe
                                    src="https://www.youtube.com/embed/bMfSF9Xubnw"
                                    className="w-full h-full rounded-[20px]"
                                    frameBorder="0"
                                    allowFullScreen
                                    uk-responsive
                                    uk-video="automute: true"
                                ></iframe>
                            </div>
                            <div className="">
                                <p className='text-xl  text-[#080D18] font-bold'>Streamline your credit report import process!</p>
                                <div className='my-3'>
                                    <Link to="/learning-hub" className=' my-1 border-b border-black border-solid '>View More</Link>
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="w-full h-[200px] py-4">
                                <iframe
                                    src="https://www.youtube.com/embed/tnLYtRDJCwA"
                                    className="w-full h-full rounded-[20px]"
                                    frameBorder="0"
                                    allowFullScreen
                                    uk-responsive
                                    uk-video="automute: true"
                                ></iframe>
                            </div>
                            <div className="">
                                <p className='text-xl  text-[#080D18] font-bold'>Unlocking the Power of AI in Consumer Law</p>
                                <div className='my-3'>
                                    <Link to="/learning-hub" className=' my-1 border-b border-black border-solid '>View More</Link>
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="w-full h-[200px] py-4">
                                <iframe
                                    src="https://www.youtube.com/embed/h3z_-xx4fa8"
                                    className="w-full h-full rounded-[20px]"
                                    frameBorder="0"
                                    allowFullScreen
                                    uk-responsive
                                    uk-video="automute: true"
                                ></iframe>
                            </div>
                            <div className="">
                                <p className='text-xl  text-[#080D18] font-bold'>How to send dispute letters using ConsumerLawDispute.ai</p>
                                <div className='my-3'>
                                    <Link to="/learning-hub" className=' my-1 border-b border-black border-solid '>View More</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LearningHub