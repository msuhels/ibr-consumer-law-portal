import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';

function Mail(props) {

  return (
    <div className="py-6">
      <header className="flex items-start">
        <div className="grow">
          <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100 text-left truncate mb-4">{props?.role === "user" ? "YOU:" : "CONSUMER AI:"}</h1>
          <div className="sm:flex items-start justify-between mb-0.5">
            <div className="xl:flex items-center mb-2 sm:mb-0">
              <>
                <div className="text-sm text-slate-400 dark:text-slate-600 hidden xl:block mx-1">·</div>
                <div className="text-xs dark:text-slate-500">
                  <pre style={{ maxWidth: '100%', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
                    {props.message}
                  </pre>
                </div>
              </>
            </div>
            <div className="text-xs font-medium text-slate-500 whitespace-nowrap mb-2 sm:mb-0">{moment(props.created_at).format('h:mm A')}</div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Mail;
