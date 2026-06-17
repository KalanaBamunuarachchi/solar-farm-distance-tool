import { BatteryCharging } from "lucide-react"

export default function Header() {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] sm:px-5" >
      <div className="flex items-center gap-2">
        <BatteryCharging className="size-9 sm:size-12" />
        <p className="font-semibold text-sm leading-tight">BESS Site <br/> Assessment Tool</p>
      </div>
      
    </div>

  )
}
