import React, { useEffect, useState, useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { TabMenu } from "primereact/tabmenu";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
    getCompanySetting,
    isRequestFulfilledToPrevState,
} from "../../redux/companySlice";

const CompanySettings = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const dispatch = useDispatch();
    const { company, isRequestFulfilled } = useSelector(
        (state) => state.company
    );

    // Initialize editCompany state
    const [editCompany, setEditCompany] = useState({
        id: "",
        companyName: "",
        companyEmail: "",
        phoneNumber: "",
        website: "",
    });

    // Memoize company settings to prevent unnecessary re-renders
    const companyData = useMemo(() => company?.data?.[0] || {}, [company]);

    // Update local state when Redux state changes
    useEffect(() => {
        if (isRequestFulfilled && companyData) {
            setEditCompany({
                id: companyData?._id || "",
                companyName: companyData?.companyName || "",
                companyEmail: companyData?.companyEmail || "",
                phoneNumber: companyData?.phoneNumber || "",
                website: companyData?.website || "",
            });
            dispatch(isRequestFulfilledToPrevState());
        }
    }, [isRequestFulfilled, companyData, dispatch]);

    // Fetch company settings on mount
    useEffect(() => {
        dispatch(getCompanySetting());
    }, [dispatch]);

    // Handle input changes properly
    const handleInputChange = (e, field) => {
        setEditCompany((prevState) => ({
            ...prevState,
            [field]: e.target.value,
        }));
    };

    // Handle save action
    const handleSave = async () => {
        try {
            const { id, companyName, companyEmail, phoneNumber, website } =
                editCompany;
            if (!id || !companyName || !companyEmail || !phoneNumber) {
                return toast.error("All required fields must be filled!");
            }

            const response = await axios.put(
                "/api/v1/setting/update_company_setting",
                editCompany
            );
            toast.success("Company settings saved successfully!");
            dispatch(getCompanySetting()); // Refresh settings after saving
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong!"
            );
        }
    };

    const items = [{ label: "Company Settings", icon: "pi pi-building" }];

    return (
        <div>
            {/* Tab Menu */}
            <TabMenu
                model={items}
                activeIndex={activeIndex}
                onTabChange={(e) => setActiveIndex(e.index)}
            />

            {/* Company Settings Form */}
            <div className="p-5 bg-white shadow-md rounded-lg mb-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        {
                            label: "Company Name",
                            key: "companyName",
                            required: true,
                        },
                        {
                            label: "Company Email",
                            key: "companyEmail",
                            required: true,
                        },
                        {
                            label: "Company Phone",
                            key: "phoneNumber",
                            required: true,
                        },
                        {
                            label: "Company Website",
                            key: "website",
                            required: false,
                        },
                    ].map(({ label, key, required }) => (
                        <div key={key}>
                            <label className="block font-medium">
                                {label}{" "}
                                {required && (
                                    <span className="text-red-600">*</span>
                                )}
                            </label>
                            <InputText
                                value={editCompany[key] || ""}
                                onChange={(e) => handleInputChange(e, key)}
                                className="w-full p-inputtext"
                            />
                        </div>
                    ))}
                </div>

                {/* Save Button */}
                <div className="mt-4">
                    <Button
                        label="Save"
                        className="mt-9"
                        icon="pi pi-check"
                        onClick={handleSave}
                    />
                </div>
            </div>
        </div>
    );
};

export default CompanySettings;
