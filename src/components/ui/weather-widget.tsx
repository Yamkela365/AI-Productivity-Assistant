import { Cloud, CloudRain, Sun, Droplets, Wind } from "lucide-react";
import { weather } from "@/lib/mock-data";

const icons = { sun: Sun, cloud: Cloud, rain: CloudRain };

export function WeatherWidget() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <div className="gradient-primary p-5 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">{weather.city}</p>
            <p className="mt-1 text-4xl font-bold">{weather.temp}°</p>
            <p className="text-sm opacity-90">{weather.condition}</p>
          </div>
          <Cloud className="h-14 w-14 opacity-80" />
        </div>
        <div className="mt-4 flex gap-5 text-xs">
          <span className="flex items-center gap-1.5">
            <Droplets className="h-4 w-4" /> {weather.humidity}% humidity
          </span>
          <span className="flex items-center gap-1.5">
            <Wind className="h-4 w-4" /> {weather.wind} km/h
          </span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 p-3">
        {weather.forecast.map((f) => {
          const Icon = icons[f.icon];
          return (
            <div key={f.day} className="flex flex-col items-center gap-1 rounded-lg py-2 text-center">
              <span className="text-[11px] font-medium text-muted-foreground">{f.day}</span>
              <Icon className="h-4 w-4 text-info" />
              <span className="text-xs font-semibold">{f.hi}°</span>
              <span className="text-[11px] text-muted-foreground">{f.lo}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
