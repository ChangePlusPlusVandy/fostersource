export type Rating = {
    userId: string,
    courseId: string,
    rating: number
}

export type Course = {
    className: string,
    description: string,
    instructor: string,
    creditNumber: number,
    discussion: string,
    components: any[],
    handouts: string[],
    Ratings: Rating[],
    isLive: boolean
}
