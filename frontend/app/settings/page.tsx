import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center mb-4">
        <SettingsIcon size={36} className="text-[#6C5CE7]" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
      <p className="text-[#8b8ba3] text-center max-w-sm">
        Settings and configuration options are coming soon. Stay tuned for updates!
      </p>
      <div className="mt-6 flex gap-4">
        <div className="px-4 py-3 bg-[#16213e] rounded-lg border border-[#2a2a4a] text-center">
          <p className="text-xs text-[#8b8ba3] mb-1">Integrations</p>
          <p className="text-sm text-[#e0e0e0] font-medium">Coming Soon</p>
        </div>
        <div className="px-4 py-3 bg-[#16213e] rounded-lg border border-[#2a2a4a] text-center">
          <p className="text-xs text-[#8b8ba3] mb-1">Team</p>
          <p className="text-sm text-[#e0e0e0] font-medium">Coming Soon</p>
        </div>
        <div className="px-4 py-3 bg-[#16213e] rounded-lg border border-[#2a2a4a] text-center">
          <p className="text-xs text-[#8b8ba3] mb-1">Billing</p>
          <p className="text-sm text-[#e0e0e0] font-medium">Coming Soon</p>
        </div>
      </div>
    </div>
  );
}
