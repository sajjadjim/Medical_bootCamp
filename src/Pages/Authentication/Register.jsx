import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Auth/AuthContext";
import registerLottie from '../../../src/assets/animation authentication/register.json';
import useAuth from "../../Hook/useAuth";
import useAxios from "../../Hook/useAxios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { Link, useLocation } from "react-router";
import { useNavigate } from "react-router";
import Lottie from 'lottie-react';
import { toast } from "react-toastify";
import { Brain } from 'lucide-react';

const Register = () => {
    const {
        register,
        handleSubmit,
        // watch,
        formState: { errors },
    } = useForm();
    // axios secure the from react the data from the server 
    const axiosInstance = useAxios();
    const [profilePic, setProfilePic] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { updateUserProfile, createUser, user, signInWithGoogle } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/auth/login';
    // console.log(user)

    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            setErrorMessage("❌ Passwords do not match");
            return;
        }
        // console.log(data)
        // create user in Firebase 
        createUser(data.email, data.password)
            .then(async (result) => {
                console.log(result.user)
            });

        const userInfo = {
            email: data.email,
            image: profilePic,
            name: data.name,
            role: "participant",
            created_at: new Date().toISOString(),
            last_log_in: new Date().toISOString()
        }
        // Data inserted to the mongoDB 
        const userResponse = await axiosInstance.post('/users', userInfo)
        console.log("User response:", userResponse.data);

        const insertedId = userResponse?.data?.insertedId || userResponse?.data?.data?.insertedId;

        const userProfile = {
            displayName: data.name,
            photoURL: profilePic
        }
        updateUserProfile(userProfile)
            .then(() => {
                // console.log('profile name pic updated');
            })
            .catch(error => {
                console.log(error)
            })
        if (!insertedId) {
            // setErrorMessage("");
            import("sweetalert2").then(Swal => {
                Swal.default.fire({
                    icon: "success",
                    title: "Registration Successful",
                    text: "User registered successfully!",
                });
                navigate(from);
            });
            console.log("User registered successfully:", insertedId);
        } else {
            setErrorMessage("❌ Registration failed. Please try again.");
            import("sweetalert2").then(Swal => {
                Swal.default.fire({
                    icon: "error",
                    title: "Registration Failed",
                    text: "Please try again.",
                });
                navigate(from);
            });
        }
    };


    // Google Account login system and Database store the data  and update data on firebase also
    const handleGoogleSignUp = async () => {
        signInWithGoogle()
            .then(async () => {
                // The signed-in user info.
                const userInfo = {
                    email: user.email
                    , name: user.displayName || "No Name",
                    image: user.photoURL || "https://www.svgrepo.com/show/475676/user.svg",
                    role: "participant",
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString()
                }
                console.log(userInfo)
                // console.log(user)
                const userResponse = await axiosInstance.post('/users', userInfo)
                console.log("User response:", userResponse.data);

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

    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        // console.log(image)
        const formData = new FormData();
        formData.append('image', image);
        const imagUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`
        const res = await axios.post(imagUploadUrl, formData)
        setProfilePic(res.data.data.url);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-5 ">
                <h2 className="text-2xl font-bold text-center text-gray-800"><Link to='/'><Brain className="text-indigo-500"></Brain></Link> Register</h2>
                <div className="text-center grid justify-center"> <Lottie className='w-25' animationData={registerLottie} loop={true}></Lottie></div>
                {errorMessage && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
                        {errorMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 ">User Name</label>
                        <input
                            {...register("name", { required: "Name is required" })}
                            type="text"
                            placeholder="Your name"
                            className="w-full px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Photo Upload</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        {profilePic && (
                            <img src={profilePic} alt="Profile Preview" className="mt-2 w-16 h-16 rounded-full object-cover" />
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            {...register("email", { required: "Email is required" })}
                            type="email"
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            {...register("password", { required: "Password is required", minLength: 6 })}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute  right-2 top-11 cursor-pointer text-gray-500"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>


                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            {...register("confirmPassword", { required: "Please confirm password" })}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            className="w-full px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 shadow-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2 top-11 cursor-pointer text-gray-500"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                        )}
                    </div>


                    <button
                        type="submit"
                        className="w-full px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-indigo-100 via-pink-80 to-indigo-500 text-shadow-black font-semibold cursor-pointer shadow-md placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-white">
                        Register
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">Or</p>
                    <button
                        onClick={handleGoogleSignUp}
                        className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl py-2 bg-gradient-to-r from-indigo-500 via-pink-80 to-indigo-100 text-shadow-black font-semibold cursor-pointer shadow-md placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                        <img src="https://www.svgrepo.com/show/47565</svg>6/google-color.svg" alt="Google" className="w-5 h-5 cursor-pointer" />
                        Sign up with Google
                    </button>
                </div>
                <p className="text-center mt-2">Already create account <Link to='/auth/login' className="border-b  border-blue-500 text-blue-500">login</Link></p>
            </div>
            <div className="text-center  lg:text-left">
            </div>
        </div>
    );
};

export default Register;
