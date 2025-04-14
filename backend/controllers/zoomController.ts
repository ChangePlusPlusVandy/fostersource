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
            const webinars = await fetch(`https://api.zoom.us/v2/users/${process.env.ZOOM_USER_ID}/webinars`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            })
            console.log(await webinars.json())
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
    try {
        await getToken().then(async (token) => {
            const response = await fetch('https://api.zoom.us/v2/users/${process.env.ZOOM_USER_ID}/meetings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify({
                    topic: 'My Meeting',
                    type: 2,
                    start_time: '2022-03-25T07:32:55Z',
                    duration: 60,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error creating meeting:', errorData);
            } else {
                const data = await response.json();
                console.log('Meeting created:', data);
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal service error",
        });
    }
};