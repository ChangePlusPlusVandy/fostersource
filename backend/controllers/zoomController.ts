import {Request, Response} from "express";
import dotenv from "dotenv";
dotenv.config();
// @desc    Get a bearer token
// @route   GET /api/zoom/token
// @access  Public
async function getToken(){
    try {
        const credentials = btoa(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`);

        const token = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        return (await token.json()).access_token
    } catch (error) {
        console.error(error);
        return undefined
    }
}

export const getMeetings = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        await getToken().then(async (token) => {
            const response = await fetch(`https://api.zoom.us/v2/users/${process.env.ZOOM_USER_ID}/meetings`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            })
            let meetings = await response.json()
            res.status(200).json(meetings)
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal service error",
        });
    }
};

export const getWebinars = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        await getToken().then(async (token) => {

            const response = await fetch(`https://api.zoom.us/v2/users/${process.env.ZOOM_USER_ID}/webinars`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            })
            let webinars = (await response.json()).webinars
            res.status(200).json({
                webinars: webinars
            })
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal service error",
        });
    }
};

export const createMeeting = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { topic, startTime, duration } = req.body;
    try {
        await getToken().then(async (token) => {

            const response = await fetch(`https://api.zoom.us/v2/users/${process.env.ZOOM_USER_ID}/meetings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    topic,
                    start_time: startTime,
                    duration: duration
                })
            });
            let meeting = await response.json()
            console.log(meeting)
            res.status(200).json({
                meeting: meeting
            })
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal service error",
        });
    }


};

export const createWebinar = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { topic, startTime, duration } = req.body;
    try {
        await getToken().then(async (token) => {
            const response = await fetch(`https://api.zoom.us/v2/users/${process.env.ZOOM_USER_ID}/webinars`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    topic,
                    start_time: startTime,
                    duration: duration
                })
            });
            let webinar = await response.json()
            console.log(webinar)
            res.status(200).json({
                webinar: webinar
            })
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal service error",
        });
    }
};