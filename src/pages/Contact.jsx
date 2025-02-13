import React from "react";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const Contact = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = (data) => {
        reset(); // Reset the form after successful submission
    };

    return (
        <div className="h-auto flex flex-col items-center justify-center p-5">
            {/* Contact Us Heading */}
            <h1 className="text-3xl font-bold text-black mb-8">Contact Us</h1>

            <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md grid grid-cols-1 lg:grid-cols-2 gap-6">
                <form
                    className="space-y-2 sm:space-y-4 lg:space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Full Name
                        </label>
                        <InputText
                            className="w-full p-inputtext-sm"
                            placeholder="Alex Jordan"
                            {...register("fullName", {
                                required: "Full Name is required",
                            })}
                        />
                        <div className="h-5">
                            {errors.fullName && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.fullName.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Phone
                        </label>
                        <InputText
                            className="w-full p-inputtext-sm"
                            placeholder="Phone"
                            {...register("phone", {
                                required: "Phone is required",
                                pattern: {
                                    value: /^[0-9]+$/,
                                    message: "Phone must contain only numbers",
                                },
                            })}
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                    /\D/g,
                                    ""
                                );
                            }}
                        />
                        <div className="h-5">
                            {errors.phone && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Email
                        </label>
                        <InputText
                            className="w-full p-inputtext-sm"
                            placeholder="name@example.com"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email address",
                                },
                            })}
                        />
                        <div className="h-5">
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Message
                        </label>
                        <textarea
                            className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Your message..."
                            {...register("message", {
                                required: "Message is required",
                                maxLength: {
                                    value: 300,
                                    message:
                                        "Message must be less than 300 characters",
                                },
                            })}
                        ></textarea>
                        <div className="text-right text-gray-500 text-xs">
                            Max 300 characters
                        </div>
                        <div className="h-5">
                            {errors.message && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.message.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        label="Send Message"
                        className="px-6 py-2 text-sm text-white font-medium rounded-md border-none shadow-md hover:opacity-90"
                        style={{ backgroundColor: "rgba(0, 113, 93, 1)" }}
                    />
                </form>

                {/* Photo Section - Visible only on large screens */}
                <div className="hidden lg:flex items-center justify-center bg-gray-200 rounded-lg w-full h-full">
                    <img
                        src="src/assets/pexels-photo-3184287.jpeg"
                        alt="Contact Illustration"
                        className="w-full h-140 rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default Contact;
