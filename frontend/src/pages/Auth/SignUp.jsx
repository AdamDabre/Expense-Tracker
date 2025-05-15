import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { validateEmail } from "../../utils/helper";

const SignUp = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    // Handle sign up form submit
    const handleSignUp = async (e) => {
        e.preventDefault();
    };

    return (
        <AuthLayout>
            <div className="lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">
                    Create an Account
                </h3>
                <p className="text-xs text-slate-700 mt-1 mb-6">
                    Enter your details below
                </p>

                <form onSubmit={handleSignUp}>
                    <ProfilePhotoSelector
                        image={profilePic}
                        setImage={setProfilePic}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            value={fullName}
                            onChange={({ target }) => setFullName(target.value)}
                            label="Full Name"
                            placeholder="John"
                            type="text"
                        />

                        <Input
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                            label="Email"
                            placeholder="john@example.com"
                            type="email"
                        />

                        <div className="col-span-2">
                            <Input
                                value={password}
                                onChange={({ target }) =>
                                    setPassword(target.value)
                                }
                                label="Password"
                                placeholder="Min 8 Characters"
                                type="text"
                            />

                            {error && (
                                <p className="text-red-500 text-xs pb-2.5">
                                    {error}
                                </p>
                            )}

                            <button type="submit" className="btn-primary">
                                SignUp
                            </button>

                            <p className="text-sm text-slate-800 mt-3">
                                Already have an account?{" "}
                                <Link
                                    className="font-medium text-primary underline"
                                    to="/login"
                                >
                                    Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
};

export default SignUp;
