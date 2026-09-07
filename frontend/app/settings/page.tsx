import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-4">
        <SettingsIcon size={36} className="text-[#7c3aed]" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Settings</h1>
      <p className="text-slate-500 text-center max-w-sm text-sm">
        Settings and configuration options are coming soon. Stay tuned for updates!
      </p>
      <div className="mt-6 flex gap-4">
        <div className="px-5 py-4 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
          <p className="text-xs text-slate-500 mb-1 font-medium">Integrations</p>
          <p className="text-sm text-slate-800 font-semibold">Coming Soon</p>
        </div>
        <div className="px-5 py-4 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
          <p className="text-xs text-slate-500 mb-1 font-medium">Team</p>
          <p className="text-sm text-slate-800 font-semibold">Coming Soon</p>
        </div>
        <div className="px-5 py-4 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
          <p className="text-xs text-slate-500 mb-1 font-medium">Billing</p>
          <p className="text-sm text-slate-800 font-semibold">Coming Soon</p>
        </div>
      </div>
    </div>
  );
}
