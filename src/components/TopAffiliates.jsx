import React, { useState } from 'react'

const TopAffiliates = () => {
    const [activeBtn,setActiveBtn]=useState('Referrals');
    const affiliate=['Simple Affiliate','James Stone','British Council','John Baggage','Stone Cornelius','Others']
  return (
    <div className='bg-[#F8F9F9] border border-[#EEEFF1]'>
      <div className='flex flex-row py-6 px-8 text-black font-semibold'>
          <div className={`px-4 pb-2 text-xl border-b-4 cursor-pointer ${activeBtn==='Referrals' ?'border-[#F41F1C] text-[#F41F1C]': ''}`} onClick={()=>setActiveBtn('Referrals')}>Referrals</div>
          <div className={`px-4 pb-2 border-b-4  text-xl  cursor-pointer ${activeBtn==='Clients' ?'border-[#F41F1C] text-[#F41F1C]': ''}`} onClick={()=>setActiveBtn('Clients')}>Clients</div>
          <div className={`px-4 pb-2 border-b-4  text-xl  cursor-pointer ${activeBtn==='Revenue' ?'border-[#F41F1C] text-[#F41F1C]': ''}`} onClick={()=>setActiveBtn('Revenue')}>Revenue</div>
      </div>
      <div className='bg-white mb-6 mx-3 p-6 flex flex-row'>
        <div className=' border-r border-[#DDE0E3] w-[20%]'>
            {affiliate.map((elm,i)=><div className={`${i>0?'pt-10 sm:pt-12':''} text-black font-semibold ml-4`}><h3 className=''>{i+1}. {`${elm}`}</h3></div>)}
        </div>
        <div className='w-[80%]'> 
            {affiliate.map((elm,i)=>{
                return (
                    <>
                    <div className={`${i>0?'pt-10 sm:pt-12':''} px-2 text-black font-semibold ml-4 flex items-center`}>
                    <span className=''>12%</span>
                     <div class="w-full bg-gray-200  h-2.5 dark:bg-gray-700 ml-2">
                        <div class="bg-red-600 h-2.5  dark:bg-red-500 " style={{width:'12%'}}></div>
                     </div>
                     </div>
                    </>
                )
            })}
        </div>
      </div>
    </div>
  )
}

export default TopAffiliates