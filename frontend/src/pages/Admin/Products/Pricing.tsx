import React, { useState } from 'react';
import { X as XIcon } from 'lucide-react';

interface UserType {
  type: string;
  view: boolean;
  register: boolean;
  instantRegister: boolean;
  price: string;
  earlyBirdPrice: string;
}

interface PricingProps {
  onClose?: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onClose }) => {
  const [registrationLimit, setRegistrationLimit] = useState('none');
  const [privateRegistration, setPrivateRegistration] = useState(false);
  const [earlyBirdPricing, setEarlyBirdPricing] = useState(false);
  const [noEndSales, setNoEndSales] = useState(false);
  const [autoCloseAccess, setAutoCloseAccess] = useState(false);
  const [delayedOpening, setDelayedOpening] = useState(false);
  const [emailManagers, setEmailManagers] = useState(false);
  const [emailRegistrants, setEmailRegistrants] = useState(false);
  const [expirationDays, setExpirationDays] = useState('0');

  const [userTypes, setUserTypes] = useState<UserType[]>(
    Array(15).fill({
      type: 'Former FP/Adoptive Parent',
      view: false,
      register: false,
      instantRegister: false,
      price: '',
      earlyBirdPrice: ''
    })
  );

  const DisabledDateInput = ({ label, enabled }: { label: string; enabled: boolean }) => (
    <div className="ml-6 mt-1">
      <div className={`text-sm ${enabled ? 'text-gray-900' : 'text-gray-400'}`}>{label}</div>
      <input 
        type="datetime-local" 
        disabled={!enabled}
        className={`w-64 p-2 border rounded-lg text-sm ${!enabled ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-900'}`}
        placeholder="__/__/____ __:__"
      />
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="max-w-screen-2xl mx-auto px-8 py-6">
        <div className="bg-white border rounded-lg">
          <div className="bg-[#8757a3] text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
            <h1 className="text-lg font-medium">New Product - Pricing</h1>
            {onClose && (
              <button 
                onClick={onClose} 
                className="flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 hover:bg-white group"
                aria-label="Close"
              >
                <XIcon className="w-6 h-6 text-white group-hover:text-[#8757a3] stroke-2" />
              </button>
            )}
          </div>

          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">
              The Inclusive Family Support Model -Live Virtual (01/25/2025)
            </h2>

            <div className="flex gap-8">
              <div className="w-1/3">
                <h3 className="text-sm font-medium mb-2">Registration Limit</h3>
                <select 
                  value={registrationLimit}
                  onChange={(e) => setRegistrationLimit(e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm mb-6"
                >
                  <option value="none">none</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                </select>

                <div className="space-y-2 mb-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={privateRegistration}
                      onChange={(e) => setPrivateRegistration(e.target.checked)}
                      className="w-4 h-4 accent-[#8757a3]"
                    />
                    <span>Private Registration</span>
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={earlyBirdPricing}
                      onChange={(e) => setEarlyBirdPricing(e.target.checked)}
                      className="w-4 h-4 accent-[#8757a3]"
                    />
                    <span>Early Bird Pricing</span>
                  </label>
                  <DisabledDateInput label="Expiration" enabled={earlyBirdPricing} />
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Start Sales</h3>
                    <input 
                      type="datetime-local" 
                      className="w-64 p-2 border rounded-lg text-sm" 
                      placeholder="__/__/____ __:__"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">End Sales</h3>
                    <input 
                      type="datetime-local" 
                      className="w-64 p-2 border rounded-lg text-sm" 
                      placeholder="__/__/____ __:__"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={noEndSales}
                      onChange={(e) => setNoEndSales(e.target.checked)}
                      className="w-4 h-4 accent-[#8757a3]"
                    />
                    <span>No End Sales</span>
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={autoCloseAccess}
                      onChange={(e) => setAutoCloseAccess(e.target.checked)}
                      className="w-4 h-4 accent-[#8757a3]"
                    />
                    <span>Automatically Close Access</span>
                  </label>
                  <DisabledDateInput label="Close Access After" enabled={autoCloseAccess} />

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={delayedOpening}
                      onChange={(e) => setDelayedOpening(e.target.checked)}
                      className="w-4 h-4 accent-[#8757a3]"
                    />
                    <span>Delayed Product Opening</span>
                  </label>
                  <DisabledDateInput label="Open For Access Date" enabled={delayedOpening} />
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-sm font-medium">Expire Registrations</h3>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={expirationDays}
                      onChange={(e) => setExpirationDays(e.target.value)}
                      className="w-16 p-2 border rounded-lg text-sm"
                      min="0"
                    />
                    <select className="flex-1 p-2 border rounded-lg text-sm">
                      <option>Days from Registration</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={emailManagers}
                      onChange={(e) => setEmailManagers(e.target.checked)}
                      className="w-4 h-4 accent-[#8757a3]"
                    />
                    <span>Email Managers On Completions</span>
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={emailRegistrants}
                      onChange={(e) => setEmailRegistrants(e.target.checked)}
                      className="w-4 h-4 accent-[#8757a3]"
                    />
                    <span>Email Registrants on Completion</span>
                  </label>
                </div>
              </div>

              <div className="w-2/3">
                <h3 className="text-sm font-medium mb-2">Individual Pricing</h3>
                <div className="border rounded-lg overflow-hidden border-gray-300">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-left text-sm font-medium border-b border-gray-300">User Type</th>
                        <th className="p-3 text-center w-24 text-sm font-medium border-b border-gray-300">View</th>
                        <th className="p-3 text-center w-24 text-sm font-medium border-b border-gray-300">Register</th>
                        <th className="p-3 text-center w-32 text-sm font-medium border-b border-gray-300">Instant Register</th>
                        <th className="p-3 text-center w-32 text-sm font-medium border-b border-gray-300">Price</th>
                        <th className="p-3 text-center w-32 text-sm font-medium border-b border-gray-300">Early Bird Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTypes.map((user, index) => (
                        <tr key={index} className={index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="p-3 text-sm border-b border-gray-200">{user.type}</td>
                          <td className="p-3 text-center border-b border-gray-200">
                            <input type="checkbox" className="w-4 h-4 accent-[#8757a3]" />
                          </td>
                          <td className="p-3 text-center border-b border-gray-200">
                            <input type="checkbox" className="w-4 h-4 accent-[#8757a3]" />
                          </td>
                          <td className="p-3 text-center border-b border-gray-200">
                            <input type="checkbox" className="w-4 h-4 accent-[#8757a3]" />
                          </td>
                          <td className="p-3 border-b border-gray-200">
                            <div className="flex items-center justify-center">
                              <span className="mr-1 text-sm">$</span>
                              <input type="text" className="w-20 p-1 border rounded text-sm" />
                            </div>
                          </td>
                          <td className="p-3 border-b border-gray-200">
                            <div className="flex items-center justify-center">
                              <span className="mr-1 text-sm">$</span>
                              <input type="text" className="w-20 p-1 border rounded text-sm" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;