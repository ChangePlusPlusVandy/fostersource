import React, { useState } from "react";

const faqs = [
  {
    category: "Classes & Childcare",
    items: [
      {
        q: "What time are Learning Source classes held? What about childcare?",
        a: "Our classes are held on Saturday mornings from 9:30–11:30am virtually right now, but are also held throughout Colorado when we are able to go in person. The classes are always free for foster parents and always include free childcare, giving foster parents personal time of respite and kids time to spend with other children who have experienced similar displacement issues.",
      },
      {
        q: "How can I find upcoming support groups?",
        a: (
          <span>
            We call them "Connections" and typically offer them on the 4th Saturday of every month from 9:30–11:30am.
            <br /><br />
            Each class is 2 hours long and you earn a certificate for continuing education hours. You will both need to create separate accounts to get your training hours, but you are welcome to watch together on the same device. Email{" "}
            <a href="mailto:info@bethesource.org" className="hover:underline" style={{ color: "#F79518" }}>
              info@bethesource.org
            </a>{" "}
            to get help getting certification hours. It works best if you both register for each class and then both log in — at that point you can mute one device and watch together on the other.
            <br /><br />
            Upcoming live events:{" "}
            <a href="/catalog" className="hover:underline" style={{ color: "#F79518" }}>Catalog</a>. On-demand classes are also listed there — we add new classes often!
          </span>
        ),
      },
    ],
  },
  {
    category: "Account & Registration",
    items: [
      {
        q: "How do I set up my profile?",
        a: "On the main page, select Log In if you already have an account. If you are new, select Create Account. When creating your profile, please provide all required information. Please take a moment to tell us what you are interested in — this will help us provide relevant training opportunities.",
      },
      {
        q: "Can I create a joint account with my spouse/significant other?",
        a: "In order for you both to get credit and receive a certificate, you each need to have your own account/profile. If you create a joint profile, only one certificate with the user name will generate upon completion of the training.",
      },
      {
        q: "Can I register my spouse/significant other for a training from my account?",
        a: "Yes. The other person you are registering must have their own account/profile on The Learning Source.",
      },
      {
        q: "How do I cancel my registration for a training/event?",
        a: (
          <span>
            There is not a way for you to cancel your own registration. Please contact us at{" "}
            <a href="mailto:info@bethesource.org" className="hover:underline" style={{ color: "#F79518" }}>
              info@bethesource.org
            </a>{" "}
            and we can cancel it for you. Make sure to include your name and the event you need to cancel.
          </span>
        ),
      },
    ],
  },
  {
    category: "Finding & Attending Trainings",
    items: [
      {
        q: "How can I find trainings/events?",
        a: (
          <span>
            You can browse the{" "}
            <a href="/catalog" className="hover:underline" style={{ color: "#F79518" }}>catalog</a>
            {" "}to see all upcoming events — both live in-person and live-virtual.
            <br /><br />
            Online training has two options:{" "}
            <a href="/catalog?format=Live" className="hover:underline" style={{ color: "#F79518" }}>Upcoming</a>
            {" "}(scheduled live sessions) or{" "}
            <a href="/catalog?format=On-Demand" className="hover:underline" style={{ color: "#F79518" }}>On-Demand</a>
            {" "}(watch any time).
          </span>
        ),
      },
      {
        q: "How do I register for a training/event?",
        a: "Once you find a training/event you want to attend, click on the event title or the View button. Here you can read about the event, the speaker, and the required components for completion. Select Register (Free!) in the upper right corner.",
      },
      {
        q: "How do I register children for childcare at events/training?",
        a: "Childcare registration is done on the same page as your own registration. There are input boxes for each child's name, age, and any allergies or concerns.",
      },
      {
        q: "How do I access products that I am registered for?",
        a: (
          <span>
            Once you have registered for an event, you can access it on your{" "}
            <a href="/dashboard" className="hover:underline" style={{ color: "#F79518" }}>Dashboard</a>.
          </span>
        ),
      },
    ],
  },
  {
    category: "Completing Trainings & Certificates",
    items: [
      {
        q: "How do I complete the survey?",
        a: "On your dashboard, select the event you attended and open the Contents tab. Click the yellow Mark as Complete button on the In-person or Live Virtual component first. Then select the Survey Component and complete the survey.\n\nIf the Contents tab says you must wait for the Live event to be over, try refreshing the page — that should correct it.",
      },
      {
        q: "Where can I view/print my certificates?",
        a: (
          <span>
            All certificates for completed trainings are on your{" "}
            <a href="/dashboard" className="hover:underline" style={{ color: "#F79518" }}>Dashboard</a>. From your Dashboard, select Transcript/Achievements.
          </span>
        ),
      },
      {
        q: "Where do I get the verification code for the training?",
        a: "During live virtual events, the verification code will be announced, shown on screen, and typed in the chat box. For on-demand events, it will be announced and shown on screen.\n\nPlease enter the code in the event on your dashboard as soon as you see or hear it. We will not email out the verification code if you miss it — the purpose is to ensure everyone watches the full session to receive their 2 hours of training credit.",
      },
      {
        q: "I had to take a break while watching an on-demand recording and now have to start over?",
        a: "We recommend pausing the video and leaving your browser open if you need a break. Unfortunately, the system does not allow fast forwarding — this ensures everyone watches the full training to earn their hours. If you do need to start over, let the video play from the beginning until you reach the spot you left off.",
      },
    ],
  },
  {
    category: "Pricing & Fees",
    items: [
      {
        q: "Why do I have to pay $20 per class if I am a foster parent outside of Colorado?",
        a: (
          <span>
            We are thrilled to be seeing so many out-of-state foster parents in the classroom. Currently our expenses are stretched beyond our funding as our classroom continues to grow.{" "}
            <span className="font-bold italic">
              Until we can secure financial support for out-of-state foster parents, we are asking all foster parents outside of Colorado to pay $20 / training in the Learning Source.
            </span>{" "}
            This will help us offset the additional cost of hosting larger groups. Thank you for your understanding!
            <br /><br />
            <span className="font-bold italic">Foster Parent Connections events will remain free for all foster parents.</span>
          </span>
        ),
      },
      {
        q: "Why do I have to pay $25 per class if I am not a foster parent?",
        a: "As a nonprofit, Foster Source is focused on providing support services for foster parents. The fee of $25 per class for non foster parents helps defray costs for trauma-informed speakers and ongoing security/hosting of the Learning Source platform. If you are a case manager, teacher, social worker, CASA and/or adoptive parent(s), you can receive two hours of continuing education units as well. Perhaps more importantly, you help keep the Learning Source free for foster parents! We appreciate your support.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-lg transition-all duration-200"
      style={{
        border: open ? "1.5px solid #F79518" : "1.5px solid #E5E7EB",
        background: open ? "#FFFBF5" : "#FFFFFF",
        marginBottom: 8,
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center justify-between gap-3"
        style={{ padding: "14px 18px", background: "none", border: "none", cursor: "pointer" }}
      >
        <span
          className="text-sm font-bold leading-snug flex-1"
          style={{ color: open ? "#F79518" : "#1F2937", transition: "color 0.2s" }}
        >
          {q}
        </span>
        <span
          className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{
            width: 26, height: 26,
            background: open ? "#F79518" : "#F3F4F6",
            transition: "background 0.2s, transform 0.25s",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <line x1="6" y1="1" x2="6" y2="11" stroke={open ? "#fff" : "#6B7280"} strokeWidth="2" strokeLinecap="round" />
            <line x1="1" y1="6" x2="11" y2="6" stroke={open ? "#fff" : "#6B7280"} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <div style={{ maxHeight: open ? 600 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
        <div
          className="text-sm text-gray-600 leading-relaxed"
          style={{ padding: "12px 18px 16px", borderTop: "1px solid #FDE8C8" }}
        >
          {typeof a === "string"
            ? a.split("\n\n").map((p, i) => (
                <p key={i} style={{ margin: i === 0 ? "0 0 8px" : "8px 0 0" }}>{p}</p>
              ))
            : a}
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="w-full p-5 pb-20">
      <div className="container mx-auto p-2">

        {/* Header */}
        <div className="pt-2 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Frequently Asked Questions <span className="text-gray-400 font-normal text-2xl">(FAQs)</span>
          </h1>
        </div>

        {/* Category sections */}
        <div className="container mx-auto flex flex-col space-y-6">
          {faqs.map((section) => (
            <div key={section.category}>
              <div className="flex items-center gap-2 mb-3">
                <div style={{ width: 4, height: 16, background: "#F79518", borderRadius: 2, flexShrink: 0 }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9CA3AF" }}>
                  {section.category}
                </span>
              </div>
              {section.items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          ))}

          {/* Footer callout */}
          <div
            className="rounded-lg mt-2 mb-10"
            style={{ background: "#FFF8EE", border: "1.5px solid #FDE8C8", padding: "14px 18px" }}
          >
            <p className="text-sm" style={{ color: "#92400E", margin: 0, lineHeight: 1.6 }}>
              <strong>Still have questions?</strong> Reach out at{" "}
              <a href="mailto:info@bethesource.org" className="hover:underline font-semibold" style={{ color: "#F79518" }}>
                info@bethesource.org
              </a>{" "}
              and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}