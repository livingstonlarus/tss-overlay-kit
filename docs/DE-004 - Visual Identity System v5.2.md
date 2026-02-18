# **DE-004 \- VISUAL IDENTITY SYSTEM v5.2**

**Source Material:** Daemon Engineering Identity, Windows Phone Metro, German Automotive UX, Braun & Teenage Engineering Design

**Context:** Corporate & Portfolio Branding Guidelines

**Version:** 5.2

## **1\. Design Philosophy: "The Clinical Instrument"**

**Core Dialect:** A fusion of **Unix Terminal** logic, **German Automotive Interiors**, and **Medical/Lab Equipment**.

**Definition:** The interface is a "Soft-Console". It prioritizes muscle memory, rapid scanning, and absolute contrast.

### **1.1 The Anti-Luxury Protocol (CRITICAL)**

* **Directive:** We are **NOT** a luxury brand. We are an infrastructure brand.  
* **Prohibition:** Do not use "elegant" serifs, generous whitespace for the sake of "breathing room", or subtle, low-contrast greys.  
* **Vibe:** Think "Power Plant Control Room" or "Flight Manifest", not "Art Gallery".  
* **Light Mode:** Must feel like a printed technical spec sheet. Clinical, harsh, truthful.  
* **Dark Mode:** Must feel like a backlit instrument panel.

### **1.2 Voice & Tone: "The Ventures Foundry"**

* **Identity:** Daemon Engineering is a **Ventures Studio** operating as a digital foundry. We build **Heavy Digital Industries**.  
* **Operational Model:** We function as a studio, systematically incubating and launching distinct sovereign assets. Unlike traditional startup studios that chase "Exits" or "Unicorns", we build for **Permanence** and **Industrial Yield**.  
* **Tone:** We speak with the weight of an industrial conglomerate, not the excitement of a startup.  
  * *Incorrect:* "We're iterating on a new MVP."  
  * *Correct:* "Asset deployment sequence initiated."  
* **Keywords:** Durability, Mass, Reliability, Structure, Load-Bearing, Yield.

## **2\. Typography Strategy**

* **Headers (Barlow Condensed):** Bold, All-Caps. Used for structure.  
* **Controls (Manrope/Roboto):** Medium weight. Used for interaction.  
* **Data (JetBrains Mono):** Used for values.

**The "Abbreviation" Axis:**

* Reject verbose labels. Use industry standard 3-4 letter codes (e.g., INIT, EXEC, LOGS).

## **3\. Form Language: The Soft-Key & The Slot**

* **The Slot (Container):** Every UI section is a horizontal strip defined by 1px solid borders.  
* **No Rounded Corners:** Strictly **0px radius**.  
* **The Pipe (|):** The central atomic unit for branding, separation, and status indication.

## **4\. Color Strategy: "System-Sync"**

The interface has no internal toggle. It adheres strictly to the physical device's environment (OS setting).

### **4.1 Day Mode (The Spec Sheet)**

