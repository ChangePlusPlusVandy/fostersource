import React, { useState } from 'react';
import { X } from 'lucide-react';

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

  // Define a reusable disabled date input component
  const DisabledDateInput = ({ label, enabled }: { label: string; enabled: boolean }) => (
    <div className="mt-2 mb-4">
      <div className="text-sm text-gray-400">{label}</div>
      <input 
        type="datetime-local" 
        disabled={!enabled}
        className={`w-full p-2 border rounded-lg text-sm ${!enabled ? 'bg-gray-100 text-gray-400' : 'bg-white'}`}
      />
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="max-w-screen-2xl mx-auto px-8 py-6">
        <div className="bg-white border rounded-lg">
          {/* Header */}
          <div className="bg-[#8757a3] text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
            <h1 className="text-lg font-medium">New Product - Pricing</h1>
            {onClose && (
              <button onClick={onClose} className="text-white hover:opacity-80">
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">
              The Inclusive Family Support Model -Live Virtual (01/25/2025)
            </h2>

            <div className="flex gap-8">
              {/* Left Column - Configuration Options */}
              <div className="w-1/3 space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Registration Limit</h3>
                  <select 
                    value={registrationLimit}
                    onChange={(e) => setRegistrationLimit(e.target.value)}
                    className="w-full p-2 border rounded-lg text-sm"
                  >
                    <option value="none">none</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                  </select>
                </div>

                <div className="space-y-2">
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

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Start Sales</h3>
                    <input type="datetime-local" className="w-full p-2 border rounded-lg text-sm" />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">End Sales</h3>
                    <input type="datetime-local" className="w-full p-2 border rounded-lg text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
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

                <div className="space-y-4">
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

              {/* Right Column - Pricing Table */}
              <div className="w-2/3">
                <h3 className="text-sm font-medium mb-4">Individual Pricing</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 text-left text-sm">User Type</th>
                        <th className="p-3 text-center w-24 text-sm">View</th>
                        <th className="p-3 text-center w-24 text-sm">Register</th>
                        <th className="p-3 text-center w-32 text-sm">Instant Register</th>
                        <th className="p-3 text-center w-32 text-sm">Price</th>
                        <th className="p-3 text-center w-32 text-sm">Early Bird Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTypes.map((user, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="p-3 text-sm">{user.type}</td>
                          <td className="p-3 text-center">
                            <input type="checkbox" className="w-4 h-4 accent-[#8757a3]" />
                          </td>
                          <td className="p-3 text-center">
                            <input type="checkbox" className="w-4 h-4 accent-[#8757a3]" />
                          </td>
                          <td className="p-3 text-center">
                            <input type="checkbox" className="w-4 h-4 accent-[#8757a3]" />
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center">
                              <span className="mr-1 text-sm">$</span>
                              <input type="text" className="w-20 p-1 border rounded text-sm" />
                            </div>
                          </td>
                          <td className="p-3">
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