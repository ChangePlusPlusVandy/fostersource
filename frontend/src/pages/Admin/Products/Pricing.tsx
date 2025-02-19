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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-screen-xl mx-auto bg-white rounded-lg shadow">
        <div className="bg-[#8757a3] text-white p-4 rounded-t-lg flex justify-between items-center">
          <h1 className="text-xl font-medium">New Product - Pricing</h1>
          {onClose && (
            <button onClick={onClose} className="text-white hover:opacity-80">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            The Inclusive Family Support Model -Live Virtual (01/25/2025)
          </h2>

          <div className="space-y-6">
            <div className="flex gap-8">
              <div className="w-1/3">
                <label className="block mb-2 font-medium">Registration Limit</label>
                <select 
                  value={registrationLimit}
                  onChange={(e) => setRegistrationLimit(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="none">none</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                </select>
              </div>

              <div className="w-2/3 space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={privateRegistration}
                    onChange={(e) => setPrivateRegistration(e.target.checked)}
                    className="w-4 h-4 accent-[#8757a3]"
                  />
                  <span>Private Registration</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={earlyBirdPricing}
                    onChange={(e) => setEarlyBirdPricing(e.target.checked)}
                    className="w-4 h-4 accent-[#8757a3]"
                  />
                  <span>Early Bird Pricing</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Start Sales</label>
                <input type="date" className="w-64 p-2 border rounded-lg" />
              </div>

              <div>
                <label className="block mb-2 font-medium">End Sales</label>
                <input type="date" className="w-64 p-2 border rounded-lg" />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={noEndSales}
                    onChange={(e) => setNoEndSales(e.target.checked)}
                    className="w-4 h-4 accent-[#8757a3]"
                  />
                  <span>No End Sales</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={autoCloseAccess}
                    onChange={(e) => setAutoCloseAccess(e.target.checked)}
                    className="w-4 h-4 accent-[#8757a3]"
                  />
                  <span>Automatically Close Access</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={delayedOpening}
                    onChange={(e) => setDelayedOpening(e.target.checked)}
                    className="w-4 h-4 accent-[#8757a3]"
                  />
                  <span>Delayed Product Opening</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Expire Registrations</h3>
              <div className="flex gap-4 items-center">
                <input
                  type="number"
                  value={expirationDays}
                  onChange={(e) => setExpirationDays(e.target.value)}
                  className="w-20 p-2 border rounded-lg"
                  min="0"
                />
                <select className="p-2 border rounded-lg">
                  <option>Days from Registration</option>
                  <option>Weeks from Registration</option>
                  <option>Months from Registration</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={emailManagers}
                    onChange={(e) => setEmailManagers(e.target.checked)}
                    className="w-4 h-4 accent-[#8757a3]"
                  />
                  <span>Email Managers On Completions</span>
                </label>

                <label className="flex items-center gap-2">
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

            <div className="mt-8">
              <h3 className="font-medium mb-4">Individual Pricing</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left">User Type</th>
                      <th className="p-3 text-center">View</th>
                      <th className="p-3 text-center">Register</th>
                      <th className="p-3 text-center">Instant Register</th>
                      <th className="p-3 text-center">Price</th>
                      <th className="p-3 text-center">Early Bird Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userTypes.map((user, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="p-3">{user.type}</td>
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
                          <div className="flex items-center">
                            <span className="mr-1">$</span>
                            <input type="text" className="w-24 p-1 border rounded" />
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <span className="mr-1">$</span>
                            <input type="text" className="w-24 p-1 border rounded" />
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
  );
};

export default Pricing;