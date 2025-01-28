import {useEffect, useState} from "react";
import {Course} from "../../shared/types/course";
import {dummyCourses} from "../../shared/DummyCourses";

export default function Dashboard() {
    const [courses, setCourses] = useState<Course[]>(dummyCourses);

    let user = localStorage.user

    useEffect(() => {
        console.log(user)
        setCourses(dummyCourses);
    }, []);

    return <div>{JSON.stringify(user)}</div>;
}
