import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

const Pagination = ({ page, pages, onPageChange }) => {
    if (pages <= 1) return null;

    const getPageNumbers = () => {
        const nums = [];
        const start = Math.max(1, page - 2);
        const end = Math.min(pages, page + 2);
        for (let i = start; i <= end; i++) nums.push(i);
        return nums;
    };

    return (
        <div className="flex items-center justify-end gap-1.5 mt-8">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-xl transition-all duration-200 disabled:opacity-25 hover:bg-[var(--bg-tertiary)]"
                style={{ color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            >
                <HiChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((num) => (
                <button
                    key={num}
                    onClick={() => onPageChange(num)}
                    className="w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{
                        background: num === page ? 'var(--gradient-primary)' : 'transparent',
                        color: num === page ? '#fff' : 'var(--text-secondary)',
                        boxShadow: num === page ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                        border: num === page ? 'none' : '1px solid var(--border-color)',
                    }}
                >
                    {num}
                </button>
            ))}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === pages}
                className="p-2 rounded-xl transition-all duration-200 disabled:opacity-25 hover:bg-[var(--bg-tertiary)]"
                style={{ color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            >
                <HiChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Pagination;
