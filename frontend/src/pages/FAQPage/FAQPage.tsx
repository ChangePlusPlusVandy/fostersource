import React from "react";

export default function FAQPage() {

  return (
    <div className="w-full p-5">
      <div className="container mx-auto p-2 border rounded-md border-gray-200">
        <div className="pt-2 mb-10 border-b border-green-400">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">FAQs</h1>
        </div>

        <div className="container mx-auto flex flex-col space-y-4">
          <div>
            <div className="font-bold" style={{color: "#F79518"}}>What time are Learning Source classes held? What about childcare?</div>
            <div className="mt-2 text-sm">
              Our classes are held on Saturday mornings from 9:30-11:30am virtually right now, but are also held throughout Colorado when we are able to go in person. The classes are always free for foster parents and always include free childcare, giving foster parents personal time of respite and kids time to spend with other children who have experienced similar displacement issues.
            </div>
          </div>

          <div>
            <div className="font-bold" style={{color: "#F79518"}}>How do I set up my profile?</div>
            <div className="mt-2 text-sm">
              On the main page, select Log In if you already have an account. If you are new, select Create Account. When creating your profile, please provide all required information. Please take a moment to tell us what you are interested in. This will help us to provide relevant training opportunities.
            </div>
          </div>

          <div>
            <div className="font-bold" style={{color: "#F79518"}}>Can I create a joint account with my spouse/significant other?</div>
            <div className="mt-2 text-sm">
              In order for you both to get credit and receive a certificate, you each need to have your own account/profile. If you create a joint profile, only one certificate with the user name will generate upon completion of the training.
            </div>
          </div>

          <div>
            <div className="font-bold" style={{color: "#F79518"}}>Can I register my spouse/significant other for a training from my account?</div>
            <div className="mt-2 text-sm">
              Yes. The other person you are registering must have their own account/profile on The Learning Source.
            </div>
          </div>

          <div>
            <div className="font-bold" style={{color: "#F79518"}}>How can I find trainings/events?</div>
            <div className="mt-2 text-sm space-y-2">
              <div>
                You can browse the
                <a href="/catalog" className="cursor-pointer hover:underline mx-1" style={{color: "#F79518"}}>catalog</a>
                to see all upcoming events. This will display events that are going to be live in-person as well as events that will be live-virtual.
              </div>
              <div>
                You can also browse all upcoming live in-person events at
                <a href="/catalog?format=Live" className="cursor-pointer hover:underline ml-1" style={{color: "#F79518"}}>In-Person Training</a>
                . Online training has two options for events. You can browse by selecting
                <a href="/catalog?format=Live" className="cursor-pointer hover:underline mx-1" style={{color: "#F79518"}}>Upcoming</a>
                or
                <a href="/catalog?format=On-Demand" className="cursor-pointer hover:underline ml-1" style={{color: "#F79518"}}>On-Demand</a>.
              </div>
            </div>
          </div>

          <div>
            <div className="font-bold" style={{color: "#F79518"}}>How can I find upcoming support groups?</div>
            <div className="mt-2 text-sm space-y-2">
              <div>We call them "Connections" and typically offer them on the 4th Saturday of every month from 9:30-11:30am.</div>
              <div>The Learning Source has live online classes as well as on demand classes. Each class is 2 hours long and you earn a certificate for continuing education hours. Create an account here:
                <a href="/login" className="cursor-pointer hover:underline ml-1" style={{color: "#F79518"}}>Login</a>. 
                You will both need to create separate accounts to be sure you can each get your training hours. However, you are welcome to watch classes together on the same device. You can always email
                <a href="mailto:learning@fostersource.org" className="cursor-pointer hover:underline mx-1" style={{color: "#F79518"}}>learning@fostersource.org</a>
                to get help getting certification hours. It works best if you both register for each class, then both log in to the class. At that point you are welcome to mute one device and watch together on the other.</div>
              <div>Upcoming live events are open for registration here:
                <a href="/catalog" className="cursor-pointer hover:underline ml-1" style={{color: "#F79518"}}>Catalog</a>. Keep an eye on that link. We are adding classes often.</div>
              <div>On demand classes are here:<a href="/catalog" className="cursor-pointer hover:underline mx-1" style={{color: "#F79518"}}>Catalog</a></div>
            </div>
          </div>
          
          <div>
            <div className="font-bold" style={{color: "#F79518"}}>How do I register for a training/event?</div>
            <div className="mt-2 text-sm">
              Once you find a training/event you want to attend, click on the event title or the button on the event that says View. Here is where you can read about the event, the speaker for the event, and view the required components for completion. Select the button that says Register (Free!) in the upper right corner.
            </div>
          </div>
          
          <div>
            <div className="font-bold" style={{color: "#F79518"}}>How do I register children for childcare at events/training?</div>
            <div className="mt-2 text-sm">
              Childcare registration is done on the same page as your registration. There are input boxes for each child's name, age, and any allergies/concerns.
            </div>
          </div>
          
          <div>
            <div className="font-bold" style={{color: "#F79518"}}>How do I access products that I am registered for?</div>
            <div className="mt-2 text-sm">
              Once you have registered for an event, or multiple events, you can access them on your
              <a href="/dashboard" className="cursor-pointer hover:underline ml-1" style={{color: "#F79518"}}>Dashboard</a>.
            </div>
          </div>
          
          <div>
            <div className="font-bold" style={{color: "#F79518"}}>How do I complete the survey?</div>
            <div className="mt-2 text-sm space-y-2">
              <div>On your dashboard, select the event you attended. Select the Contents tab. The first component will be the In-person or Live Virtual event. Click the yellow button that says Mark as Complete. Then select the Survey Component. Complete the survey.</div>
              <div>If your Contents tab is telling you that you must wait fort the Live event to be over, please refresh the page. That should correct it and allow you to complete all components.</div>
            </div>
          </div>
          
          <div>
            <div className="font-bold" style={{color: "#F79518"}}>Where can I view/print my certificates?</div>
            <div className="mt-2 text-sm">
              All of your certificates for completed trainings will be on your
              <a href="/dashboard" className="cursor-pointer hover:underline ml-1" style={{color: "#F79518"}}>Dashboard</a>. On your Dashboard, select Transcript/Achievements.
            </div>
          </div>
          
          <div>
            <div className="font-bold" style={{color: "#F79518"}}>How do I cancel my registration for a training/event?</div>
            <div className="mt-2 text-sm">
              There is not a way for you to cancel your registration. Please contact us at 
              <a href="mailto:learning@fostersource.org" className="cursor-pointer hover:underline mx-1" style={{color: "#F79518"}}>learning@fostersource.org</a>and we can cancel it for you. Make sure to include your name and the event that you need to cancel registration for.
            </div>
          </div>
          
          <div>
            <div className="font-bold" style={{color: "#F79518"}}>Where do I get the verification code for the training?</div>
            <div className="mt-2 text-sm space-y-2">
              <div>During live virtual events, the verification code will be announced, shown on screen, and typed in the chat box.</div>
              <div>For on-demand events, the verification code will be announced and shown on the screen.</div>
              <div>Please input the verification code in the event on your dashboard as soon as you see/hear it.</div>
              <div>We will not email out the verification code if you miss it. The purpose of the code is make sure everyone is attending/watching for the full time in order to receive their 2 hours of training credit.</div>
            </div>
          </div>
          
          <div>
            <div className="font-bold" style={{color: "#F79518"}}>I had to take a break while watching an on-demand recording and now have to start over?</div>
            <div className="mt-2 text-sm">
              If you need to take a break while watching an on-demand recording, we recommend pausing the video and leaving your browser open. Unfortunately, the system does not allow fast forwarding of on-demand videos. This is how we can ensure that everyone watches the entire training to earn their hours. If you need to start over, we recommend starting the video and letting it play until you get back to the place you left off.
            </div>
          </div>
          
          <div>
            <div className="font-bold" style={{color: "#F79518"}}>Why do I have to pay $20 per class if I am a foster parent outside of Colorado?</div>
            <div className="mt-2 text-sm space-y-2">
              <div>
              We are thrilled to be seeing so many out of state foster parents in the classroom. Currently our expenses are stretched beyond our funding as our classroom continues to grow.
              <span className="font-bold italic mx-1">Until we can secure financial support for out of state foster parents, we are asking all foster parents outside of Colorado to pay $20 / training in the Learning Source.</span>
              This will help us offset the additional cost of hosting larger groups. Thank you for your understanding!
              </div>
              <div className="font-bold italic">Foster Parent Connections events will remain free for all foster parents.</div>
            </div>
          </div>
          
          <div>
            <div className="font-bold" style={{color: "#F79518"}}>Why do I have to pay $25 per class if I am not a foster parent?</div>
            <div className="mt-2 text-sm">
              As a nonprofit, Foster Source is focused on providing support services for foster parents. The fee of $25 per class for non foster parents helps defray costs for trauma-informed speakers and ongoing security/hosting of the Learning Source platform. If you are a case manager, teacher, social worker, CASA and/or adoptive parent(s), you can receive two hours of continuing education units as well. Perhaps more importantly, you help keep the Learning Source free for foster parents! We appreciate your support.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}