* **Vibe:** Clinical, Document-based, Braun Calculator.  
* **Background:** **Pure White** (\#FFFFFF) or **Paper Grey** (\#F3F4F6).  
* **Borders:** **Technical Grey** (\#9CA3AF). High contrast lines. Not subtle.  
* **Text:** **Ink Black** (\#000000) or **Deep Charcoal** (\#111827).  
* **Signal:** Colors appear as "Ink Stamps" or "Plastic Buttons" against the white paper.

### **4.2 Night Mode (The Console)**

* **Vibe:** Night Driving, Server Room, Radar.  
* **Background:** **Matte Obsidian** (\#0A0A12).  
* **Borders:** **Carbon** (\#374151).  
* **Text:** **Phosphor White** (\#F3F4F6).  
* **Signal:** Colors appear as "LED Backlights".

### **4.3 Signal Colors (Constant)**

These colors must remain fully saturated in both modes to ensure they function as "Safety Signals".

* **Amber Orange (\#FF5F00):** **PaaS/AI**. (Alert / Heat / Processing).  
* **Phosphor Green (\#00D445):** **MaaS**. (Stable / Growth / Online).  
* **Instrument Blue (\#0057FF):** **CaaS**. (Truth / Compliance / Logic).

## **5\. UI Components Implementation**

* **Navigation:** Horizontal text row. Active state underlined by The Pipe (|).  
* **Toggles:** Text states ON | OFF. Active state lit in Signal Color.  
* **Notifications:** Warning Strip with codes ERR\_01.  
* **Loaders:** A blinking cursor \_ or a filling progress bar (The Pipe extending).

## **6\. Logomark Integration & Construction**

### **6.1 Primary Brand Lockup**

The official representation of the corporate entity combines the Logotype with the Tagline.

* **Logotype:**  
  * **Text:** DAEMON ENGINEERING  
  * **Font:** Barlow Condensed (Bold / 700\)  
  * **Case:** Uppercase  
  * **Tracking:** Tighter (-0.025em) to create a solid block of text.  
  * **Color:** content-main (Black/White).  
* **Tagline:**  
  * **Text:** HEAVY DIGITAL INDUSTRIES  
  * **Font:** JetBrains Mono (Medium / 500\)  
  * **Case:** Uppercase  
  * **Tracking:** Widest (0.3em). The tagline must feel like a technical specification label stamped underneath the main brand.  
  * **Color:** content-dim (Technical Grey). It must recede visually to support the main logotype without competing.  
  * **Alignment:** Justified to the width of "DAEMON" (Left-aligned) or full width of "DAEMON ENGINEERING" depending on canvas size.

### **6.2 Secondary Integrations**

* **The Badge:** DE Logo Top-Left.  
* **The Footer:** "Operationalized by Daemon Engineering \[ | \]".

## **7\. DRY Application (CSS Variables)**

This configuration ensures the "Clinical" look in Light mode and "Console" look in Dark mode without JS logic.

/\* app/app.css logic \*/  
@layer base {  
  :root {  
    /\* DAY MODE (Clinical / Spec Sheet) \*/  
    \--bg-dashboard: 255 255 255; /\* Pure White \*/  
    \--bg-slot: 249 250 251;      /\* Very Light Grey for alternating rows \*/  
    \--border-din: 156 163 175;   /\* Visible, Technical Grey (Tailwind gray-400) \*/  
    \--text-main: 0 0 0;          /\* Pure Black \*/  
    \--text-dim: 75 85 99;        /\* Dark Grey \*/  
  }

  @media (prefers-color-scheme: dark) {  
    :root {  
      /\* NIGHT MODE (Instrument Panel) \*/  
      \--bg-dashboard: 10 10 18;    /\* Obsidian \*/  
      \--bg-slot: 17 24 39;         /\* Carbon for alternating rows \*/  
      \--border-din: 55 65 81;      /\* Dark Grey (Tailwind gray-700) \*/  
      \--text-main: 243 244 246;    /\* Off-White \*/  
      \--text-dim: 156 163 175;     /\* Medium Grey \*/  
    }  
  }  
}

## **8\. Tailwind Configuration**

// tailwind.config.ts v5.2  
export default {  
  theme: {  
    extend: {  
      borderRadius: {  
        DEFAULT: '0px',  
      },  
      letterSpacing: {  
        'technical': '0.3em', // For Tagline  
        'block': '-0.025em',  // For Logotype  
      },  
      colors: {  
        // Semantic Colors mapped to CSS Vars  
        dashboard: {  
          base: 'rgb(var(--bg-dashboard) / \<alpha-value\>)',  
          slot: 'rgb(var(--bg-slot) / \<alpha-value\>)',  
        },  
        din: {  
          border: 'rgb(var(--border-din) / \<alpha-value\>)',  
        },  
        content: {  
          main: 'rgb(var(--text-main) / \<alpha-value\>)',  
          dim: 'rgb(var(--text-dim) / \<alpha-value\>)',  
        },  
        // Safety Signals (Constant)  
        signal: {  
          orange: '\#FF5F00',  
          green: '\#00D445',  
          blue: '\#0057FF',  
          crimson: '\#DC2626',  
        }  
      },  
      fontFamily: {  
        headline: \['Barlow Condensed', 'sans-serif'\],  
        label: \['Manrope', 'sans-serif'\],  
        mono: \['JetBrains Mono', 'monospace'\],  
      }  
    }  
  }  
}  
