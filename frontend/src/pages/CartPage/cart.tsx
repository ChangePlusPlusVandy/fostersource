import {useEffect, useState} from "react";
import {Course} from "../../shared/types/course";
import {dummyCourses} from "../../shared/DummyCourses";

export default function Cart() {
    const [courses, setCourses] = useState<Course[]>(dummyCourses);

    let user = localStorage.user

    useEffect(() => {
        console.log(user)
        setCourses(dummyCourses);
    }, []);

    return <div>Cart Page</div>;
}
