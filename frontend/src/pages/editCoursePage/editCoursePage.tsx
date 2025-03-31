import React, { useEffect, useState, useCallback, useRef } from "react";
import apiClient from "../../services/apiClient"
import { useLocation, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import Select, { MultiValue } from 'react-select';

type OptionType = {
    value: string;
    label: string;
};


const EditCourse = () => {
    const [inputTitleValue, setInputTitleValue] = useState<string>('');
    const [inputSummaryValue, setSummaryValue] = useState<string>(' ');
    const [inputDescriptionValue, setDescriptionValue] = useState<string>(' ');
    const [inputShortUrlProduct, setInputShortUrlProduct] = useState<string>(' ');
    const [webinar, setWebinar] = useState<boolean>(false);
    const [survey, setSurvey] = useState<boolean>(false);
    const [certificate, setCertificate] = useState<boolean>(false);
    const [credit, setCredit] = useState<number>(0);
    const [date, setDate] = useState<Date>(new Date());
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [components, setComponents] = useState<string[]>([]);
    const location = useLocation();
    const { id } = useParams();
    const [regStart, setRegStart] = useState<Date>(new Date());
    const [courseType, setCourseType] = useState<string>(' ');
    const [price, setPrice] = useState<number>(0);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([])
    const [isLive, setIsLive] = useState<boolean>(false)
    const [isInPerson, setIsInPerson] = useState<boolean>(false)
    const options = [
        { value: "None Selected", label: "None Selected" },
        { value: "Biological Families", label: "Biological Families" },
        { value: "Diversity, Equity, Inclusion", label: "Diversity, Equity, Inclusion" },
        { value: "Formación En Español", label: "Formación En Español" },
        { value: "Foster Parent Connections", label: "Foster Parent Connections" },
        { value: "Brighton Foster Parent Connections", label: "    Brighton Foster Parent Connections" },
        { value: "LGBTQ Foster Parent Connections", label: "    LGBTQ Foster Parent Connections" },
        { value: "Longmont Foster Parent Connections", label: "    Longmont Foster Parent Connections" },
        { value: "Indian Child Welfare Act (ICWA)", label: "Indian Child Welfare Act (ICWA)" },
        { value: "Kinship Education", label: "Kinship Education" },
        { value: "Mental Health", label: "Mental Health" },
        { value: "Panels", label: "Panels" },
        { value: "Appeals Panels", label: "    Appeals Panels" },
        { value: "Elected Officials Panels", label: "    Elected Officials Panels" },
        { value: "Foster Care Alumni Panels", label: "  Foster Care Alumni Panels" },
        { value: "Human Services Panel", label: "    Human Services Panel" },
        { value: "Judicial Panels", label: "    Judicial Panels" },
        { value: "Podcast", label: "Podcast" },
        { value: "PodReactive Attachment Disorder (RAD)cast", label: "Reactive Attachment Disorder (RAD)" },
        { value: "Sex Education", label: "Sex Education" },
        { value: "Special Education", label: "Special Education" },
        { value: "Therapies", label: "Therapies" },
        { value: "EMDR", label: "    EMDR" },
        { value: "Equine", label: "    Equine" },
        { value: "PCIT", label: "    PCIT" },
        { value: "Speech/Play/Talk/Occupational/Behavioral", label: "    Speech/Play/Talk/Occupational/Behavioral" },
        { value: "Trauma", label: "Trauma" },
    ];
    const productTypes = [
        { value: "In-Person Training", label: "In-Person Training" },
        { value: "On Demand - Englisn", label: "On Demand - Englisn" },
        { value: "Video Por Encargo - Español", label: "Video Por Encargo - Español" },
        { value: "Virtual Training - Live", label: "Virtual Training - Live" },
    ];


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setFilePreview(URL.createObjectURL(selectedFile));
        }
    };



    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            setFile(event.dataTransfer.files[0]);
        }
    };

    const [bannerImage, setBannerImage] = useState<File | null>(null);

    const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setBannerImage(event.target.files[0]);
        }
    };

    const handleBannerDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            setBannerImage(event.dataTransfer.files[0]);
        }
    };

    const handleTagsClick = () => {
        let newComponents = [...components];
        console.log("Webinar value is " + webinar)
        if (webinar && !newComponents.includes("Webinar")) {
            newComponents.push("Webinar");
        }
        if (survey && !newComponents.includes("Survey")) {
            newComponents.push("Survey");
        }
        if (certificate && !newComponents.includes("Certificate")) {
            newComponents.push("Certificate");
        }
        if (!webinar) {
            newComponents = newComponents.filter(value => value !== "Webinar");
        }
        if (!survey) {
            newComponents = newComponents.filter(value => value !== "Survey");
        }
        if (!certificate) {
            newComponents = newComponents.filter(value => value !== "Certificate");
        }
        setComponents(newComponents);
    };

    useEffect(() => {
        handleTagsClick();
    }, [webinar, survey, certificate]);

    const [coursesRecieved, setCoursesRecieved] = useState<boolean>(false);
    const getCourse = useCallback(async () => {
        try {
            const response = await apiClient.get(`/courses/${id}`);
            const course = response.data.data;
            setInputTitleValue(course.className);
            setSummaryValue(course.discussion);
            setDescriptionValue(course.courseDescription);
            setComponents(course.components);
            setDate(course.time);
            setCredit(course.creditNumber);
            setRegStart(course.regStart);
            setCourseType(course.courseType);
            setPrice(course.cost)
            setSelectedOptions(course.categories)
            setSelectedProductTypes(course.productType)
            setIsInPerson(course.isInPerson)
            setIsLive(course.isLive)
            // TODO: Set file paths once that's completed
            setCoursesRecieved(true)
        } catch (e: unknown) {
            const err = e as AxiosError;
            if (err.response && err.response.status === 404) {
                console.log("Course does NOT exist.");
                return false;
            }
            console.log("Error:", e);
        }
    }, [id]);

    useEffect(() => {
        getCourse();
    }, [getCourse]);

    const checkInPersonIsLive = () => {
        if (selectedProductTypes.length > 0) {
            setIsLive(selectedProductTypes.includes("Virtual Training - Live"));
            setIsInPerson(selectedProductTypes.includes("In-Person Training"));
        } else {
            setIsLive(false);
            setIsInPerson(false);
        }
    };
    console.log("isLive", isLive)
    console.log("isInPerson", isInPerson)
    useEffect(() => {
        if (components && components.length > 0) {
            for (let i = 0; i < components.length; i++) {
                if (components[i] === "Webinar") {
                    setWebinar(true);
                } else if (components[i] === "Survey") {
                    console.log("Here")
                    setSurvey(true);
                } else if (components[i] === "Certificate") {
                    setCertificate(true);
                }
            }
        }
        checkInPersonIsLive()
    }, [coursesRecieved]);

    useEffect(() =>{
        checkInPersonIsLive()
    }, [selectedProductTypes]);





    const updateCourse = async () => {
        if (!id) {
            console.error('No course ID found');
            return;
        }
        try {
            console.log(componentsRef)
            const response = await apiClient.put(`/courses/${id}`, {
                className: inputTitleRef.current,
                discussion: inputSummaryValueRef.current,
                components: componentsRef.current,
                creditNumber: creditNumberRef.current,
                courseDescription: inputDescriptionValueRef.current,
                time: dateRef.current,
                // thumbnailPath: file,
                regStart: regStartRef.current,
                courseType: courseTypeRef.current,
                categories: selectedOptionsRef.current,
                productType: selectedProductRef.current,
                isInPerson: isInPersonRef.current,
                isLive: isLiveRef.current
            })
            console.log(response)
        } catch (e) {
            console.log("update Course error " + e)
        }
    }

    const inputTitleRef = useRef(inputTitleValue);
    const inputSummaryValueRef = useRef(inputSummaryValue);
    const componentsRef = useRef(components)
    const creditNumberRef = useRef(credit)
    const inputDescriptionValueRef = useRef(inputDescriptionValue)
    const dateRef = useRef(date)
    const regStartRef = useRef(regStart)
    const courseTypeRef = useRef(courseType)
    const selectedOptionsRef = useRef(selectedOptions)
    const selectedProductRef = useRef(selectedProductTypes)
    const isLiveRef = useRef(isLive)
    const isInPersonRef = useRef(isInPerson)

    // Sync the ref with the latest inputTitleValue:
    useEffect(() => {
        inputTitleRef.current = inputTitleValue;
        inputSummaryValueRef.current = inputSummaryValue;
        componentsRef.current = components;
        creditNumberRef.current = credit;
        inputDescriptionValueRef.current = inputDescriptionValue;
        dateRef.current = date;
        regStartRef.current = regStart;
        courseTypeRef.current = courseType;
        selectedOptionsRef.current = selectedOptions
        selectedProductRef.current = selectedProductTypes
        isLiveRef.current = isLive
        isInPersonRef.current = isInPerson
    }, [
        inputTitleValue,
        inputSummaryValue,
        components,
        credit,
        inputDescriptionValue,
        date,
        regStart,
        courseType,
        selectedOptions,
        selectedProductTypes,
        isLive,
        isInPerson
    ]);


    useEffect(() => {
        return () => {
            if (coursesRecieved && inputTitleRef.current != "") {
                updateCourse();
            }
        };
    }, [coursesRecieved]);


    return (
        <div className="bg-white w-[96%] h-[96%] p-6 rounded-xl shadow-lg" >
            <div className="flex flex-col p-4">
                <p className="text-xl font-bold -mt-2">
                    New Product
                </p>
                <div className="ml-10 mt-3">
                    <div className="flex flex-row justify-between">
                        <p className="text-xs">
                            Title
                        </p>
                        <div className="flex flex-col justify-end">
                            <p className="text-xs mr-52">
                                Catalog
                            </p>
                            <div
                                className="border-2 border-dashed border-gray-400 rounded-lg p-6 w-full max-w-lg mx-auto text-center cursor-pointer"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                            >
                                <div className="flex flex-col items-center">
                                    {/* Upload Icon */}
                                    <span className="text-gray-500 text-2xl">⬆️</span>

                                    {/* Upload Text */}
                                    <p className="font-semibold mt-2">Choose a file or drag & drop it here</p>
                                    <p className="text-gray-400 text-sm">JPEG or PNG format, up to 50MB</p>

                                    {/* File Input */}
                                    <input
                                        type="file"
                                        accept=".jpeg, .jpg, .png"
                                        className="hidden"
                                        id="fileInput"
                                        onChange={handleFileChange}
                                    />
                                    <label
                                        htmlFor="fileInput"
                                        className="mt-4 bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm cursor-pointer"
                                    >
                                        Browse Files
                                    </label>

                                    {/* Show Selected File */}

                                </div>
                            </div>
                            <div className="relative text-center">
                                {file && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[370px] h-[37px] bg-gray-200 flex flex-row items-center px-3 shadow-md rounded-md">
                                        <p className="text-sm text-gray-600 truncate max-w-[80%]">{file.name}</p>
                                        <button className="ml-auto text-right" onClick={() => { setFile(null); setFilePreview(null) }}>
                                            🗑️
                                        </button>
                                    </div>
                                )}
                            </div>

                            <p className="text-xs mr-52 mt-10">
                                Banner Image
                            </p>
                            <div
                                className="border-2 border-dashed border-gray-400 rounded-lg p-6 w-full max-w-lg mx-auto text-center cursor-pointer "
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleBannerDrop}
                            >
                                <div className="flex flex-col items-center">
                                    {/* Upload Icon */}
                                    <span className="text-gray-500 text-2xl">⬆️</span>

                                    {/* Upload Text */}
                                    <p className="font-semibold mt-2">Choose a file or drag & drop it here</p>
                                    <p className="text-gray-400 text-sm">JPEG or PNG format, up to 50MB</p>

                                    {/* File Input */}
                                    <input
                                        type="file"
                                        accept=".jpeg, .jpg, .png"
                                        className="hidden"
                                        id="bannerInput"
                                        onChange={handleBannerChange}
                                    />
                                    <label
                                        htmlFor="bannerInput"
                                        className="mt-4 bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm cursor-pointer"
                                    >
                                        Browse Files
                                    </label>

                                    {/* Show Selected File */}
                                </div>
                            </div>
                            <div className="relative text-center">
                                {bannerImage && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[370px] h-[37px] bg-gray-200 flex flex-row items-center px-3 shadow-md rounded-md">
                                        <p className="text-sm text-gray-600 truncate max-w-[80%] ">{bannerImage.name}</p>
                                        <button className="ml-auto text-right" onClick={() => setBannerImage(null)}>
                                            🗑️
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="-mt-[420px] flex flex-col flex-grow text-sm">
                        <input
                            type="text"
                            className="w-[68%] h-8 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
                            placeholder="Title of the class"
                            value={inputTitleValue}
                            onChange={(e) => setInputTitleValue(e.target.value)}
                        />
                    </div>
                    <div className="mt-3">
                        <p className="text-sm">
                            Summary
                        </p>
                        <div className="text-xs">
                            <textarea
                                className="w-[68%] h-11 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
                                placeholder="Enter text here..."
                                value={inputSummaryValue}
                                onChange={(e) => setSummaryValue(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-sm">
                            Description
                        </p>
                        <textarea
                            className="w-[68%] h-28 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
                            placeholder="Summary of the class"
                            value={inputDescriptionValue}
                            onChange={(e) => setDescriptionValue(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-row">
                        <div className="mt-3 ml-20 gap-1 flex flex-col text-sm">
                            Credits
                            <div className="">
                                <input
                                    type="number"
                                    className="h-8 w-20 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center"
                                    min="0"
                                    max="10"
                                    value={credit}
                                    onChange={(e) => setCredit(Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="mt-3 flex flex-col text-sm">
                            <p className="ml-52">
                                Tags
                            </p>
                            <div className="flex flex-row">
                                <button
                                    onClick={() => { setWebinar(!webinar); handleTagsClick(); }}
                                    className={`w-16 h-4 ml-52 rounded-lg ${webinar ? "bg-orange-400" : "bg-gray-200"}`}>
                                    <p className={`text-xs ${webinar ? "text-black?" : "text-gray-600"}`}>
                                        Webinar
                                    </p>
                                </button>
                                <button
                                    onClick={() => { setSurvey(!survey); handleTagsClick(); }}
                                    className={`w-14 h-4 ml-2 rounded-lg ${survey ? "bg-orange-400" : "bg-gray-200"}`}>
                                    <p className={`text-xs ${survey ? "text-black?" : "text-gray-600"}`}>
                                        Survey
                                    </p>
                                </button>
                                <button
                                    onClick={() => { setCertificate(!certificate); handleTagsClick(); }}
                                    className={`w-20 h-4 ml-2 rounded-lg ${certificate ? "bg-orange-400" : "bg-gray-200"}`}>
                                    <p className={`text-xs ${certificate ? "text-black?" : "text-gray-600"}`}>
                                        Certificate
                                    </p>
                                </button>

                            </div>
                        </div>
                        <div className="flex flex-col mt-3">
                            <p className="ml-20 text-sm">
                                Live Event
                            </p>
                            <input
                                type="datetime-local"
                                className="text-sm w-48 h-8 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center ml-20"
                                value={
                                    date
                                        ? new Date(date).toLocaleString('sv-SE', { hour12: false }).replace(' ', 'T').slice(0, 16)
                                        : ''
                                }
                                onChange={(e) => setDate(new Date(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row">
                        <div className="mt-3 ml-20 gap-1 flex flex-col text-sm ">
                            Categories
                            <Select
                                options={options}
                                isMulti
                                className="basic-multi-select w-96"
                                classNamePrefix="select"
                                value={options.filter(option => selectedOptions.includes(option.value))}
                                onChange={(selected) => setSelectedOptions(selected.map(opt => opt.value))}
                            />
                        </div>
                        <div className="mt-3 ml-20 gap-1 flex flex-col text-sm">
                            Product Types
                            <Select
                                options={productTypes}
                                isMulti
                                className="basic-multi-select w-80"
                                classNamePrefix="select"
                                value={productTypes.filter(productTypes => selectedProductTypes.includes(productTypes.value))}
                                onChange={(selected) => setSelectedProductTypes(selected.map(opt => opt.value))}
                            />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm mt-4">
                            User Preview
                        </p>
                        <div className="w-[1131px] h-72 border border-black rounded-md p-5">
                            <div className="p-4 w-[1095px] h-[250px] border rounded-md shadow-md">
                                <div className="flex flex-col ">
                                    <p className="text-lg">
                                        {inputTitleValue}
                                    </p>
                                </div>
                                <div className="flex flex-row">
                                    <p className="text-xs whitespace-nowrap">
                                        No Rating
                                    </p>
                                    <p className="text-xs ml-5">
                                        {credit}
                                    </p>
                                    <p className="text-xs ml-5 whitespace-nowrap">
                                        {date && (() => {
                                            const dateObj = new Date(date);
                                            return (
                                                <>
                                                    {dateObj.toDateString()} at {dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                                    ({dateObj.toLocaleTimeString("en-US", { timeZoneName: "short" }).split(" ").pop()})
                                                </>
                                            );
                                        })()}
                                    </p>
                                    <div className="relative w-full h-[300px]">
                                        {filePreview && (
                                            <div className="absolute right-0 top-0">
                                                <img
                                                    src={filePreview}
                                                    alt="Preview"
                                                    className="w-[397px] h-[250px] object-cover rounded-lg border border-gray-300 shadow-lg -mt-[44px]"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="-mt-56">
                                    <p className="text-xs max-w-[513px]">
                                        {inputSummaryValue}
                                    </p>
                                </div>
                                <div className="mt-16 flex flex-row">
                                    <button className="w-40 h-9 bg-orange-400 rounded-lg">
                                        <p className="text-white text-xs">
                                            Register {(price == 0) ? <span>(Free) </span> : <span>({price}) </span>}
                                        </p>
                                    </button>
                                    <button className="ml-5 w-40 h-9 border border-orange-400 rounded-lg bg-white">
                                        <p className="text-orange-400 text-xs">
                                            Learn More
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditCourse