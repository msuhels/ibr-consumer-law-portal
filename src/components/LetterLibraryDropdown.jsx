import React, { useState, useRef, useEffect } from 'react';
import Transition from '../utils/Transition';

function LetterLibraryDropdown({ value = "", onChange, onStatusSelect, clearSearch }) {
    const roles = [
        {
            id: "active",
            status: 'active',
            label: "Active"
        },
        {
            id: "inactive",
            status: 'inactive',
            label: "Inactive"
        },
      ];
    
      const [dropdownOpen, setDropdownOpen] = useState(false);
      const [selectedStatus, setselectedStatus] = useState(null);
    
      useEffect(() => {
        if (onStatusSelect && selectedStatus !== null) {
          onStatusSelect(selectedStatus);
        }
      }, [onStatusSelect, selectedStatus]);
    
      const handleClearSelection = () => {
        setselectedStatus(null);
        onChange && onChange({ target: { value: null } });
        clearSearch && clearSearch();
        setDropdownOpen(false);
      };
    
      return (
        <div className="relative inline-flex">
          <button
            className="btn justify-between  bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200"
            aria-label="Select role"
            aria-haspopup="true"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            <span className="flex items-center">
              <span>{selectedStatus !== null ? roles.find(status => status.id === selectedStatus)?.label || 'Select Status' : 'Select Status'}</span>
            </span>
            <svg className="shrink-0 ml-1 fill-current text-slate-400" width="11" height="7" viewBox="0 0 11 7">
              <path d="M5.4 6.8L0 1.4 1.4 0l4 4 4-4 1.4 1.4z" />
            </svg>
          </button>
          <Transition
            show={dropdownOpen}
            tag="div"
            className="z-10 absolute top-full left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1"
            enter="transition ease-out duration-100 transform"
            enterStart="opacity-0 -translate-y-2"
            enterEnd="opacity-100 translate-y-0"
            leave="transition ease-out duration-100"
            leaveStart="opacity-100"
            leaveEnd="opacity-0"
          >
            <div
              className="font-medium text-sm text-slate-600 dark:text-slate-300"
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setDropdownOpen(false)}
            >
              {value ? (
                <button
                  className={`flex items-center w-full hover:bg-slate-50 hover:dark:bg-slate-700/20 py-1 px-3 cursor-pointer`}
                  onClick={handleClearSelection}
                >
                  <span>Clear Selection</span>
                </button>
              ) : null}
              {roles.map((status) => (
                <button
                  key={status.id}
                  className={`flex items-center w-full hover:bg-slate-50 hover:dark:bg-slate-700/20 py-1 px-3 cursor-pointer ${status.id === selectedStatus && 'text-indigo-500'}`}
                  onClick={() => { setselectedStatus(status.id); onChange && onChange({ target: { value: status.status } }); setDropdownOpen(false); }}
                >
                  <span>{status.label}</span>
                </button>
              ))}
            </div>
          </Transition>
        </div>
      );
}

export default LetterLibraryDropdown;