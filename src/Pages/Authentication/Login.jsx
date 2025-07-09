import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../Hook/useAuth";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router";
import { Brain } from 'lucide-react';
import registerLottie from '../../../src/assets/animation authentication/login.json';
import Lottie from 'lottie-react';

const Login = () => {
    const { signInWithGoogle, signIn } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const location = useLocation()
    // console.log(location)
    const navigate = useNavigate()

    const onSubmit = (data) => {
        // console.log("Login Data:", data);
        signIn(data.email, data.password)
            .then(() => {
                toast.success("Successfully Log in Done ✅");
                // 
                setTimeout(() => {
                    navigate(`${location.state ? location.state : '/'}`)
                }, 1000)
            }).catch((error) => {
                alert(error.message)
                toast.error("Log in failed ❌");
            })
    };

    // login with google account pop up system 
    const handleGoogleLogin = async () => {
        signInWithGoogle()
            .then(() => {
                // The signed-in user info.
                // const user = result.user;
                // console.log('Google User:', user);
                toast.success("Signed in with Google ✅");
                setTimeout(() => {
                    navigate(`${location.state ? location.state : '/'}`)
                }, 1000)
            })
            .catch((error) => {
                console.error('Google sign-in error:', error);
                toast.error("Google Sign-in failed ❌");
            });
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-5xl shadow-indigo-400 w-full max-w-sm sm:max-w-md transition-all duration-300">
                <span className=" justify-center grid"><Lottie className='w-25' animationData={registerLottie} loop={true}></Lottie></span>
                <div className="text-2xl  flex sm:text-3xl  items-center font-bold mb-6 text-center text-blue-600"><Link to='/'><Brain></Brain></Link> <span className="text-center ml-30"> Login</span></div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: "Email is required" })}

                            placeholder="Enter your email"
                            className="w-full px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Minimum 6 characters" },
                            })}
                            className="w-full px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-indigo-100 via-pink-80 to-indigo-500 text-shadow-black font-semibold cursor-pointer shadow-md placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-white">
                        Login
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-4">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="mx-2 text-sm text-gray-500">OR</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>

                {/* Google Sign-In */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex cursor-pointer items-center justify-center border py-2 rounded-md hover:bg-gray-100 transition-all"
                >
                    <FcGoogle className="mr-3" />
                    Sign in with Google
                </button>
                <p className="text-center mt-2">Create an account <Link to='/auth/register' className="border-b  border-blue-500 text-blue-500">register</Link></p>
            </div>
        </div>
    );
};

export default Login;
