'use client';
import React, { useState, useRef, useEffect } from 'react';
import Transition from '../../utils/Transition';
import { ChevronDown } from 'lucide-react';

const CommonDropdown = ({ title = 'Menu', options = [], align = 'left', onSelect }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef(null);
  const dropdown = useRef(null);

  // Close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // Close if the ESC key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="flex flex-col relative">
      {/* Dropdown Trigger */}
      <button
        ref={trigger}
        className={`inline-flex items-center text-center justify-center text-xs md:text-[16px] font-medium leading-5 rounded-[20px] px-3 py-3 border bg-slate-200 text-black ms-2 transition-colors duration-150 ${
          dropdownOpen ? 'bg-slate-300' : ''
        }`}
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        {title}
        <ChevronDown
          size={14}
          className={`ml-1 transition-transform duration-200 ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <Transition
        show={dropdownOpen}
        tag="div"
        className={`origin-top-right z-10 absolute top-full min-w-[200px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${
          align === 'right' ? 'right-0' : 'left-0'
        }`}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <ul
          ref={dropdown}
          className="focus:outline-none"
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          {options.length > 0 ? (
            options.map((option, idx) => (
              <React.Fragment key={idx}>
                <li>
                  <a
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                    onClick={() => {
                      setDropdownOpen(false);
                      onSelect && onSelect(option);
                    }}
                  >
                    {option.title}
                  </a>
                </li>
                {idx < options.length - 1 && (
                  <hr className="border-slate-100 dark:border-slate-700" />
                )}
              </React.Fragment>
            ))
          ) : (
            <li className="px-4 py-2 text-sm text-slate-400 italic">
              No options available
            </li>
          )}
        </ul>
      </Transition>
    </div>
  );
};

export default CommonDropdown;
