import { MdKeyboardArrowDown } from "react-icons/md";

const Filter = ({ handleSort, toggleSort, sortOpen, sortBy, page, setPage }) => {
    return (
        <div className={`filter py-5 w-full flex justify-between px-8`}>
            <div className={`filter w-60`}>
                <div className={`sort flex justify-between items-center cursor-pointer border border-black ${sortOpen ? 'rounded-t-md' : 'rounded-md'} p-2 w-full`} onClick={toggleSort}>
                    <span>Sort by {sortBy}</span>
                    <MdKeyboardArrowDown />

                </div>
                <div className={`options absolute z-50 flex flex-col ${sortOpen ? 'block' : 'hidden'} w-60 p-3 bg-gray-200 rounded-b-md shadow-xl/70 gap-2`}>
                    <span className="item cursor-pointer" onClick={() => handleSort('price low to high')}>Price: Low to High</span>
                    <span className="item cursor-pointer" onClick={() => handleSort('price high to low')}>Price: High to Low</span>
                    <span className="item cursor-pointer" onClick={() => handleSort('newest')}>Newest Arrivals</span>
                    <span className="item cursor-pointer" onClick={() => handleSort('popularity')}>Popularity</span>
                </div>
            </div>

            <div className="pages">

            </div>
        </div>
    )
}

export default Filter