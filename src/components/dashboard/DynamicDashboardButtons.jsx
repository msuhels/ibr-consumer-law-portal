'use client';
import CommonDropdown from './CommonDropdown';

const DynamicDashboardButtons = ({ userActivity, buttons }) => {
    return (
        <>
            {buttons.map((btn) => (
                <div key={btn._id} className="w-1/2 sm:w-auto p-1">
                    {btn.type === 'link' && (
                        <div className="flex flex-col">
                            <a
                                href={btn.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-center justify-center text-xs md:text-[16px] font-medium leading-5 rounded-[20px] px-3 py-3 border bg-slate-200 text-black ms-2"
                                onClick={() =>
                                    userActivity('Page visit', btn.url, 'external', '', btn.title)
                                }
                            >
                                {btn.title}
                            </a>
                        </div>
                    )}

                    {btn.type === 'dropdown' && (
                        <CommonDropdown
                            title={btn.title}
                            options={btn.options}
                            onSelect={(option) =>
                                userActivity(
                                    'Page visit',
                                    option.url,
                                    'external',
                                    '',
                                    option.title
                                )
                            }
                        />
                    )}
                </div>
            ))}
        </>
    );
};

export default DynamicDashboardButtons;
