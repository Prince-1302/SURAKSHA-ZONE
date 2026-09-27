# SIH 2026 Prototype: SURAKSHA_ZONE 
( Disaster Risk Assessment & Relocation Planner)

## Description
A comprehensive web-based platform designed to assess natural disaster risks (floods, landslides, cloudbursts) for various habitations and recommend safe relocation sites. This prototype provides data-driven insights into population vulnerability, infrastructure exposure, and disaster history to facilitate proactive disaster management and resettlement planning.

## Features
- **Habitation Risk Profiling:** Analyzes multi-hazard risks and computes a base mathematical risk score using hazard, exposure, vulnerability, and disaster history data.
- **Relocation Priority Engine:** Suggests relocation priority categories and scores using data-driven explanations and final risk components.
- **Spatial GIS Evidence:** Integrates spatial flood exposure analysis to adjust risk scores dynamically based on geographic zones.
- **Vulnerability Breakdown:** Detailed metrics for vulnerable populations including children, elderly, and persons with disabilities.
- **Safe Relocation Site Matching:** Recommends suitable relocation sites based on suitability scores, resource capacity, road access, and geographic factors.
- **Interactive Regional Risk Reports:** Generates automated, location-specific summaries and recommended actions for each settlement.

## Implementation Details
- **Frontend Framework:** React 19 with Vite for fast build, modern development experience, and Hot Module Replacement.
- **Routing:** React Router DOM for seamless client-side navigation across multiple views (Habitation Profiles, Capacity Analysis, Relocation Finder, etc.).
- **Mapping & Spatial Visualization:** Leaflet and React-Leaflet for interactive geographic data representation.
- **UI & Styling:** Built with a clean, responsive layout system using plain CSS and Lucide-React for minimalistic UI elements.
- **Data Architecture:** A centralized, modular data layer handling complex risk calculation algorithms, habitation profiles, and site matching logic.

## How to Run the Project

1. **Prerequisites:** Ensure Node.js and npm are installed on your machine.
2. **Installation:**
   Navigate to the project directory and install the required dependencies:
   ```bash
   npm install
   ```
3. **Start Development Server:**
   Run the following command to start the Vite development server:
   ```bash
   npm run dev
   ```
4. **Build for Production:**
   To create an optimized, production-ready build:
   ```bash
   npm run build
   ```
5. **Preview Production Build:**
   To preview the built assets locally:
   ```bash
   npm run preview
   ```

## Stakeholders
- **Disaster Management Authorities (NDMA/SDMA):** For strategic planning, resource allocation, and issuing early warnings based on risk metrics.
- **District Administration:** To coordinate local emergency response and execute planned relocations efficiently.
- **Urban & Rural Planning Departments:** For assessing infrastructure exposure and enforcing zoning regulations in high-risk areas.
- **At-Risk Local Communities:** The ultimate beneficiaries of improved early-warning dissemination and clear evacuation planning.

## Innovations
- **Multi-factor Risk Engine:** Goes beyond simple hazard mapping by integrating socio-demographic vulnerability and historical disaster patterns into a unified scoring system.
- **Dynamic Spatial Risk Adjustment:** Overlays standard baseline risk models with GIS data constraints to automatically adjust priority tiers based on spatial evidence.
- **Capacity-Aware Resettlement Planning:** Directly connects high-risk settlements with viable safe zones, factoring in life-sustaining capacities like water availability and road access.
- **Automated Regional Reporting:** Synthesizes complex mathematical risk models into clear, actionable, plain-text reports tailored for administrative decision-makers.
