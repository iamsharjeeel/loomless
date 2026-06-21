import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Library from "./components/Library";
import Playback from "./components/Playback";
import CaptureSetup from "./components/CaptureSetup";
import Viewfinder from "./components/Viewfinder";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import ShareModal from "./components/ShareModal";
import { Recording, UserProfile, WorkspacePreferences } from "./types";

export default function App() {
  // Theme State - Default to false (Light Mode) as requested!
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Layout View States
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);

  // Recording capture process states
  const [showCaptureSetup, setShowCaptureSetup] = useState<boolean>(false);
  const [activeCaptureConfig, setActiveCaptureConfig] = useState<any | null>(null);

  // Popup Modals
  const [shareModalTarget, setShareModalTarget] = useState<Recording | null>(null);

  // Core full stack models
  const [preferences, setPreferences] = useState<WorkspacePreferences>({
    defaultVideoQuality: "4K",
    autoGenerateSOPs: true,
    showCursorHighlighting: true,
    workspaceName: "Pro Workspace",
    billingPlan: "Pro Plan"
  });

  const [profile, setProfile] = useState<UserProfile>({
    displayName: "Alex Chen",
    email: "alex.chen@loomless.io",
    role: "Workspace Admin",
    activeWorkspace: "Loomless Pro Workspace",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAW7jhfRRdHUwd2_C_R8oDNIOkY7kcKZHSOxiBpI8t8-LBJOHrIx7E8bZV9ayEDwuUoKSLajT0wPyWrNTA0pRUxGZeZMGvVL3jX4vrum0bMRCJBS_afAq_qbOUd6XQx1WbB0Qa-KAwMocHbbfCliHhFzZstzEv8NSG6lv1cBJIHPCZtjmsWr_PctlMrShOnNtH900UXoAOvhdRwRqCRjv2729bBhlTLrOMCTHCMtnt8ozHAo7r8Jlx8223eCnEzQHsxY9nZxXs9K0RK"
  });

  // REST API: Load recordings & settings from Express server
  const loadWorkspaceData = async () => {
    try {
      // 1. Recordings
      const recRes = await fetch("/api/recordings");
      if (recRes.ok) {
        const recData = await recRes.json();
        setRecordings(recData);
      }

      // 2. Settings & Profiles
      const setRes = await fetch("/api/settings");
      if (setRes.ok) {
        const setData = await setRes.json();
        setPreferences(setData.preferences);
        setProfile(setData.profile);
      }
    } catch (err) {
      console.error("Backend offline. Fallback to client-side emulation: ", err);
    }
  };

  useEffect(() => {
    loadWorkspaceData();
  }, []);

  // CRUD: Delete recording
  const handleDeleteVideo = async (id: string) => {
    try {
      const res = await fetch(`/api/recordings/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        // Reload list
        loadWorkspaceData();
        // Close playback if deleted
        if (selectedRecording?.id === id) {
          setSelectedRecording(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Capture setup: Start capturing and open viewfinder
  const handleStartCapture = (config: any) => {
    setShowCaptureSetup(false);
    setActiveCaptureConfig(config);
  };

  // Viewfinder stop: Complete recording walk, calculate specs and push to database
  const handleStopCapture = async (elapsedSeconds: number) => {
    if (!activeCaptureConfig) return;

    // Convert seconds to format e.g. "01:24"
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    const durationStr = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

    // Select randomized screen/camera backgrounds to simulate high-performance thumbnails
    const thumbnailsPool = [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCPTaq0NURwEW8WakZoSXlTzu2oI8GhPtAFxyRhaGreVzxV5MOOfR2_T7DuwPmimWIpiz1vlPRoMc2hU5NcNuoS2ZB8UFpAiLGenWd7FvMItkhN00pi4sUg5L2-yvfBX67Wwzwcp7GriaqUhckrDF5avvpmSxSNljsx6LrLXECFFBisSqf0R2hRqPEBme6J6Te5uxA6QlAwOqsAhpVoA4H-OkVRF1TP2h_H96K-j1tDrjjmMHsl3NE4B5bLxq4U_ehSOEfVQPFjAvUZ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD8QbWBoZTnvZVGQW-7v_OAun3kCMJMDLZDmZfrXDtJWEO98HTZvEm31Whkdp0p6QxxHaxu-PKvtSId7JLW6BlmyFuFfamiitCWc8D6iZmtwsZXxkdHhNsF8kDG2wxQUM8GblFd1cPKb_5sLEwgaezC35eF83flsYGvCV_Sqq9ec3D6pU5hRbtYnf5uVEWVG9dI6vyhIIucCeC9Q5eiVGKKZvK4yNJvd2zxJN6WuITZ5ziyz6fsqdSTpZGd9beNUGVxVNiW7YdBa0Cd"
    ];
    const chosenThumb = activeCaptureConfig.source === "camera" ? thumbnailsPool[0] : thumbnailsPool[1];

    try {
      const res = await fetch("/api/recordings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: activeCaptureConfig.title,
          duration: durationStr === "00:00" ? "00:25" : durationStr,
          description: `An automated recording document of your ${activeCaptureConfig.source} workspace feed. Video compiled in high resolution ${activeCaptureConfig.quality}.`,
          category: "Personal",
          privacy: "public",
          thumbnail: chosenThumb,
          transcript: [
            { time: "00:00", text: `Launching walkthrough walkthrough for "${activeCaptureConfig.title}". Testing microphone levels.`, speaker: profile.displayName },
            { time: "00:10", text: `Navigated layout columns inside workspace. Verified active elements and components borders.`, speaker: profile.displayName },
            { time: "00:22", text: `Exporting design tokens and compiling process steps. Completing document review.`, speaker: profile.displayName }
          ]
        })
      });

      if (res.ok) {
        const newRecord = await res.json();
        // Reset process viewfinder
        setActiveCaptureConfig(null);
        // Reload from backend
        await loadWorkspaceData();
        // Immediately view players walkthrough & SOP Generator!
        setSelectedRecording(newRecord);
      }
    } catch (err) {
      console.error(err);
      setActiveCaptureConfig(null);
    }
  };

  // Helper values triggered by Settings updates
  const handleUpdateSettings = (data: { preferences: any; profile: any }) => {
    setPreferences(data.preferences);
    setProfile(data.profile);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="bg-[#FAFBF7] dark:bg-[#0C0D08] text-[#1C1D17] dark:text-[#E3E4CE] min-h-screen relative flex flex-col md:flex-row transition-colors duration-200">
        
        {/* Viewfinder Overlay (Active recording screen takes over complete layout) */}
        {activeCaptureConfig ? (
          <Viewfinder 
            config={activeCaptureConfig} 
            onStopCapture={handleStopCapture} 
          />
        ) : (
          <>
            {/* Left navigation sidebar */}
            <Sidebar 
              activeView={activeView} 
              setActiveView={(view) => {
                setActiveView(view);
                setSelectedRecording(null); // return from playback on page change
              }} 
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              profile={profile}
              toggleConfigModal={() => setShowCaptureSetup(true)}
            />

            {/* Main scroll content panel on Right */}
            <div className="flex-1 md:pl-16 min-h-screen flex flex-col overflow-x-hidden">
              
              {selectedRecording ? (
                /* Player view takes immediate precedence */
                <Playback 
                  recording={selectedRecording} 
                  onBack={() => setSelectedRecording(null)}
                  onOpenShareModal={(rec) => setShareModalTarget(rec)}
                />
              ) : (
                /* Select tab view option */
                <>
                  {activeView === "dashboard" && (
                    <Dashboard 
                      recordings={recordings}
                      onSelectVideo={(rec) => setSelectedRecording(rec)}
                      onDeleteVideo={handleDeleteVideo}
                      onOpenShareModal={(rec) => setShareModalTarget(rec)}
                      toggleConfigModal={() => setShowCaptureSetup(true)}
                    />
                  )}

                  {activeView === "library" && (
                    <Library 
                      recordings={recordings}
                      onSelectVideo={(rec) => setSelectedRecording(rec)}
                      onDeleteVideo={handleDeleteVideo}
                      onOpenShareModal={(rec) => setShareModalTarget(rec)}
                    />
                  )}

                  {activeView === "settings" && (
                    <Settings 
                      preferences={preferences}
                      profile={profile}
                      onUpdateSettings={handleUpdateSettings}
                    />
                  )}

                  {activeView === "profile" && (
                    <Profile 
                      profile={profile}
                    />
                  )}
                </>
              )}

            </div>
          </>
        )}

        {/* Modal: Pre-capture setup dialog */}
        {showCaptureSetup && (
          <CaptureSetup 
            onStartCapture={handleStartCapture}
            onClose={() => setShowCaptureSetup(false)}
          />
        )}

        {/* Modal: Share links configuration */}
        {shareModalTarget && (
          <ShareModal 
            recording={shareModalTarget}
            onClose={() => setShareModalTarget(null)}
          />
        )}

      </div>
    </div>
  );
}
