import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Optional: if using Lucide icons
import { toast } from "sonner";
import { supabase } from "@/supabase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
 const navigate = useNavigate()
const [formData,setFormData] = useState({
    email:"",
    password:""
})

  const [errors, setErrors] = useState({
  email: '',
  password: ''
});

 const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
      // Clear error when user starts typing
  if (value.trim() && errors[name]) {
    setErrors(prev => ({...prev, [name]: ''}));
  }
  };
   const validateForm = (formData) => {
  const newErrors = {

    email: '',
    password: '',
   
  };
  let isValid = true;

  if (!formData.email.trim()) {
    newErrors.email = 'Fill out to continue';
    isValid = false;
  } 
  
  // else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
  //   newErrors.email = 'Email is invalid';
  //   isValid = false;
  // }

  if (!formData.password.trim()) {
    newErrors.password = 'Fill out to continue';
    isValid = false;
  }


  setErrors(newErrors);
  return isValid;
};

const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
             if (!validateForm(formData)) {
                toast("Email and password required")
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword(formData)
// console.log("Data",data)
if(error?.message){
    toast(error.message)
    return;
}
// if(data.user)
navigate("/")
} catch (error) {
    console.log(error)
    toast(error.message)

    }
}


  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });
  }, [navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center text-black">
      <div className="border rounded-md p-6 w-[400px] h-350px] backdrop-blur-lg bg-[#C04E2B]/5">
        <h1 className="text-2xl font-bold text-[#C04E2B]">Login</h1>

        <form className="flex flex-col gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg font-medium mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleInputChange}
              placeholder="Enter email"
              className="pl-4 pr-4 font-normal py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C04E2B]"
            />
          </div>

          <div className="flex flex-col relative">
            <label htmlFor="password" className="text-lg font-medium mb-1.5">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter password"
                onChange={handleInputChange}
              className="pl-4 pr-10 font-normal py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C04E2B]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[46px] text-gray-500 hover:text-[#C04E2B]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="mt-2 p-2 bg-[#C04E2B] rounded-md text-white font-bold tracking-[0.9px]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
