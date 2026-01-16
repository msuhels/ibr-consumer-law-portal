import React, { useState, useRef, useEffect } from 'react';
import Transition from '../utils/Transition';

function DashboardLegalLibrary({
    children,
    align,
    ...rest
}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const trigger = useRef(null);
    const dropdown = useRef(null);

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return;
            if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
            setDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!dropdownOpen || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    return (
        <div {...rest} className='flex flex-col relative '>
            <button
                ref={trigger}
                className={`rounded-full ${dropdownOpen
                    ? 'inline-flex items-center justify-center text-xs md:text-[16px]  font-medium leading-5 rounded-[20px] px-3 py-3 border bg-slate-200 text-black ms-2 '
                    : 'inline-flex items-center justify-center text-xs md:text-[16px]  font-medium leading-5 rounded-[20px] px-3 py-3 border bg-slate-200 text-black ms-2 '
                    }`}
                aria-haspopup="true"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
            >
                Legal Library
       <svg className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 mb-1" viewBox="0 0 12 12"><path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path></svg>

            </button>
            <Transition
                show={dropdownOpen}
                tag="div"
                className={`origin-top-right w-[250px] z-10 absolute top-full min-w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'
                    }`}
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
            >
                <ul ref={dropdown} onFocus={() => setDropdownOpen(true)} onBlur={() => setDropdownOpen(false)}>
                    {children}
                </ul>
            </Transition>
        </div>
    );
}

export default DashboardLegalLibrary;