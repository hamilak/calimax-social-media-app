import { AiFillBell } from "react-icons/ai"
// import { Dropdown } from "rsuite"

const Navbar = () => {
    return (
        <div>
            <div className='fixed z-10 w-full flex justify-between bg-gray-200 text-purple-800 h-10 px-6 py-1'>
                <div className='flex items-center h-full'>
                    <h6 className="font-extrabold">CALIMAX</h6>
                </div>
                <div>
                    <ul className='flex items-center h-full'>
                        <li><AiFillBell size={18} color='black' /></li>
                        {/* <li>
                            <Dropdown>
                                <Dropdown.Item>
                                    New Expense
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    New Report
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    New Trip
                                </Dropdown.Item>
                            </Dropdown></li> */}
                        <li className='flex justify-center items-center text-xs font-bold text-white w-6 h-6 rounded-full bg-black'>K</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar