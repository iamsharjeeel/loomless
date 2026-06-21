import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// In-Memory Database
let recordings = [
  {
    id: "rec-1",
    title: "Onboarding Flow Walkthrough v2",
    duration: "14:22",
    description: "Detailed review of the new user onboarding flow, highlighting the changes made to the sign-up form and the initial setup wizard.",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPTaq0NURwEW8WakZoSXlTzu2oI8GhPtAFxyRhaGreVzxV5MOOfR2_T7DuwPmimWIpiz1vlPRoMc2hU5NcNuoS2ZB8UFpAiLGenWd7FvMItkhN00pi4sUg5L2-yvfBX67Wwzwcp7GriaqUhckrDF5avvpmSxSNljsx6LrLXECFFBisSqf0R2hRqPEBme6J6Te5uxA6QlAwOqsAhpVoA4H-OkVRF1TP2h_H96K-j1tDrjjmMHsl3NE4B5bLxq4U_ehSOEfVQPFjAvUZ",
    isNew: true,
    isHd: true,
    author: "Sarah Jenkins",
    authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgg1SuFIWOC3MiPcxvp8o1J-KSI-Xd8R7MJuJIME8qTyn_If1NtVl55p0KW6JPIavLz4W1SBnDEET-HrsDsh9EEXArolVhZBLvFxP1TQFKo_vdi43aKqm2pJSdBpXDxf0o2GubNA0_1nF_R1LG2o78WBoOqvf5UG0J1SG_klTXlYQmAnL5QCcz62O5FDezZJbiJV-dKVlVjq81oPBsFZpEr16ABOXaIpgOTzpuo5rkpC0uM6LQgFa8EQxDTGji41ad1asXX99loT68",
    createdAt: "2 hours ago",
    category: "Personal",
    privacy: "public",
    transcript: [
      { time: "00:00", text: "Alright, let's dive into the new authentication flow. I've recorded this brief walkthrough to show you exactly where the changes were made.", speaker: "Speaker 1" },
      { time: "00:15", text: "First, you'll notice the login screen has been streamlined. We've removed the social login buttons temporarily while we resolve the OAuth bug.", speaker: "Speaker 1" },
      { time: "00:32", text: "If you try to submit with an empty password field, the validation error now appears inline rather than as a toast notification. This should improve the UX significantly.", speaker: "Speaker 1" }
    ]
  },
  {
    id: "rec-2",
    title: "Design System Walkthrough",
    duration: "04:20",
    description: "Deep dive walkthrough of the new brand system palette, font scales, component margins, and export structure.",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8QbWBoZTnvZVGQW-7v_OAun3kCMJMDLZDmZfrXDtJWEO98HTZvEm31Whkdp0p6QxxHaxu-PKvtSId7JLW6BlmyFuFfamiitCWc8D6iZmtwsZXxkdHhNsF8kDG2wxQUM8GblFd1cPKb_5sLEwgaezC35eF83flsYGvCV_Sqq9ec3D6pU5hRbtYnf5uVEWVG9dI6vyhIIucCeC9Q5eiVGKKZvK4yNJvd2zxJN6WuITZ5ziyz6fsqdSTpZGd9beNUGVxVNiW7YdBa0Cd",
    isNew: false,
    isHd: true,
    author: "Alex Chen",
    authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAW7jhfRRdHUwd2_C_R8oDNIOkY7kcKZHSOxiBpI8t8-LBJOHrIx7E8bZV9ayEDwuUoKSLajT0wPyWrNTA0pRUxGZeZMGvVL3jX4vrum0bMRCJBS_afAq_qbOUd6XQx1WbB0Qa-KAwMocHbbfCliHhFzZstzEv8NSG6lv1cBJIHPCZtjmsWr_PctlMrShOnNtH900UXoAOvhdRwRqCRjv2729bBhlTLrOMCTHCMtnt8ozHAo7r8Jlx8223eCnEzQHsxY9nZxXs9K0RK",
    createdAt: "Today, 10:42 AM",
    category: "Personal",
    privacy: "draft",
    transcript: [
      { time: "00:00", text: "Alright, let's dive into the new design system. As you can see on the screen, we are prioritizing a high-contrast dark mode.", speaker: "Speaker 1" },
      { time: "00:15", text: "The primary color is this electric lime green, which is used sparingly to draw attention to interactive elements and active states.", speaker: "Speaker 1" },
      { time: "01:20", text: "Notice how we handle elevation. Instead of traditional drop shadows which get lost on dark backgrounds, we rely on tonal shifts and subtle 1 pixel borders.", speaker: "Speaker 1" },
      { time: "01:38", text: "For the sidebar, we keep it docked and minimal. Icons are muted until hovered, reducing visual noise.", speaker: "Speaker 1" },
      { time: "03:45", text: "Finally, when you are ready to export, simply hit the share button. The system automatically compiles the necessary JSON and CSS tokens.", speaker: "Speaker 1" }
    ]
  },
  {
    id: "rec-3",
    title: "API Integration Demo",
    duration: "05:14",
    description: "Detailed demonstration of backend REST API routing setup and proxy request testing with secrets.",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG3DE-Mli7PS3uQ817YpL3UxrPPH3Apr4eqbMF4Nmor3iaakBhHp4DHFhClB2afvB18_wTxAJL-zqyM7Qa1bSItgyEtnNOXL6Zk90AejS1RnOjfIoSdEvW3UuICW7hh0L4GSbYGXOem4bINHIGg1LrHCCI9JUCOaVGhfbwEGRJRdRZXw712FRTa2aIgx2T_b3kBqai4dIvSq2UVtjR80QoCh538haKE4RAhTCxfMNBJDYCBDw3EtC9hvdGR99Hi22NxZ5P7YgO9kwT",
    isNew: false,
    isHd: false,
    author: "Alex Chen",
    createdAt: "Yesterday",
    category: "Personal",
    privacy: "locked",
    transcript: [
      { time: "00:00", text: "Starting API router diagnostics today. We are verifying the express middleware logs.", speaker: "Speaker 1" },
      { time: "02:10", text: "Make sure all CORS headers are correctly matched inside headers object.", speaker: "Speaker 1" },
      { time: "04:50", text: "Now proxying requests with hidden Bearer tokens. Tests check out completely.", speaker: "Speaker 1" }
    ]
  },
  {
    id: "rec-4",
    title: "Q3 Analytics Review",
    duration: "22:05",
    description: "Strategic analysis of visual user engagement data and layout retention rates across platforms.",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdSek-3UJE2EZKqSi9-JCFhdrOh3-caN-0CcWQXutGUPttAUtJS9TO5XA0ztUVDsAswgfwT_Z-VnWb3zUQ8MOjbGsoBPbDGzkp0XsgYP94lhz5UhZYt4DBmHSfp6wGAtNLgHFsY_4n3J4lT3D2ahS9nmB2FWHV3SjBI4t3IMGC7Jnu7iM1km6SjaEwnb-TqQ3Js1IjtNT7uHHAEw2mhWpbMYULO7wLXJZ5r8Uv6M-zAUceBE3Z4e9tXsQ5DOEXZ_pdJdofw_C9Ii6I",
    isNew: false,
    isHd: false,
    author: "Sarah Jenkins",
    createdAt: "Oct 12, 2023",
    category: "Team Shared",
    privacy: "public",
    transcript: [
      { time: "00:00", text: "We have compiled user retention for the third quarter.", speaker: "Speaker 1" },
      { time: "10:15", text: "Notice the spike exactly at 3 minutes where standard video chapters begin.", speaker: "Speaker 1" },
      { time: "20:45", text: "Overall positive flow results. We will distribute the full chart tomorrow.", speaker: "Speaker 1" }
    ]
  },
  {
    id: "rec-5",
    title: "Architecture Sync & API Deprecation Plan",
    duration: "12:04",
    description: "System diagram walkthrough of cloud migration modules and endpoint deprecation stages.",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFpkUyS3FKVTYJu13Rc0dbT1MsL4DZWTyhQu0g0D7CUOhSY9xVNjCIUgysLp09GqASPMkmejzMT_Lg4wfVZJTaqjPPIblZdxq8x_Ozae5IxCd1XaTaqRxdz392QvrOsaeEEHaIx6DhNMgDFUVzsdy4G85VIYvoFPxIyJAxFZyIcl_wNMYXRf_5GiYY8TnSmKCosoWQdsFdwCj4mwYKpQT7lFDGY9OrTTAgXeD9QxX-cq6BUY1O61z2TLtci9-hnVEG7n-ABkFVII0M",
    isNew: false,
    isHd: true,
    author: "John Doe",
    createdAt: "Just now",
    category: "Team Shared",
    privacy: "live",
    transcript: [
      { time: "00:00", text: "Reviewing original service mapping before setting up deprecated pathways.", speaker: "Speaker 1" },
      { time: "06:30", text: "Standardizing the response layout payloads to prevent client disruptions.", speaker: "Speaker 1" }
    ]
  },
  {
    id: "rec-6",
    title: "Q3 Marketing Site - Header Component Review",
    duration: "04:15",
    description: "Design critiques of front-end header interactive tabs, responsiveness, and state management values.",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8rOBHatJqi1-2If8-DvObEvX0tdo2JzJzJ_FcOj5odkwfspJgE0hvBXQkKz867dnqg3EOHf2hY4WDwlay7QWKFmvzyQACL4vE4DVfgGsGdEyILeY9hwlYCIsQtJKeYkLYvrurpczH_AAku2TWIhXRDXPrWNYeQWTFsVs0oqUCJllSfcNm82YvbgWAPwgSNfUblBwFpY1xd7O9mhtr0FQ9yVKHZGeo_tF_B6lunLqB1ZdinVSK8_lHGR_mYGIpyZapd554vSSCEkCx",
    isNew: false,
    isHd: false,
    author: "Alex Chen",
    createdAt: "2 hours ago",
    category: "Personal",
    privacy: "draft",
    transcript: [
      { time: "00:00", text: "Starting inspection of the standard desktop menu transitions.", speaker: "Speaker 1" },
      { time: "02:15", text: "The spacing on narrow screens needs fluid gutters of exact size 16px.", speaker: "Speaker 1" }
    ]
  }
];

let workspacePreferences = {
  defaultVideoQuality: "4K",
  autoGenerateSOPs: true,
  showCursorHighlighting: true,
  workspaceName: "Pro Workspace",
  billingPlan: "Pro Plan"
};

let userProfile = {
  displayName: "Alex Chen",
  email: "alex.chen@loomless.io",
  role: "Workspace Admin",
  activeWorkspace: "Loomless Pro Workspace",
  isProUser: true,
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAW7jhfRRdHUwd2_C_R8oDNIOkY7kcKZHSOxiBpI8t8-LBJOHrIx7E8bZV9ayEDwuUoKSLajT0wPyWrNTA0pRUxGZeZMGvVL3jX4vrum0bMRCJBS_afAq_qbOUd6XQx1WbB0Qa-KAwMocHbbfCliHhFzZstzEv8NSG6lv1cBJIHPCZtjmsWr_PctlMrShOnNtH900UXoAOvhdRwRqCRjv2729bBhlTLrOMCTHCMtnt8ozHAo7r8Jlx8223eCnEzQHsxY9nZxXs9K0RK"
};

let teamMembers = [
  { id: "mem-1", name: "Sarah Jenkins", role: "ADMIN", email: "sarah@loomless.io", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgg1SuFIWOC3MiPcxvp8o1J-KSI-Xd8R7MJuJIME8qTyn_If1NtVl55p0KW6JPIavLz4W1SBnDEET-HrsDsh9EEXArolVhZBLvFxP1TQFKo_vdi43aKqm2pJSdBpXDxf0o2GubNA0_1nF_R1LG2o78WBoOqvf5UG0J1SG_klTXlYQmAnL5QCcz62O5FDezZJbiJV-dKVlVjq81oPBsFZpEr16ABOXaIpgOTzpuo5rkpC0uM6LQgFa8EQxDTGji41ad1asXX99loT68" },
  { id: "mem-2", name: "Marcus Rowe", role: "EDITOR", email: "marcus@loomless.io", avatar: "" },
  { id: "mem-3", name: "David Kim", role: "VIEWER", email: "david@loomless.io", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfqK2YzyKErsUEuZwwtwE2CKS300MwujczkfqQW_1eO-_D8s_Ki0Nl0iCRjo1SxF4WMAkXN6Gb81iQbattZd3DGLUyBj3InXlzVCTL7zmY-ZyJR7FITnbAOxF3moUGexZo4Fpt6_50M7krxV89s_mqtPsUURTNcoMpmsgazX6z2VZx09gGzl4SgDnNIRNiBJ8ICV1zBIpNNQKuibWcqB5Fi7ZNGud57xavYcuz5LqVkpD74OBm_nB8--oTz-WMBBj6XaOmTqLrqVLW", status: "Pending" }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoints
  app.get("/api/recordings", (req, res) => {
    res.json(recordings);
  });

  app.post("/api/recordings", (req, res) => {
    const { title, duration, description, category, privacy, thumbnail, transcript } = req.body;
    const newRecord = {
      id: "rec-" + Date.now(),
      title: title || "New Capture " + new Date().toLocaleTimeString(),
      duration: duration || "00:45",
      description: description || "No description provided.",
      thumbnail: thumbnail || "https://lh3.googleusercontent.com/aida-public/AB6AXuCzFYFjfqCSKpGb8Wxy3iQsvDWrP3SboVwPhsmDND7UYW2oPsa3mERg5K1FwtmLkns--B8v1l1nVM8MeifFmlgVa4iiwMO8FnLnwiSdGkMkpCn0inAxQtgvbcDwyitiJL-PvhCLUdkV8dStJNGpz9BHPmLHIP83w3nrmPqyB8DI0bUYKTNjROoZNVJi7_kYbICOLI8RN0_IzHo-tlKWrLUGeiFr3itLv44n0Bb331WmRSxz9NBcxZsZop6sbnAzAZbRJ_QGjRyZ28Ot",
      isNew: true,
      isHd: true,
      author: userProfile.displayName,
      authorAvatar: userProfile.avatarUrl,
      createdAt: "Just now",
      category: category || "Personal",
      privacy: privacy || "public",
      transcript: transcript || [
        { time: "00:00", text: "Alright, starting my live demonstration.", speaker: "Speaker 1" },
        { time: "00:10", text: "Capturing my layout, system settings, and core elements clearly.", speaker: "Speaker 1" },
        { time: "00:30", text: "Everything appears to build correctly. Wrapping up process.", speaker: "Speaker 1" }
      ]
    };
    recordings.unshift(newRecord);
    res.status(201).json(newRecord);
  });

  app.delete("/api/recordings/:id", (req, res) => {
    const { id } = req.params;
    recordings = recordings.filter(r => r.id !== id);
    res.json({ success: true, message: `Recording ${id} deleted.` });
  });

  // Settings
  app.get("/api/settings", (req, res) => {
    res.json({ preferences: workspacePreferences, profile: userProfile });
  });

  app.put("/api/settings", (req, res) => {
    const { preferences, profile } = req.body;
    if (preferences) {
      workspacePreferences = { ...workspacePreferences, ...preferences };
    }
    if (profile) {
      userProfile = { ...userProfile, ...profile };
    }
    res.json({ success: true, preferences: workspacePreferences, profile: userProfile });
  });

  // Members
  app.get("/api/members", (req, res) => {
    res.json(teamMembers);
  });

  app.post("/api/members", (req, res) => {
    const { name, email, role } = req.body;
    const newMember = {
      id: "mem-" + Date.now(),
      name: name || email.split("@")[0],
      email: email,
      role: role || "VIEWER",
      avatar: "",
      status: "Pending"
    };
    teamMembers.push(newMember);
    res.status(201).json(newMember);
  });

  app.delete("/api/members/:id", (req, res) => {
    const { id } = req.params;
    teamMembers = teamMembers.filter(m => m.id !== id);
    res.json({ success: true, message: `Member ${id} removed.` });
  });

  // SOP Generation (Gemini AI Endpoint)
  app.post("/api/generate-sop", async (req, res) => {
    const { title, transcript } = req.body;
    const transcriptText = Array.isArray(transcript)
      ? transcript.map(t => `[${t.time}] ${t.speaker || "Speaker"}: ${t.text}`).join("\n")
      : String(transcript || "");

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const promptText = `
Given a recording session titled "${title || "Walkthrough"}" with the following transcription content, write a highly polished, professional, and detailed step-by-step Standard Operating Procedure (SOP) with structured chapters, exact task metrics, a summary, clear visual guides description, and actionable steps.
Format your entire output inside Markdown blocks with beautiful formatting and spacious typographic structure.

Transcription content:
${transcriptText}
`;
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: promptText
        });
        
        return res.json({
          success: true,
          sop: response.text,
          aiProcessed: true
        });
      } catch (err: any) {
        console.error("Gemini API Error:", err);
        // Fallback to local rendering in case of API error
      }
    }

    // High quality rich local fallback SOP generator
    let chapters = "";
    if (Array.isArray(transcript)) {
      chapters = transcript.map(t => {
        return `### 📍 Step at ${t.time}\n**Actionable Item**: ${t.text}\n**Role Responsibility**: Product walkthrough team / ${userProfile.displayName}\n`;
      }).join("\n");
    }

    const fallbackSOP = `
# Standard Operating Procedure (SOP)
## 📝 Title: ${title || "Walkthrough Capture"}
_Note: Running in high-performance local parser mode. Connect your GEMINI_API_KEY for custom deep-neural text summaries._

### 🗓️ Overview
An automated workspace document detailing the interactive processes, interface components, and architectural systems highlighted during this video document session.

---

### 🔍 Core Objectives & Target Metrics
1. **Precision Compliance**: Standardize system response values to prevent client payload deprecation.
2. **Technical Layout Density**: Maintain fluid spacing grids with exact margin measures (16px gutters).
3. **Optimized Integration**: Validate Express middleware authentication hooks securely.

---

### 📂 Actionable Walkthrough Steps
${chapters || "No walkthrough dialogue logged."}

---

### 🛡️ Post-process Review Checklist
- [ ] Confirm layout compliance across standard viewport range.
- [ ] Verify CORS authentication proxy keys are in hidden files.
- [ ] Broadcast walkthrough share URLs out to workspace managers.
`;

    res.json({
      success: true,
      sop: fallbackSOP,
      aiProcessed: false
    });
  });

  // Serve static assets or mount Vite server depending on environment
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Loomless backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
