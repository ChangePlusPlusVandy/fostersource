import { Request, Response } from "express";
import 'dotenv/config'

export async function createMeeting() {

        try{
        const response = await fetch('https://zoom.us/oauth/token', {
            method: 'POST',
            headers: {
                'Host': 'zoom.us',
                'Authorization': 'Basic ' + btoa(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'grant_type': 'account_credentials',
                'account_id': `${process.env.ZOOM_ACCOUNT_NUMBER}`
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        console.log(response.json());
    }
    catch (e) {
        console.log(e)
    }

}
    // fetch('https://api.zoom.us/v2/users/me/meetings', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: 'Basic ' + Buffer.from(process.env.ZOOM_CLIENT_ID + ':' + process.env.ZOOM_CLIENT_SECRET).toString('base64')
    //     },
    //     body: JSON.stringify({
    //         agenda: 'Test Meeting Agenda',
    //         default_password: false,
    //         duration: 60,
    //         password: '123456',
    //         settings: {
    //             auto_recording: 'cloud',
    //         },
    //         start_time: '2025-03-25T07:32:55Z',
    //         topic: 'Test Meeting Topic',
    //         tracking_fields: [{
    //             field: 'field1',
    //             value: 'value1'
    //         }],
    //         type: 2
    //     })
    // }).then(async r => {
    //     console.log(await r.json())
    // })}

export function createWebinar(){

}

export function getAllMeetings(){

}

export function getAllWebinars(){

}

export function getMeeting(){

}

export function getWebinar(){

}