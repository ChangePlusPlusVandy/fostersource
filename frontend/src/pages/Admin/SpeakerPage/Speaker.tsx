import React, { useState } from 'react';
import speakerImage from './images/speaker-image.png';

interface Speaker {
    id: number;
    name: string;
    title: string;
    description: string;
    imageUrl: string;
  }
    
  export default function SpeakersPage() {
    const [speakers, setSpeakers] = useState<Speaker[]>([
      {
        id: 1,
        name: "Angela Tucker",
        title: "The Adopted Life",
        description: "Angela Tucker is a nationally-recognized thought leader on transracial adoption and is an advocate for adoptee rights. She is the founder of 'The Adopted Life,' where she provides resources to adoptive families and works to create understanding of the complex experiences of adoptees. Angela shares her personal journey and insights through speaking engagements, workshops, and her documentary work, helping to bridge gaps in understanding between adoptees, birth families, and adoptive parents.",
        imageUrl: speakerImage
      },
      {
        id: 2,
        name: "Angela Tucker",
        title: "The Adopted Life",
        description: "Angela Tucker is a nationally-recognized thought leader on transracial adoption and is an advocate for adoptee rights. She is the founder of 'The Adopted Life,' where she provides resources to adoptive families and works to create understanding of the complex experiences of adoptees. Angela shares her personal journey and insights through speaking engagements, workshops, and her documentary work, helping to bridge gaps in understanding between adoptees, birth families, and adoptive parents.",
        imageUrl: speakerImage
      },
      
    ]);
  
    return (
      <div className="w-full min-h-screen bg-gray-100 p-8">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Speakers</h1>
            <button 
              className="bg-[#8757a3] text-white px-6 py-2 rounded-lg hover:opacity-90"
            >
              Add Speaker
            </button>
          </div>
  
          {/* Speakers List */}
          <div className="space-y-4">
            {speakers.map((speaker) => (
              <div key={speaker.id} className="bg-white rounded-lg border p-6">
                <div className="flex gap-6">
                  {/* Speaker Image */}
                  <div className="w-48 h-48 flex-shrink-0">
                    <img 
                      src={speaker.imageUrl} 
                      alt={speaker.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
  
                  {/* Speaker Info */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-1">{speaker.name}</h2>
                    <h3 className="text-lg text-gray-600 mb-3">{speaker.title}</h3>
                    <p className="text-gray-700 mb-4">{speaker.description}</p>
  
                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button 
                        className="bg-[#8757a3] text-white px-6 py-2 rounded-lg hover:opacity-90"
                      >
                        Edit Speaker Info
                      </button>
                      <button 
                        className="border border-[#8757a3] text-[#8757a3] px-6 py-2 rounded-lg hover:bg-gray-50"
                      >
                        Email Speaker
                      </button>
                      <button 
                        className="text-[#8757a3] hover:underline"
                      >
                        Remove Speaker
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }