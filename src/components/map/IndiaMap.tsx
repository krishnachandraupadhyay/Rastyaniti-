import React, { useState } from 'react';
import { MapPin, ChevronRight, Sparkles } from 'lucide-react';
import type { Constituency, PlayerProfile, PoliticalParty } from '../../types/game';
import { useI18n } from '../../locales/i18n';
import { sound } from '../../audio/soundEffects';

interface IndiaMapProps {
  constituencies: Constituency[];
  player: PlayerProfile;
  party: PoliticalParty | null;
  onSelectConstituency: (constituency: Constituency) => void;
  onStartCampaignAction: () => void;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  constituencies,
  player,
  party,
  onSelectConstituency,
  onStartCampaignAction,
}) => {
  const { language, t } = useI18n();
  const [zoomLevel, setZoomLevel] = useState<'NATION' | 'STATE' | 'CONSTITUENCY'>('STATE');
  const [selectedSeat, setSelectedSeat] = useState<Constituency>(constituencies[0]);

  const handleSeatClick = (c: Constituency) => {
    sound.playSelect();
    setSelectedSeat(c);
    onSelectConstituency(c);
  };

  const getSeatColor = (c: Constituency) => {
    if (!c.isUnlocked) return '#334155';
    if (c.playerSupport >= 45) return '#046A38'; // Emerald win zone
    if (c.playerSupport >= 30) return '#FF671F'; // Saffron battleground
    return '#E11D48'; // Opponent stronghold
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-navy-950 text-slate-100 relative">
      {/* Top Map Control Bar */}
      <div className="p-3 bg-navy-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-10">
        <div>
          <span className="text-[10px] font-black tracking-wider text-saffron uppercase block">
            {language === 'hi' ? 'रणनीतिक नक्शा • BHARAT' : 'STRATEGIC MAP • BHARAT'}
          </span>
          <h2 className="text-sm font-bold text-white">
            {zoomLevel === 'NATION' && (language === 'hi' ? 'अखिल भारतीय लोकसभा दृश्य' : 'All-India Lok Sabha Map')}
            {zoomLevel === 'STATE' && `${player.state} (राज्य स्तर)`}
            {zoomLevel === 'CONSTITUENCY' && `${selectedSeat.name} (निर्वाचन क्षेत्र)`}
          </h2>
        </div>

        {/* Zoom Level Toggle Buttons */}
        <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              sound.playClick();
              setZoomLevel('NATION');
            }}
            className={`px-2 py-1 text-[10px] font-black rounded-lg transition-all ${
              zoomLevel === 'NATION' ? 'bg-saffron text-navy-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            राष्ट्र
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setZoomLevel('STATE');
            }}
            className={`px-2 py-1 text-[10px] font-black rounded-lg transition-all ${
              zoomLevel === 'STATE' ? 'bg-saffron text-navy-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            राज्य
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setZoomLevel('CONSTITUENCY');
            }}
            className={`px-2 py-1 text-[10px] font-black rounded-lg transition-all ${
              zoomLevel === 'CONSTITUENCY' ? 'bg-saffron text-navy-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            क्षेत्र
          </button>
        </div>
      </div>

      {/* Interactive Map Visual Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-b from-[#061120] to-navy-950">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a5f_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

        {/* SVG Map Container with Smooth Dynamic Scale */}
        <div
          className="relative transition-transform duration-700 ease-out flex items-center justify-center"
          style={{
            transform:
              zoomLevel === 'NATION'
                ? 'scale(0.85)'
                : zoomLevel === 'STATE'
                ? 'scale(1.2) translateY(-10px)'
                : 'scale(1.7) translateY(-30px)',
          }}
        >
          <svg viewBox="0 0 450 520" className="w-[340px] h-[400px] drop-shadow-[0_0_30px_rgba(11,30,54,0.9)]">
            <defs>
              <linearGradient id="mapGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#0F172A" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0B132B" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* India Continental Outline Shape */}
            <path
              d="M 210 30 
                 C 220 15, 250 20, 260 35
                 C 270 50, 295 65, 285 85
                 C 300 95, 315 115, 310 135
                 C 320 150, 355 155, 360 175
                 C 375 185, 390 205, 355 215
                 C 330 220, 310 210, 300 225
                 C 290 240, 300 260, 290 280
                 C 280 300, 270 320, 260 340
                 C 250 370, 235 410, 225 450
                 C 220 470, 215 490, 210 510
                 C 205 490, 200 470, 195 450
                 C 185 410, 170 370, 160 340
                 C 150 320, 140 300, 130 280
                 C 120 260, 125 240, 120 225
                 C 110 210, 90 220, 70 215
                 C 50 205, 75 185, 90 175
                 C 95 155, 120 150, 130 135
                 C 125 115, 140 95, 155 85
                 C 145 65, 170 50, 180 35 Z"
              fill="url(#mapGradient)"
              stroke="#38BDF8"
              strokeWidth="2"
              strokeOpacity="0.4"
            />

            {/* Northern States Boundary Lines (Stylized) */}
            <path d="M 140 160 Q 210 180 300 170" stroke="#475569" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
            <path d="M 130 240 Q 210 260 280 250" stroke="#475569" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
            <path d="M 160 320 Q 210 340 260 330" stroke="#475569" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />

            {/* Clickable Constituency Point Nodes */}
            {constituencies.map((c, idx) => {
              // Geometric node anchors mapped across the peninsula
              const coords = [
                { x: 235, y: 190 }, // Kashipur (Varanasi zone)
                { x: 215, y: 205 }, // Kaushambi (Prayagraj zone)
                { x: 200, y: 185 }, // Awadh (Lucknow zone)
                { x: 275, y: 200 }, // Magadh (Patna zone)
                { x: 145, y: 290 }, // Konkan (Mumbai zone)
                { x: 190, y: 245 }, // Malwa (Indore zone)
              ][idx] || { x: 210, y: 230 };

              const isSelected = selectedSeat.id === c.id;
              const color = getSeatColor(c);

              return (
                <g
                  key={c.id}
                  className="cursor-pointer group"
                  onClick={() => handleSeatClick(c)}
                >
                  {/* Ping Ring for Selected or Home Seat */}
                  {(isSelected || c.isPlayerHome) && (
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isSelected ? 16 : 12}
                      fill="none"
                      stroke={color}
                      strokeWidth="2"
                      className="animate-ping opacity-75"
                    />
                  )}

                  {/* Core Node Circle */}
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={isSelected ? 9 : 7}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    className="transition-transform group-hover:scale-125"
                  />

                  {/* Text Label */}
                  <text
                    x={coords.x + 12}
                    y={coords.y + 4}
                    fill={isSelected ? '#FBBF24' : '#E2E8F0'}
                    fontSize={isSelected ? '10' : '8'}
                    fontWeight="bold"
                    className="pointer-events-none drop-shadow-md select-none"
                  >
                    {c.name.split(' ')[0]} ({c.playerSupport}%)
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-2 left-3 bg-navy-950/80 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-[9px] space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#046A38]"></span>
            <span>मजबूत पकड़ (&gt;45%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF671F]"></span>
            <span>कड़ा मुकाबला (30-45%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E11D48]"></span>
            <span>विपक्ष आगे (&lt;30%)</span>
          </div>
        </div>
      </div>

      {/* Bottom Selected Seat Detail Sheet */}
      <div className="p-3.5 bg-navy-900 border-t border-slate-800 shadow-2xl space-y-2 z-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-saffron" />
              <h3 className="text-sm font-black text-white">{selectedSeat.name}</h3>
              {selectedSeat.isPlayerHome && (
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[9px] font-black border border-amber-500/30">
                  गृह क्षेत्र (HOME)
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400">
              {selectedSeat.district} • {selectedSeat.state}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">पार्टी समर्थन</span>
            <span className="text-base font-black text-saffron">{selectedSeat.playerSupport}%</span>
          </div>
        </div>

        {/* Local Key Issue Banner */}
        <div className="p-2 rounded-xl bg-navy-950/80 border border-slate-800 text-xs flex items-center justify-between">
          <span className="text-slate-400 text-[10px]">प्रमुख चुनावी मुद्दा:</span>
          <span className="font-bold text-amber-300 text-right truncate max-w-[200px]">
            {language === 'hi' ? selectedSeat.keyIssue : selectedSeat.keyIssueEn}
          </span>
        </div>

        {/* Quick Launch Campaign in this seat */}
        <button
          onClick={() => {
            sound.playRally();
            onStartCampaignAction();
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-saffron to-amber-500 text-navy-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 transition-all"
        >
          <Sparkles size={14} />
          <span>इस क्षेत्र में अभियान चलाएं (Launch Campaign)</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
