import React from 'react'
import AgencyHeader from '../partials/AgencyHeader'
import SubNavbar from '../components/SubNavbar'
import WelcomeBanner from '../partials/dashboard/WelcomeBanner'
import Footer from '../partials/Footer'
const ClientNewPage = () => {
  return (
    <>
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <AgencyHeader/>
      <main className="grow mb-16 text-[#080D18]">
        <SubNavbar/>
        <div className='py-8 mx-4 sm:mx-8 border-b border-[#DDE0E3]'> 
            <div className='text-3xl'><span className='font-bold'>Clients{" "}</span></div>
            <div className='py-4'>
                <WelcomeBanner/>
            </div>
        </div>
        <div className='mx-4 sm:mx-8 border-b border-[#DDE0E3] py-6 text-[#080D18]'>
            <div className='text-[28px] font-semibold'>Quick Start</div>
            <div className='pt-8 grid grid-cols-1 lg:grid-cols-3 gap-4'>
                <div className='flex p-1 bg-[#F8F9F9] rounded'>
                    <div className='m-5 px-7 py-3 custom-bg flex items-center'>1</div>
                    <div className='sm:my-5'>
                        <h3 className='text-[24px] font-bold'>Add new client</h3>
                        <p className='text-xl'>Sign up a new client and add to database</p>
                    </div>
                </div>
                <div className='flex p-1 bg-[#F8F9F9] rounded'>
                    <div className='m-5 px-6 py-3 custom-bg flex items-center'>2</div>
                    <div className='sm:my-5'>
                        <h3 className='text-[24px] font-bold'>Select an existing client</h3>
                        <p className='text-xl'>Work with an existing client</p>
                    </div>
                </div>
                <div className='flex p-1 bg-[#F8F9F9] rounded'>
                <div className='m-5 px-6 py-3 custom-bg flex items-center'>3</div>
                    <div className='sm:my-5'>
                        <h3 className='text-[24px] font-bold'>Run credit dispute wizard</h3>
                        <p className='text-xl'>Order reports, review reports , correct errors</p>
                    </div>
                </div>
            </div>
        </div>

        <div className='pb-8 mx-4 sm:mx-8 border-b border-[#DDE0E3] sm:flex gap-8'>
            <div className='border-3 border-[#F8F9F9] px-8 pb-8 mt-8 sm:flex gap-8 '>
                {/* first Box */}
               <div className='mt-8'>
                <div className='flex items-center'>
                    <div className='pr-4'>
                    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.4565 8.30813C21.3344 8.1913 21.1719 8.1261 21.0029 8.1261C20.8338 8.1261 20.6713 8.1913 20.5492 8.30813L5.44727 22.735C5.38313 22.7963 5.3321 22.87 5.29728 22.9517C5.26245 23.0333 5.24455 23.1212 5.24465 23.2099L5.24219 36.75C5.24219 37.4462 5.51875 38.1139 6.01103 38.6062C6.50332 39.0984 7.17099 39.375 7.86719 39.375H15.7504C16.0985 39.375 16.4323 39.2367 16.6785 38.9906C16.9246 38.7444 17.0629 38.4106 17.0629 38.0625V26.9063C17.0629 26.7322 17.132 26.5653 17.2551 26.4422C17.3782 26.3191 17.5451 26.25 17.7191 26.25H24.2816C24.4557 26.25 24.6226 26.3191 24.7457 26.4422C24.8688 26.5653 24.9379 26.7322 24.9379 26.9063V38.0625C24.9379 38.4106 25.0762 38.7444 25.3223 38.9906C25.5685 39.2367 25.9023 39.375 26.2504 39.375H34.1303C34.8265 39.375 35.4942 39.0984 35.9865 38.6062C36.4788 38.1139 36.7553 37.4462 36.7553 36.75V23.2099C36.7554 23.1212 36.7375 23.0333 36.7027 22.9517C36.6679 22.87 36.6168 22.7963 36.5527 22.735L21.4565 8.30813Z" fill="black"/>
                    <path d="M40.27 20.0279L34.134 14.1578V5.25C34.134 4.9019 33.9958 4.56806 33.7496 4.32192C33.5035 4.07578 33.1696 3.9375 32.8215 3.9375H28.8841C28.536 3.9375 28.2021 4.07578 27.956 4.32192C27.7098 4.56806 27.5716 4.9019 27.5716 5.25V7.875L22.8203 3.33211C22.3757 2.88258 21.7145 2.625 21 2.625C20.288 2.625 19.6285 2.88258 19.1839 3.33293L1.73581 20.0263C1.22558 20.5185 1.16159 21.3281 1.62589 21.8613C1.74248 21.9959 1.88524 22.1054 2.04548 22.183C2.20572 22.2607 2.38008 22.3049 2.55796 22.3131C2.73584 22.3212 2.91352 22.2931 3.08018 22.2304C3.24683 22.1676 3.39899 22.0717 3.52737 21.9483L20.5489 5.68313C20.671 5.5663 20.8335 5.50109 21.0025 5.50109C21.1715 5.50109 21.334 5.5663 21.4561 5.68313L38.4792 21.9483C38.73 22.1888 39.0659 22.32 39.4132 22.3132C39.7606 22.3065 40.0911 22.1622 40.3323 21.9122C40.836 21.3905 40.7942 20.5291 40.27 20.0279Z" fill="black"/>
                    </svg>
                    </div>
                    <div className=''>
                        <h3 className='text-[24px] font-bold'>My Company</h3>
                        <p className='text-xl'>Configure users, permissions and billings</p>
                    </div>
                </div>
                <div className='flex items-center py-8'>
                    <div className='pr-4'>
                    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.4565 8.30813C21.3344 8.1913 21.1719 8.1261 21.0029 8.1261C20.8338 8.1261 20.6713 8.1913 20.5492 8.30813L5.44727 22.735C5.38313 22.7963 5.3321 22.87 5.29728 22.9517C5.26245 23.0333 5.24455 23.1212 5.24465 23.2099L5.24219 36.75C5.24219 37.4462 5.51875 38.1139 6.01103 38.6062C6.50332 39.0984 7.17099 39.375 7.86719 39.375H15.7504C16.0985 39.375 16.4323 39.2367 16.6785 38.9906C16.9246 38.7444 17.0629 38.4106 17.0629 38.0625V26.9063C17.0629 26.7322 17.132 26.5653 17.2551 26.4422C17.3782 26.3191 17.5451 26.25 17.7191 26.25H24.2816C24.4557 26.25 24.6226 26.3191 24.7457 26.4422C24.8688 26.5653 24.9379 26.7322 24.9379 26.9063V38.0625C24.9379 38.4106 25.0762 38.7444 25.3223 38.9906C25.5685 39.2367 25.9023 39.375 26.2504 39.375H34.1303C34.8265 39.375 35.4942 39.0984 35.9865 38.6062C36.4788 38.1139 36.7553 37.4462 36.7553 36.75V23.2099C36.7554 23.1212 36.7375 23.0333 36.7027 22.9517C36.6679 22.87 36.6168 22.7963 36.5527 22.735L21.4565 8.30813Z" fill="black"/>
                    <path d="M40.27 20.0279L34.134 14.1578V5.25C34.134 4.9019 33.9958 4.56806 33.7496 4.32192C33.5035 4.07578 33.1696 3.9375 32.8215 3.9375H28.8841C28.536 3.9375 28.2021 4.07578 27.956 4.32192C27.7098 4.56806 27.5716 4.9019 27.5716 5.25V7.875L22.8203 3.33211C22.3757 2.88258 21.7145 2.625 21 2.625C20.288 2.625 19.6285 2.88258 19.1839 3.33293L1.73581 20.0263C1.22558 20.5185 1.16159 21.3281 1.62589 21.8613C1.74248 21.9959 1.88524 22.1054 2.04548 22.183C2.20572 22.2607 2.38008 22.3049 2.55796 22.3131C2.73584 22.3212 2.91352 22.2931 3.08018 22.2304C3.24683 22.1676 3.39899 22.0717 3.52737 21.9483L20.5489 5.68313C20.671 5.5663 20.8335 5.50109 21.0025 5.50109C21.1715 5.50109 21.334 5.5663 21.4561 5.68313L38.4792 21.9483C38.73 22.1888 39.0659 22.32 39.4132 22.3132C39.7606 22.3065 40.0911 22.1622 40.3323 21.9122C40.836 21.3905 40.7942 20.5291 40.27 20.0279Z" fill="black"/>
                    </svg>
                    </div>
                    <div className=''>
                        <h3 className='text-[24px] font-bold'>Get consumer law secrets in a Box</h3>
                        <p className='text-xl'>Configure users, permissions and billings</p>
                    </div>
                </div>
                <div className='flex items-center'>
                    <div className='pr-4'>
                    <svg width="42" height="42" viewBox="0 0 42 42" className='relative top-[-20px]' fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.4565 8.30813C21.3344 8.1913 21.1719 8.1261 21.0029 8.1261C20.8338 8.1261 20.6713 8.1913 20.5492 8.30813L5.44727 22.735C5.38313 22.7963 5.3321 22.87 5.29728 22.9517C5.26245 23.0333 5.24455 23.1212 5.24465 23.2099L5.24219 36.75C5.24219 37.4462 5.51875 38.1139 6.01103 38.6062C6.50332 39.0984 7.17099 39.375 7.86719 39.375H15.7504C16.0985 39.375 16.4323 39.2367 16.6785 38.9906C16.9246 38.7444 17.0629 38.4106 17.0629 38.0625V26.9063C17.0629 26.7322 17.132 26.5653 17.2551 26.4422C17.3782 26.3191 17.5451 26.25 17.7191 26.25H24.2816C24.4557 26.25 24.6226 26.3191 24.7457 26.4422C24.8688 26.5653 24.9379 26.7322 24.9379 26.9063V38.0625C24.9379 38.4106 25.0762 38.7444 25.3223 38.9906C25.5685 39.2367 25.9023 39.375 26.2504 39.375H34.1303C34.8265 39.375 35.4942 39.0984 35.9865 38.6062C36.4788 38.1139 36.7553 37.4462 36.7553 36.75V23.2099C36.7554 23.1212 36.7375 23.0333 36.7027 22.9517C36.6679 22.87 36.6168 22.7963 36.5527 22.735L21.4565 8.30813Z" fill="black"/>
                    <path d="M40.27 20.0279L34.134 14.1578V5.25C34.134 4.9019 33.9958 4.56806 33.7496 4.32192C33.5035 4.07578 33.1696 3.9375 32.8215 3.9375H28.8841C28.536 3.9375 28.2021 4.07578 27.956 4.32192C27.7098 4.56806 27.5716 4.9019 27.5716 5.25V7.875L22.8203 3.33211C22.3757 2.88258 21.7145 2.625 21 2.625C20.288 2.625 19.6285 2.88258 19.1839 3.33293L1.73581 20.0263C1.22558 20.5185 1.16159 21.3281 1.62589 21.8613C1.74248 21.9959 1.88524 22.1054 2.04548 22.183C2.20572 22.2607 2.38008 22.3049 2.55796 22.3131C2.73584 22.3212 2.91352 22.2931 3.08018 22.2304C3.24683 22.1676 3.39899 22.0717 3.52737 21.9483L20.5489 5.68313C20.671 5.5663 20.8335 5.50109 21.0025 5.50109C21.1715 5.50109 21.334 5.5663 21.4561 5.68313L38.4792 21.9483C38.73 22.1888 39.0659 22.32 39.4132 22.3132C39.7606 22.3065 40.0911 22.1622 40.3323 21.9122C40.836 21.3905 40.7942 20.5291 40.27 20.0279Z" fill="black"/>
                    </svg>
                    </div>
                    <div className=''>
                        <h3 className='text-[24px] font-bold'>Free live software classes,<br/>Free videos and resoucres</h3>
                        <p className='text-xl'>Configure users, permissions and billings</p>
                    </div>
                </div>
               </div>
                {/* second box */}
               <div className='mt-8'>
               <div className='flex items-center'>
                    <div className='pr-4'>
                    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.4565 8.30813C21.3344 8.1913 21.1719 8.1261 21.0029 8.1261C20.8338 8.1261 20.6713 8.1913 20.5492 8.30813L5.44727 22.735C5.38313 22.7963 5.3321 22.87 5.29728 22.9517C5.26245 23.0333 5.24455 23.1212 5.24465 23.2099L5.24219 36.75C5.24219 37.4462 5.51875 38.1139 6.01103 38.6062C6.50332 39.0984 7.17099 39.375 7.86719 39.375H15.7504C16.0985 39.375 16.4323 39.2367 16.6785 38.9906C16.9246 38.7444 17.0629 38.4106 17.0629 38.0625V26.9063C17.0629 26.7322 17.132 26.5653 17.2551 26.4422C17.3782 26.3191 17.5451 26.25 17.7191 26.25H24.2816C24.4557 26.25 24.6226 26.3191 24.7457 26.4422C24.8688 26.5653 24.9379 26.7322 24.9379 26.9063V38.0625C24.9379 38.4106 25.0762 38.7444 25.3223 38.9906C25.5685 39.2367 25.9023 39.375 26.2504 39.375H34.1303C34.8265 39.375 35.4942 39.0984 35.9865 38.6062C36.4788 38.1139 36.7553 37.4462 36.7553 36.75V23.2099C36.7554 23.1212 36.7375 23.0333 36.7027 22.9517C36.6679 22.87 36.6168 22.7963 36.5527 22.735L21.4565 8.30813Z" fill="black"/>
                    <path d="M40.27 20.0279L34.134 14.1578V5.25C34.134 4.9019 33.9958 4.56806 33.7496 4.32192C33.5035 4.07578 33.1696 3.9375 32.8215 3.9375H28.8841C28.536 3.9375 28.2021 4.07578 27.956 4.32192C27.7098 4.56806 27.5716 4.9019 27.5716 5.25V7.875L22.8203 3.33211C22.3757 2.88258 21.7145 2.625 21 2.625C20.288 2.625 19.6285 2.88258 19.1839 3.33293L1.73581 20.0263C1.22558 20.5185 1.16159 21.3281 1.62589 21.8613C1.74248 21.9959 1.88524 22.1054 2.04548 22.183C2.20572 22.2607 2.38008 22.3049 2.55796 22.3131C2.73584 22.3212 2.91352 22.2931 3.08018 22.2304C3.24683 22.1676 3.39899 22.0717 3.52737 21.9483L20.5489 5.68313C20.671 5.5663 20.8335 5.50109 21.0025 5.50109C21.1715 5.50109 21.334 5.5663 21.4561 5.68313L38.4792 21.9483C38.73 22.1888 39.0659 22.32 39.4132 22.3132C39.7606 22.3065 40.0911 22.1622 40.3323 21.9122C40.836 21.3905 40.7942 20.5291 40.27 20.0279Z" fill="black"/>
                    </svg>
                    </div>
                    <div className=''>
                        <h3 className='text-[24px] font-bold'>Enroll in Consumer Law Secrets University</h3>
                        <p className='text-xl'>Accept credit card payments from clients</p>
                    </div>
                </div>
                <div className='flex items-center py-8'>
                    <div className='pr-4'>
                    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.4565 8.30813C21.3344 8.1913 21.1719 8.1261 21.0029 8.1261C20.8338 8.1261 20.6713 8.1913 20.5492 8.30813L5.44727 22.735C5.38313 22.7963 5.3321 22.87 5.29728 22.9517C5.26245 23.0333 5.24455 23.1212 5.24465 23.2099L5.24219 36.75C5.24219 37.4462 5.51875 38.1139 6.01103 38.6062C6.50332 39.0984 7.17099 39.375 7.86719 39.375H15.7504C16.0985 39.375 16.4323 39.2367 16.6785 38.9906C16.9246 38.7444 17.0629 38.4106 17.0629 38.0625V26.9063C17.0629 26.7322 17.132 26.5653 17.2551 26.4422C17.3782 26.3191 17.5451 26.25 17.7191 26.25H24.2816C24.4557 26.25 24.6226 26.3191 24.7457 26.4422C24.8688 26.5653 24.9379 26.7322 24.9379 26.9063V38.0625C24.9379 38.4106 25.0762 38.7444 25.3223 38.9906C25.5685 39.2367 25.9023 39.375 26.2504 39.375H34.1303C34.8265 39.375 35.4942 39.0984 35.9865 38.6062C36.4788 38.1139 36.7553 37.4462 36.7553 36.75V23.2099C36.7554 23.1212 36.7375 23.0333 36.7027 22.9517C36.6679 22.87 36.6168 22.7963 36.5527 22.735L21.4565 8.30813Z" fill="black"/>
                    <path d="M40.27 20.0279L34.134 14.1578V5.25C34.134 4.9019 33.9958 4.56806 33.7496 4.32192C33.5035 4.07578 33.1696 3.9375 32.8215 3.9375H28.8841C28.536 3.9375 28.2021 4.07578 27.956 4.32192C27.7098 4.56806 27.5716 4.9019 27.5716 5.25V7.875L22.8203 3.33211C22.3757 2.88258 21.7145 2.625 21 2.625C20.288 2.625 19.6285 2.88258 19.1839 3.33293L1.73581 20.0263C1.22558 20.5185 1.16159 21.3281 1.62589 21.8613C1.74248 21.9959 1.88524 22.1054 2.04548 22.183C2.20572 22.2607 2.38008 22.3049 2.55796 22.3131C2.73584 22.3212 2.91352 22.2931 3.08018 22.2304C3.24683 22.1676 3.39899 22.0717 3.52737 21.9483L20.5489 5.68313C20.671 5.5663 20.8335 5.50109 21.0025 5.50109C21.1715 5.50109 21.334 5.5663 21.4561 5.68313L38.4792 21.9483C38.73 22.1888 39.0659 22.32 39.4132 22.3132C39.7606 22.3065 40.0911 22.1622 40.3323 21.9122C40.836 21.3905 40.7942 20.5291 40.27 20.0279Z" fill="black"/>
                    </svg>
                    </div>
                    <div className=''>
                        <h3 className='text-[24px] font-bold'>Contacts</h3>
                        <p className='text-xl'>Configure users, permissions and billings</p>
                    </div>
                </div>
                {/* <div className='flex items-center'>
                    <div className='pr-4'>
                    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.4565 8.30813C21.3344 8.1913 21.1719 8.1261 21.0029 8.1261C20.8338 8.1261 20.6713 8.1913 20.5492 8.30813L5.44727 22.735C5.38313 22.7963 5.3321 22.87 5.29728 22.9517C5.26245 23.0333 5.24455 23.1212 5.24465 23.2099L5.24219 36.75C5.24219 37.4462 5.51875 38.1139 6.01103 38.6062C6.50332 39.0984 7.17099 39.375 7.86719 39.375H15.7504C16.0985 39.375 16.4323 39.2367 16.6785 38.9906C16.9246 38.7444 17.0629 38.4106 17.0629 38.0625V26.9063C17.0629 26.7322 17.132 26.5653 17.2551 26.4422C17.3782 26.3191 17.5451 26.25 17.7191 26.25H24.2816C24.4557 26.25 24.6226 26.3191 24.7457 26.4422C24.8688 26.5653 24.9379 26.7322 24.9379 26.9063V38.0625C24.9379 38.4106 25.0762 38.7444 25.3223 38.9906C25.5685 39.2367 25.9023 39.375 26.2504 39.375H34.1303C34.8265 39.375 35.4942 39.0984 35.9865 38.6062C36.4788 38.1139 36.7553 37.4462 36.7553 36.75V23.2099C36.7554 23.1212 36.7375 23.0333 36.7027 22.9517C36.6679 22.87 36.6168 22.7963 36.5527 22.735L21.4565 8.30813Z" fill="black"/>
                    <path d="M40.27 20.0279L34.134 14.1578V5.25C34.134 4.9019 33.9958 4.56806 33.7496 4.32192C33.5035 4.07578 33.1696 3.9375 32.8215 3.9375H28.8841C28.536 3.9375 28.2021 4.07578 27.956 4.32192C27.7098 4.56806 27.5716 4.9019 27.5716 5.25V7.875L22.8203 3.33211C22.3757 2.88258 21.7145 2.625 21 2.625C20.288 2.625 19.6285 2.88258 19.1839 3.33293L1.73581 20.0263C1.22558 20.5185 1.16159 21.3281 1.62589 21.8613C1.74248 21.9959 1.88524 22.1054 2.04548 22.183C2.20572 22.2607 2.38008 22.3049 2.55796 22.3131C2.73584 22.3212 2.91352 22.2931 3.08018 22.2304C3.24683 22.1676 3.39899 22.0717 3.52737 21.9483L20.5489 5.68313C20.671 5.5663 20.8335 5.50109 21.0025 5.50109C21.1715 5.50109 21.334 5.5663 21.4561 5.68313L38.4792 21.9483C38.73 22.1888 39.0659 22.32 39.4132 22.3132C39.7606 22.3065 40.0911 22.1622 40.3323 21.9122C40.836 21.3905 40.7942 20.5291 40.27 20.0279Z" fill="black"/>
                    </svg>
                    </div>
                    <div className=''>
                        <h3 className='text-[24px] font-bold'>Free videos and resoucres</h3>
                        <p className='text-xl'>Configure users, permissions and billings</p>
                    </div>
                </div> */}
               </div>
            </div>
            <div className='grow border-3 border-[#F8F9F9] px-8 mt-8 py-8'>
                <div className='flex justify-between items-center'>
                    <h3 className='font-bold text-xl'>Personal Tasks</h3>
                    <button className="flex items-center px-5 py-2  tm-background text-white rounded-full" aria-controls="feedback-modal" >
                        <svg className="w-4 h-4 fill-current opacity-80 shrink-0" viewBox="0 0 16 16">
                          <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                        </svg>
                        <span className="ml-2">New Tasks</span>
                    </button>
                </div>
                <div className='flex flex-col gap-3 my-4'>
                    <div className='text-xl'> <input type='checkbox' /><span className='ml-3'>300 Due</span></div>
                    <div className='text-xl'><input type='checkbox' /><span className='ml-3'>Cancel Service</span></div>
                    <div className='text-xl'> <input type='checkbox' /><span className='ml-3'>300 Due</span></div>
                    <div className='text-xl'> <input type='checkbox' /><span className='ml-3'>Follow up for funding</span></div>
                </div>
                <div className='pt-4 '><a href='#' className='font-semibold text-xl text-[#F41F1C] underline underline-offset-4'>View more tasks</a></div>
            </div>
        </div>
        {/* table content */}
        <div className='py-8 mx-4 sm:mx-8 '>
            <h3 className='text-3xl font-semibold mb-4'>Recent Activities</h3>
            <p className='text-lg'>If you notice any unusual activity you do not recognize, <a href='#' className='text-[#F41F1C] underline underline-offset-4'>change your password</a> to protect your account or contact customer care for additional help. For security of your account and clients data, IDs and password cannot be shared and cannot be logged in from 2 locations or devices simultaneously </p>
        </div>
        <div className='py-8 mx-4 sm:mx-8 bg-[#FBFCFC] overflow-auto'>
                 <table className='table-auto w-full '>
                <thead className='border-b-4 border-[#F41F1C] text-xl'>
                    <tr className='px-4'>
                        <th className='pb-4 pl-8 font-bold text-left whitespace-nowrap'>User</th>
                        <th className='pb-4 px-2 font-bold text-left whitespace-nowrap'>IP Address</th>
                        <th className='pb-4 px-2 font-bold text-left whitespace-nowrap'>Access Type</th>
                        <th className='pb-4 px-2 font-bold text-left whitespace-nowrap'>Login</th>
                        <th className='pb-4 px-2 font-bold text-left whitespace-nowrap'>Logout</th>
                        <th className='pb-4 px-2 font-bold text-left whitespace-nowrap'>Location</th>
                    </tr>
                </thead>
                <tbody className='text-sm divide-y divide-slate-200 dark:divide-slate-700'>
                    <tr>
                        <td className='pt-8 pb-4 pl-8 text-sm font-medium text-black'>Info@consumerlawdispute.com</td>
                        <td className='pt-8 pb-4 px-2 font-medium text-black'>71.565.98765.989</td>
                        <td className='pt-8 pb-4 px-2 font-medium text-black'>Browser</td>
                        <td className='pt-8 pb-4 px-2 font-medium text-black'>03/03/2024 11:40AM</td>
                        <td className='pt-8 pb-4 px-2 font-medium text-black'>03/03/2024 12:40AM</td>
                        <td className='pt-8 pb-4 px-2 font-medium text-black'>Lagos, Nigeria</td>
                    </tr>
                    <tr>
                        <td className='py-4 pl-8 text-sm font-medium text-black'>Info@consumerlawdispute.com</td>
                        <td className='py-4 px-2 font-medium text-black'>71.565.98765.989</td>
                        <td className='py-4 px-2 font-medium text-black'>Browser</td>
                        <td className='py-4 px-2 font-medium text-black'>03/03/2024 11:40AM</td>
                        <td className='py-4 px-2 font-medium text-black'>03/03/2024 12:40AM</td>
                        <td className='py-4 px-2 font-medium text-black'>Lagos, Nigeria</td>
                    </tr>
                    <tr>
                        <td className='py-4 pl-8 text-sm font-medium text-black'>Info@consumerlawdispute.com</td>
                        <td className='py-4 px-2 font-medium text-black'>71.565.98765.989</td>
                        <td className='py-4 px-2 font-medium text-black'>Browser</td>
                        <td className='py-4 px-2 font-medium text-black'>03/03/2024 11:40AM</td>
                        <td className='py-4 px-2 font-medium text-black'>03/03/2024 12:40AM</td>
                        <td className='py-4 px-2 font-medium text-black'>Lagos, Nigeria</td>
                    </tr>
                    <tr>
                        <td className='py-4 pl-8 text-sm font-medium text-black'>Info@consumerlawdispute.com</td>
                        <td className='py-4 px-2 font-medium text-black'>71.565.98765.989</td>
                        <td className='py-4 px-2 font-medium text-black'>Browser</td>
                        <td className='py-4 px-2 font-medium text-black'>03/03/2024 11:40AM</td>
                        <td className='py-4 px-2 font-medium text-black'>03/03/2024 12:40AM</td>
                        <td className='py-4 px-2 font-medium text-black'>Lagos, Nigeria</td>
                    </tr>
                    <tr>
                        <td className='py-4 pl-8 text-sm font-medium text-black'>Info@consumerlawdispute.com</td>
                        <td className='py-4 px-2 font-medium text-black'>71.565.98765.989</td>
                        <td className='py-4 px-2 font-medium text-black'>Browser</td>
                        <td className='py-4 px-2 font-medium text-black'>03/03/2024 11:40AM</td>
                        <td className='py-4 px-2 font-medium text-black'>03/03/2024 12:40AM</td>
                        <td className='py-4 px-2 font-medium text-black'>Lagos, Nigeria</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </main> 
      <Footer/>
    </div>
    </>
  )
}

export default ClientNewPage