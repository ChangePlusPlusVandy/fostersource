export async function createWebinar(){
    const response = await fetch('https://api.zoom.us/v2/users/__USERID__/webinars', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer YOUR_SECRET_TOKEN'
        },
        body: JSON.stringify({
            agenda: 'My Webinar',
            duration: 60,
            password: '123456',
            default_passcode: false,
            recurrence: {
                end_date_time: '2022-04-02T15:59:00Z',
                end_times: 7,
                monthly_day: 1,
                monthly_week: 1,
                monthly_week_day: 1,
                repeat_interval: 1,
                type: 1,
                weekly_days: '1'
            },
            schedule_for: 'jchill@example.com',
            settings: {
                allow_multiple_devices: true,
                alternative_hosts: 'jchill@example.com;thill@example.com',
                alternative_host_update_polls: true,
                approval_type: 0,
                attendees_and_panelists_reminder_email_notification: {
                    enable: true,
                    type: 0
                },
                audio: 'telephony',
                audio_conference_info: 'test',
                authentication_domains: 'example.com',
                authentication_option: 'signIn_D8cJuqWVQ623CI4Q8yQK0Q',
                auto_recording: 'cloud',
                close_registration: true,
                contact_email: 'jchill@example.com',
                contact_name: 'Jill Chill',
                email_language: 'en-US',
                enforce_login: true,
                enforce_login_domains: 'example.com',
                follow_up_absentees_email_notification: {
                    enable: true,
                    type: 0
                },
                follow_up_attendees_email_notification: {
                    enable: true,
                    type: 0
                },
                global_dial_in_countries: ['US'],
                hd_video: false,
                hd_video_for_attendees: false,
                host_video: true,
                language_interpretation: {
                    enable: true,
                    interpreters: [{
                        email: 'interpreter@example.com',
                        languages: 'US,CN'
                    }]
                },
                sign_language_interpretation: {
                    enable: true,
                    interpreters: [{
                        email: 'interpreter@example.com',
                        sign_language: 'American'
                    }]
                },
                panelist_authentication: true,
                meeting_authentication: true,
                add_watermark: true,
                add_audio_watermark: true,
                on_demand: false,
                panelists_invitation_email_notification: true,
                panelists_video: true,
                post_webinar_survey: true,
                practice_session: false,
                question_and_answer: {
                    allow_submit_questions: true,
                    allow_anonymous_questions: true,
                    answer_questions: 'all',
                    attendees_can_comment: true,
                    attendees_can_upvote: true,
                    allow_auto_reply: true,
                    auto_reply_text: 'Thank you for your question. We will get back to you shortly.',
                    enable: true
                },
                registrants_email_notification: true,
                registrants_restrict_number: 100,
                registration_type: 1,
                send_1080p_video_to_attendees: false,
                show_share_button: true,
                survey_url: 'https://example.com',
                enable_session_branding: true,
                allow_host_control_participant_mute_state: false
            },
            start_time: '2022-03-26T06:44:14Z',
            template_id: '5Cj3ceXoStO6TGOVvIOVPA==',
            timezone: 'America/Los_Angeles',
            topic: 'My Webinar',
            tracking_fields: [{
                field: 'field1',
                value: 'value1'
            }],
            type: 5,
            is_simulive: true,
            record_file_id: 'f09340e1-cdc3-4eae-9a74-98f9777ed908'
        })
    });

    console.log(response)
}