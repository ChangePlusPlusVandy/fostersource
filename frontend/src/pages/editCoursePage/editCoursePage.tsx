import React, { useEffect, useState, useCallback, useRef, createContext, useContext } from "react";
import apiClient from "../../services/apiClient"
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { components as selectComponents, OptionProps, GroupBase, Props as SelectProps } from 'react-select';
import ReactSelect from 'react-select';

export const SetOptionsContext = createContext<React.Dispatch<React.SetStateAction<OptionType[]>> | null>(null);
export const useSetOptions = () => useContext(SetOptionsContext);


interface CustomSelectProps extends SelectProps<OptionType, true, GroupBase<OptionType>> {
    setOptions?: React.Dispatch<React.SetStateAction<OptionType[]>>;
  }
  
  

  const CustomSelect = ({ setOptions, ...props }: CustomSelectProps) => {
    return <ReactSelect {...props} />;
  };
  

type OptionType = {
    value: string;
    label: string;
};


const EditCourse = () => {
    const [inputTitleValue, setInputTitleValue] = useState<string>('');
    const [inputSummaryValue, setSummaryValue] = useState<string>(' ');
    const [inputDescriptionValue, setDescriptionValue] = useState<string>(' ');
    const [credit, setCredit] = useState<number>(0);
    const [date, setDate] = useState<Date>(new Date());
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [components, setComponents] = useState<string[]>([]);
    const { id } = useParams();
    const [regStart, setRegStart] = useState<Date>(new Date());
    const [courseType, setCourseType] = useState<string>(' ');
    const [price, setPrice] = useState<number>(0);
    const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
    const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([])
    const [isLive, setIsLive] = useState<boolean>(false)
    const [isInPerson, setIsInPerson] = useState<boolean>(false)
    const [optionValue, setOptionValue] = useState<string[]>([])
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
    const [modalOpen, setModalopen] = useState<boolean>(false)
    const [enteredCategory, setEnteredCategory] = useState<string>("")
    const [oldOptions, setOldOptions] = useState<{ value: string; label: string }[]>([]);
    const [undoEdit, setUndoEdit] = useState<boolean>(false)



    const getOptions = async () => {
        try {
            const response = await apiClient.get("/settings/selectedCategories");
            setOptionValue(response.data.data);
        } catch (e) {
            console.error("Failed to fetch selected categories:", e);
        }
    };

    const mapToOptions = (optionValue: string[]) => {
        const mapped = optionValue.map((item) => ({
            value: item,
            label: item,
        }));
        setOptions(mapped);
        setOldOptions(mapped)
    };


    useEffect(() => {
        mapToOptions(optionValue)
    }, [optionValue])

    useEffect(() => {
        getOptions();
    }, [])

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
            setSelectedOptions(
                course.categories.map((cat:string) => ({ value: cat, label: cat }))
              );
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

    useEffect(() => {
        checkInPersonIsLive()
    }, [selectedProductTypes]);





    const updateCourse = async () => {
        if (!id) {
            console.error('No course ID found');
            return;
        }
        try {
            const selectedValues = selectedOptionsRef.current.map(option => option.value);
            console.log("REF VALUE", selectedOptionsRef.current)
            console.log(selectedValues)
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
                categories: selectedValues,
                productType: selectedProductRef.current,
                isInPerson: isInPersonRef.current,
                isLive: isLiveRef.current
            })
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
    const optionsRef = useRef(options)

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
        optionsRef.current = options
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
        isInPerson,
        options
    ]);


    useEffect(() => {
        return () => {
            if (coursesRecieved && inputTitleRef.current != "") {
                updateCourse();
            }
        };
    }, [coursesRecieved]);

    const updateOptionsLocally = async (category: string) => {
        setOldOptions(options)
        setOptions(options => [...options, { value: category, label: category }]);
    }

    const updateOptions = async () => {
        try { 
            console.log("options in updateOptions", options);
            const values = options.map(option => option.value);
            console.log("values ", values);
            await new Promise(res => setTimeout(res, 100));
            const response = await apiClient.put("/settings/selectedCategories", {
                selectedCategories: values
            });
            console.log(response.data);
        } catch (e) {
            console.log("Error updating categories");
        }
    };

    const CustomOption = (props: OptionProps<OptionType, true>) => {
        const { data, innerRef, innerProps } = props;
        const setOptions = useSetOptions();
      
        const handleDelete = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (!setOptions) return;
      
          const updatedOptions = (props.selectProps.options as OptionType[]).filter(
            (opt) => opt.value !== data.value
          );
          setOptions(updatedOptions);
        };
      
        return (
          <div
            ref={innerRef}
            {...innerProps}
            className="flex justify-between items-center px-3 py-2 hover:bg-gray-100"
          >
            <span>{data.label}</span>
            <button
              onClick={(e) => {
                handleDelete(e);
                setUndoEdit(true);
              }}              
              className="text-red-500 text-xs hover:text-red-700"
            >
              ❌
            </button>
          </div>
        );
      };      
      
    useEffect(() =>{
        console.log("Running")
        updateOptions();
    }, [options])

    console.log("options", options)
    console.log("oldOptions", oldOptions)
    return (

        <div className="flex flex-col p-4">
            <p className="text-xl font-bold -mt-2">
                Details
            </p>
            <div className="ml-10 mt-3">
                <div className="flex flex-row justify-between">
                    <p className="text-xs">
                        Title
                    </p>
                    <div className="relative flex flex-col justify-end -top-6">
                        <p className="text-sm mr-52">
                            Catalog Image
                        </p>
                        <div
                            className="border-2 border-dashed border-gray-400 rounded-lg p-6 w-[350px] mx-auto text-center cursor-pointer"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                        >
                            <div className="flex flex-col items-center">
                                {/* Upload Icon */}
                                <span className="text-gray-500 text-sm">⬆️</span>

                                {/* Upload Text */}
                                <p className="font-semibold mt-2 text-sm">Choose a file or drag & drop it here</p>
                                <p className="text-gray-400 text-sm">JPEG or PNG format, up to 50MB</p>

                                {/* File Input */}
                                <input
                                    type="file"
                                    accept=".jpeg, .jpg, .png"
                                    className="hidden"
                                    id="fileInput"
                                    onChange={handleFileChange}
                                />
                                <div className="flex justify-center mt-2">
                                    <label
                                        htmlFor="fileInput"
                                        className="bg-white text-gray-300 rounded-lg text-xs cursor-pointer border border-gray-300 w-28 h-8 flex items-center justify-center"
                                    >
                                        Browse Files
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="relative text-center">
                            {file && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[350px] h-[30px] bg-gray-200 flex flex-row items-center px-3 shadow-md rounded-md">
                                    <p className="text-sm text-gray-600 truncate max-w-[80%]">{file.name}</p>
                                    <button className="ml-auto text-right" onClick={() => { setFile(null); setFilePreview(null) }}>
                                        🗑️
                                    </button>
                                </div>
                            )}
                        </div>

                        <p className="text-sm mr-52 mt-8">
                            Banner Image
                        </p>
                        <div
                            className="border-2 border-dashed border-gray-400 rounded-lg p-6 w-full max-w-lg mx-auto text-center cursor-pointer "
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleBannerDrop}
                        >
                            <div className="flex flex-col items-center">
                                {/* Upload Icon */}
                                <span className="text-gray-500 text-sm">⬆️</span>

                                {/* Upload Text */}
                                <p className="font-semibold mt-2 text-sm">Choose a file or drag & drop it here</p>
                                <p className="text-gray-400 text-sm">JPEG or PNG format, up to 50MB</p>

                                {/* File Input */}
                                <input
                                    type="file"
                                    accept=".jpeg, .jpg, .png"
                                    className="hidden"
                                    id="bannerInput"
                                    onChange={handleBannerChange}
                                />
                                <div className="flex justify-center mt-2">
                                    <label
                                        htmlFor="fileInput"
                                        className="bg-white text-gray-300 rounded-lg text-xs cursor-pointer border border-gray-300 w-28 h-8 flex items-center justify-center"
                                    >
                                        Browse Files
                                    </label>
                                </div>
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

                <div className="-mt-[355px] flex flex-col flex-grow text-sm">
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
                    <div className="mt-3 gap-1 flex flex-col text-sm">
                        Credits
                        <div className="">
                            <input
                                type="number"
                                className="h-9 w-20 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center"
                                min="0"
                                max="10"
                                value={credit}
                                onChange={(e) => setCredit(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="mt-3 ml-20 gap-1 flex flex-col text-sm ">
                        Categories
                        <SetOptionsContext.Provider value={setOptions}>
                            <CustomSelect
                                className="w-[250px]"
                                options={options}
                                isMulti
                                value={selectedOptions}
                                onChange={(selected) => {setSelectedOptions(selected as OptionType[])}}
                                components={{ Option: CustomOption }}
                            />
                        </SetOptionsContext.Provider>




                    </div>
                    <div className="mt-9 ml-5">
                        <button className="w-32 h-10 text-purple-400" onClick={() => setModalopen(!modalOpen)}>
                            <p className="text-xs font-medium text-purple-400">
                                Add Category
                            </p>
                        </button>
                    </div>
                </div>
                {modalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setModalopen(false)}>
                        <div className="md:w-[389px] md:h-[199px] w-[300px] h-[140px] flex bg-white overflow-auto border rounded-md p-5 md:p-6" onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-col w-full">
                                <div className="flex flex-row">
                                    <p className="font-medium md:text-2xl text-lg">
                                        Add Category Type
                                    </p>
                                    <button className="flex ml-auto w-7 h-7 border border-gray-500 items-center justify-center rounded-sm"
                                        onClick={(e) => setModalopen(false)}>
                                        <p className="text-3xl font-thin">
                                            ×
                                        </p>
                                    </button>
                                </div>
                                <p className="mt-2 md:mt-3 text-xs md:text-sm">
                                    Name
                                </p>
                                <input
                                    className="border w-full"
                                    type="text"
                                    value={enteredCategory}
                                    onChange={(e) => setEnteredCategory(e.target.value)}
                                />
                                <div className="flex flex-row ml-auto">
                                    <button
                                        className="w-[100px] h-[20px] md:w-[110px] md:h-[35px] border border-gray-400 bg-gray-white rounded-md mt-5 mr-3"
                                        onClick={() => { setModalopen(false); setEnteredCategory("") }}>
                                        <p className="text-gray-400 text-sm">
                                            Cancel
                                        </p>
                                    </button>
                                    <button
                                        className="w-[100px] h-[20px] md:w-[110px] md:h-[35px] border bg-purple-500 rounded-md  mt-5"
                                        onClick={() => { setModalopen(false); setEnteredCategory(""); updateOptionsLocally(enteredCategory)}}>
                                        <p className="text-white text-sm">
                                            Create Type
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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
                                        Register {(price === 0) ? <span>(Free) </span> : <span>({price}) </span>}
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
            <div className="relative w-full h-[100px]"> {/* Set height to control layout */}
                {/* Floating Undo box */}
                {undoEdit && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-5">
                        <div className="w-[211px] h-[48px] drop-shadow-md bg-white border rounded-sm flex flex-row items-center justify-center p-3">
                            <p className="flex items-center justify-center text-xs whitespace-nowrap">
                                Item Deleted
                            </p>
                            <button className="flex items-center justify-center bg-purple-400 rounded-md w-[84px] h-[30px] ml-10"
                            onClick={() => {setOptions(oldOptions); setUndoEdit(false)}}>
                                <p className="text-white text-xs">Undo</p>
                            </button>
                        </div>
                    </div>
                )}
                {/* Button group pinned to bottom right */}
                <div className="flex flex-row w-full mt-5">
                    <button
                        type="button"
                        className="w-[111px] h-[35px] border border-white bg-white rounded-md flex items-center justify-center ml-auto mr-5"
                        onClick={() => updateCourse()}
                    >
                        <span className="text-purple-400 text-xs">Exit and Save</span>
                    </button>
                    <button
                        type="button"
                        className="w-[111px] h-[35px] border bg-purple-400 rounded-md flex items-center justify-center"
                        onClick={() => {updateCourse()}}
                    >
                        <span className="text-white text-xs">Next</span>
                    </button>
                </div>
            </div>


        </div>

    )
}

export default EditCourse