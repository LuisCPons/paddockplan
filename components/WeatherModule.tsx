import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sun, CloudRain, Thermometer, Wind, Zap, AlertTriangle, Info, Radio } from 'lucide-react';

interface WeatherData {
  high: number;
  low: number;
  rainRisk: 'Low' | 'Medium' | 'High';
  precipProb: number;
}

const HISTORICAL_WEATHER: Record<string, WeatherData> = {
  monza: { high: 26, low: 14, rainRisk: 'Low', precipProb: 15 },
  silverstone: { high: 22, low: 12, rainRisk: 'High', precipProb: 45 },
  barcelona: { high: 29, low: 18, rainRisk: 'Low', precipProb: 10 },
};

interface WeatherModuleProps {
  gpKey: string;
  month: string;
  coordinates: { lat: number; lng: number };
}

export function WeatherModule({ gpKey, month, coordinates }: WeatherModuleProps) {
  const [liveWeather, setLiveWeather] = useState<{ temp: number; description: string } | null>(null);
  const weather = HISTORICAL_WEATHER[gpKey.toLowerCase()] || { high: 20, low: 10, rainRisk: 'Medium', precipProb: 20 };

  useEffect(() => {
    const fetchLiveWeather = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        if (!apiKey) return;

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lng}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        
        if (data.main && data.weather) {
          setLiveWeather({
            temp: Math.round(data.main.temp),
            description: data.weather[0].description
          });
        }
      } catch (error) {
        console.error("Failed to fetch live weather:", error);
      }
    };

    fetchLiveWeather();
    // Refresh every 10 minutes
    const interval = setInterval(fetchLiveWeather, 600000);
    return () => clearInterval(interval);
  }, [coordinates]);

  const getIntelligence = () => {
    const tips = [];
    if (weather.high > 28) {
      tips.push({
        type: 'heat',
        icon: Sun,
        text: 'Extreme Heat Alert: Add extra hydration salt and SPF 50 to your checklist.',
        color: 'text-orange-500'
      });
    }
    if (weather.rainRisk === 'High' || weather.precipProb > 30) {
      tips.push({
        type: 'rain',
        icon: CloudRain,
        text: 'Rain Probability: Ensure your poncho is accessible. Check our "Track Drainage" map section.',
        color: 'text-blue-500'
      });
    }
    if (weather.low < 12) {
      tips.push({
        type: 'cold',
        icon: Thermometer,
        text: 'Cool Evenings: A lightweight jacket is essential for the commute back to the city.',
        color: 'text-cyan-500'
      });
    }
    return tips;
  };

  const intelligenceTips = getIntelligence();

  return (
    <div className="p-8 border border-border bg-card/30 rounded-2xl space-y-8 relative overflow-hidden group hover:border-accent transition-colors print:border-black">
      {/* Atmospheric Atmosphere Overlay */}
      {(weather.rainRisk === 'High' || weather.rainRisk === 'Medium') && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
          <div className="raindrops" />
        </div>
      )}

      <div className="flex items-center justify-between relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Wind className="w-3 h-3 text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Climatic Intelligence</span>
            </div>
            {liveWeather && (
              <div className="flex items-center gap-2 px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-full animate-pulse print:hidden">
                <Radio className="w-2.5 h-2.5 text-accent" />
                <span className="text-[8px] font-extrabold uppercase tracking-[0.1em] text-accent">
                  Live: {liveWeather.temp}°C {liveWeather.description}
                </span>
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">Weather Strategy</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Historical Average for {month}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Temp Range</span>
            <p className="text-3xl font-extrabold tracking-tighter tabular-nums text-foreground">
              {weather.high}°<span className="text-xl text-muted-foreground/40 mx-1">/</span>{weather.low}°C
            </p>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Rain Risk</span>
            <p className={`text-xl font-bold tracking-tight ${weather.rainRisk === 'High' ? 'text-accent' : 'text-foreground'}`}>
              {weather.rainRisk}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {intelligenceTips.length > 0 ? (
          intelligenceTips.map((tip, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-4 bg-background/60 border border-border/80 rounded-xl group-hover:bg-background/80 transition-colors"
            >
              <div className={`p-2 rounded-lg bg-accent/5 ${tip.color}`}>
                <tip.icon className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold leading-relaxed text-foreground">
                {tip.text}
              </p>
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 flex items-center gap-4 p-4 bg-background/40 border border-border/50 rounded-xl italic text-foreground/40 text-xs">
            <Info className="w-4 h-4" />
            Standard seasonal conditions expected. No specialized gear required beyond the standard checklist.
          </div>
        )}
      </div>

      {/* Background Icon Decoration */}
      <Sun className="absolute top-[-20px] right-[-20px] w-32 h-32 text-accent/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none" />

      <style jsx>{`
        .raindrops {
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 10% 10%, #fff 1px, transparent 1px),
            radial-gradient(circle at 20% 40%, #fff 1.5px, transparent 1.5px),
            radial-gradient(circle at 30% 20%, #fff 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, #fff 1.5px, transparent 1.5px),
            radial-gradient(circle at 70% 30%, #fff 1px, transparent 1px),
            radial-gradient(circle at 80% 80%, #fff 2px, transparent 2px),
            radial-gradient(circle at 90% 10%, #fff 1px, transparent 1px);
          background-size: 200px 200px;
          animation: rain 1s linear infinite;
        }

        @keyframes rain {
          from { background-position: 0 0; }
          to { background-position: 0 200px; }
        }
      `}</style>
    </div>
  );
}
