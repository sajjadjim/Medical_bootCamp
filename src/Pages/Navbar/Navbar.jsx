import React, { useEffect, useState } from 'react';
import { Menu, X, Home, Code, User, Mail, LogOut, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate, NavLink } from 'react-router';
import useAuth from '../../Hook/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import './style.css';

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { label: 'Home', to: '/', Icon: Home },
    { label: 'Available Camps', to: '/availableBootcamp', Icon: Code },
    { label: 'About', to: '/about', Icon: User },
    { label: 'Contact', to: '/contact', Icon: Mail },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 768) setIsOpen(false);
  };

  const handleLogOut = () => {
    logOut()
      .then(() => {
        toast.success("Logout successfully Done ❌");
        setTimeout(() => {
          navigate(`${location.state ? location.state : '/'}`);
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [dbUser, setDbUser] = useState([]);
  useEffect(() => {
    const accessToken = user?.accessToken;
    if (accessToken) {
      fetch('https://b11a12-server-side-sajjadjim.vercel.app/users', {
        headers: { authorization: `Bearer ${accessToken}` },
      })
        .then((res) => res.json())
        .then((data) => setDbUser(data))
        .catch((error) => console.error('Error fetching users:', error));
    }
  }, [user]);

  const currentUser = dbUser.filter((db) => db.email === user?.email);
  const name = currentUser[0]?.name || user?.displayName || 'No Name';
  const image = currentUser[0]?.image || 'https://cdn-icons-png.freepik.com/512/6858/6858485.png';

  return (
    <div>
      <nav className="w-full fixed top-0 left-0 right-0 z-50 shadow-md bg-white bg-opacity-70 backdrop-blur-lg">
        <ToastContainer />
        <div className="flex justify-between items-center py-3 md:py-4 px-4 md:px-8">
          
          {/* Logo */}
          <div className="md:text-3xl text-2xl font-bold cursor-pointer">
            <Link to='/'>Medical Camp <span className='text-indigo-500'>(MCMS)</span></Link>
          </div>
          
          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8">
            {navItems.map(({ label, to, Icon }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-2 transition font-medium relative 
                  ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-500'}`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </ul>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="dropdown dropdown-end hidden md:block">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                      className="rounded-full h-10 w-10 cursor-pointer border-2 border-indigo-500"
                      src={image}
                      alt="User"
                      title={`${name}\n${user?.email}`}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-white rounded-box shadow-lg mt-3 w-52 p-2"
                >
                  <li><span className="font-semibold text-indigo-600">{name}</span></li>
                  <li><Link to='/dashboard' className="flex items-center gap-2"><LayoutDashboard size={16}/> Dashboard</Link></li>
                  <li>
                    <button onClick={handleLogOut} className="flex items-center gap-2 text-red-500 hover:text-red-700">
                      <LogOut size={16}/> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="hidden md:flex gap-3">
                <Link to="/auth/login" className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 flex items-center gap-1 shadow-md">
                  <LogIn size={16}/> Login
                </Link>
                <Link to="/auth/register" className="px-4 py-2 rounded-lg border border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white flex items-center gap-1 shadow-md">
                  <UserPlus size={16}/> Register
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <div className="md:hidden text-gray-700">
              <button onClick={toggleMenu} aria-label="Toggle menu">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
            md:hidden fixed top-14 left-0 w-full bg-white shadow-lg rounded-b-2xl z-40 transition-all duration-500
            ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}
          `}
        >
          <ul className="flex flex-col items-center gap-4 py-6 font-medium text-gray-700">
            {navItems.map(({ label, to, Icon }) => (
              <NavLink
                key={label}
                to={to}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-2 transition ${isActive ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-500'}`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
            {user ? (
              <div className="flex flex-col items-center gap-2">
                <Link to="/dashboard" className="flex items-center gap-2 text-indigo-600"><LayoutDashboard size={16}/> Dashboard</Link>
                <button onClick={handleLogOut} className="flex items-center gap-2 text-red-500 hover:text-red-700"><LogOut size={16}/> Logout</button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/auth/login" className="px-6 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 flex items-center gap-1 shadow-md">
                  <LogIn size={16}/> Login
                </Link>
                <Link to="/auth/register" className="px-6 py-2 rounded-lg border border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white flex items-center gap-1 shadow-md">
                  <UserPlus size={16}/> Register
                </Link>
              </div>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
