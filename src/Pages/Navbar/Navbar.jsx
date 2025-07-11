import React, { useState } from 'react';
import { Menu, X, Home, Code, User, Mail } from 'lucide-react';
import { Link } from 'react-router';
import useAuth from '../../Hook/useAuth';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const Navbar = () => {
  const { user, logOut } = useAuth();
  // console.log("user in navbar", user)

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  // Define navbar items with label, path and icon
  const navItems = [
    { label: 'Home', to: '/', Icon: Home },
    { label: 'Available camps', to: '/availableBootcamp', Icon: Code },
    { label: 'About', to: '/about', Icon: User },
    { label: 'Contact', to: '/contact', Icon: Mail },
  ];
  const navbar = navItems.map(({ label, to, Icon }) => (
    <Link
      key={label}
      to={to}
      className="group flex items-center gap-1 text-gray-500  hover:text-indigo-500 transition relative font-medium"
    >
      {/* Text */}
      {label}
      {/* Icon hidden by default, shown on hover */}
      <Icon
        size={16}
        className="opacity-0 group-hover:opacity-100 transition absolute right-[-20px]"
        aria-hidden="true"
      />
    </Link>
  ));
  // Close mobile menu when a link is clicked (on small devices)
  const handleLinkClick = () => {
    if (window.innerWidth < 768) setIsOpen(false);
  };

  // Firebase All Operation here work 

  const handleLogOut = () => {
    logOut().then(() => {
    }).catch((error) => {
      console.log(error)
    })
    toast("Logout successfully Done ❌");
  }

  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Failed to load users:', err));
  }, []);
  // console.log(users)
  const currentUser = users.find(u => u.email === user?.email);
  // console.log("current user in navbar", currentUser)



  return (
    <div>
      <nav className="md:w-11/12 md:mx-auto w-full fixed top-0 left-0 right-0 z-50 shadow-md ">
        <div className="flex justify-between items-center py-3 md:py-4">
          {/* Logo */}
          <div className="md:text-3xl text-2xl font-bold cursor-pointer">Medical Camp <span className='text-indigo-500'>(MCMS)</span></div>
          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8">{navbar}</ul>
          <div >
            {
              user ? (
                <div className="relative group md:block hidden">
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                      <div className="w-10 rounded-full">
                        <Link tabIndex={0} role="button" to='/'>

                          {
                            <img className='rounded-full h-8 w-8 mx-1 cursor-pointer' src={currentUser?.image} alt="User" />
                          }
                        </Link>
                      </div>
                    </div>
                    <ul
                      tabIndex={0}
                      className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                      <li><Link to='/dashboard'>Dashboard </Link></li>
                      <li><Link to='/userInfo'>Setting</Link></li>
                      <li>{
                        user ? <Link onClick={handleLogOut} className='' to='/auth/login'><button className=""> Logout</button></Link> :
                          <Link className='' to='/auth/login'><button className=""> Login</button></Link>
                      }</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <Link
                  to="/auth/login"
                  className="hidden md:flex items-center gap-1 hover:text-teal-500 transition relative font-medium"
                >
                  Join US
                </Link>
              )
            }
            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button onClick={toggleMenu} aria-label="Toggle menu">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu with smoother, longer animation */}
          <div
            className={`
    md:hidden fixed top-14 left-0 w-full bg-white text-black rounded-4xl mx-3 z-40 transition-all duration-700
    ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
  `}
            style={{ willChange: 'max-height, opacity' }}
          >
            <div className='items-center flex justify-center gap-10 py-4'>
              {
                user ? (
                  <div className="relative group">
                    <div className="dropdown dropdown-end">
                      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                          <Link tabIndex={0} role="button" to='/'>
                            {
                              <img className='rounded-full h-8 w-8 mx-1 cursor-pointer' src={currentUser?.image} alt="User" />
                            }

                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                 <div>
                  <Link to='/auth/login' className='btn rounded-4xl py-1 px-10 shadow-2xl '>Log in</Link> <Link to='/auth/login' className='btn rounded-4xl py-1 text-white px-10 shadow-2xl bg-indigo-500'>Register</Link>
                 </div>
                )
              }
            </div>
            <ul className="px-4 pb-4 my-2  shadow-md justify-center align-center bg-transparent grid font-medium space-y-3">
              {navItems.map(({ label, to, Icon }) => (
                <Link
                  key={label}
                  to={to}
                  className="group flex items-center gap-1 hover:text-teal-500 transition relative font-medium"
                  onClick={handleLinkClick}
                >
                  {label}
                  <Icon
                    size={16}
                    className="opacity-0 group-hover:opacity-100 transition absolute right-[-20px]"
                    aria-hidden="true"
                  />
                </Link>
              ))}
              {user ? <div className='grid gap-2'><Link to='/dashboard'>DashBoard</Link><li className='cursor-pointer ' onClick={handleLogOut}>Logout</li></div> : ('') }
            </ul>

          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;