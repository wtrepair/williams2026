// Adapted from the existing Williams Solutions.Pro website and the owner's
// supplied service notes, snow rates and annual maintenance program.
// Route availability and service arrangements are confirmed by the team.
export const contact = {
  phone: "705-544-0200",
  tel: "tel:+17055440200",
  email: "info@williamssolutions.pro",
  requestUrl:
    "https://clienthub.getjobber.com/client_hubs/c6ab68fa-74c2-4d46-9066-ff2210b88264/public/work_request/new?source=social_media",
};

export const snowRates = [
  { title: "Grader", price: "$219", unit: "per hour" },
  { title: "Small driveway", price: "$40", unit: "per clearing" },
  { title: "Double driveway", price: "$60", unit: "per clearing" },
  { title: "Sanding", price: "$60", unit: "per request · extra" },
  {
    title: "Monthly small-driveway plan",
    price: "About $1,000",
    unit: "per month",
  },
  { title: "Snow hauling", price: "$80", unit: "per triaxle load" },
];

export const annualMaintenance = {
  eyebrow: "Every April",
  title: "Annual water treatment maintenance",
  intro:
    "Each April, we give your water system a thorough check and take care of its yearly upkeep, with the supplies it needs for the year ahead.",
  steps: [
    {
      title: "Test your water",
      body: "We start with a water test to understand your water quality and how your treatment system is performing.",
    },
    {
      title: "Inspect your system",
      body: "We inspect the treatment equipment and pressure tank, and test the performance of your well pump.",
    },
    {
      title: "Refresh filters & UV",
      body: "We change your system’s filters, UV lamps and sleeves as part of its annual maintenance.",
    },
    {
      title: "Stock up for the year",
      body: "We deliver the treatment product and salt your system requires for the year ahead.",
    },
  ],
};

export const services = [
  {
    slug: "plumbing",
    title: "Plumbing & heating",
    shortTitle: "Plumbing",
    eyebrow: "Comfort starts here",
    summary:
      "Everyday repairs, thoughtful upgrades and reliable heating for your home or business.",
    intro:
      "From a stubborn leak to a complete installation, we look at the whole system. Our team brings practical plumbing and hydronic heating experience to homes, cottages, businesses and industrial properties across the region.",
    image: "/images/plumbing.webp",
    features: [
      {
        title: "Repairs & installations",
        body: "Sinks, faucets, toilets, custom showers, water lines and fixtures, installed and repaired with care.",
      },
      {
        title: "Pumps & protection",
        body: "Well pumps, sewage pumps, sump pumps, battery backups and alarms to keep water moving where it belongs.",
      },
      {
        title: "Hydronic heating",
        body: "Boilers, in-floor heating, hot water tanks, outdoor wood furnaces, fan coils and cast iron radiators.",
      },
      {
        title: "Commercial & industrial",
        body: "Plumbing for restaurants, salons, apartments and shops, including grease interceptors, process piping and compressed air lines.",
      },
    ],
    faqs: [
      {
        question: "Do you work on both homes and businesses?",
        answer:
          "Yes. We handle residential, commercial and industrial plumbing. Tell us about the property and the work you have in mind so we can plan the right approach.",
      },
      {
        question: "Can you help with a heating system?",
        answer:
          "We install, maintain and repair hydronic heating systems, including boilers, in-floor heating and related equipment.",
      },
      {
        question: "What should I do about a plumbing problem?",
        answer:
          "Call us and describe what is happening. For an active leak, shut off the water supply if you can do so safely, then contact the team for help.",
      },
    ],
  },
  {
    slug: "septic",
    title: "Septic solutions",
    shortTitle: "Septic",
    eyebrow: "Built for your land",
    summary:
      "Advanced and alternative septic systems for properties that need a little more ingenuity.",
    intro:
      "A steep slope, a small lot or challenging soil calls for a carefully considered system. We design, install and maintain septic solutions around the conditions on your property, bringing the planning, equipment and installation together.",
    image: "/images/septic.webp",
    features: [
      {
        title: "Challenging properties",
        body: "We assess steep slopes, waterfront sites, high water tables, tight setbacks and difficult soils to find a suitable approach.",
      },
      {
        title: "Advanced treatment",
        body: "Treatment units, timed dosing and pump chambers give us more ways to respond to a property’s needs.",
      },
      {
        title: "One coordinated team",
        body: "With excavation equipment and our own gravel pit, we can coordinate the groundwork and installation from start to finish.",
      },
      {
        title: "Long-term care",
        body: "Installation is the beginning. We also maintain systems and help owners understand how to look after them.",
      },
    ],
    faqs: [
      {
        question:
          "I have been told my lot is too difficult. Can you take a look?",
        answer:
          "Yes. We specialize in advanced and alternative septic systems and can assess the site. The options depend on the property, soil conditions and applicable requirements.",
      },
      {
        question: "Do you handle the excavation too?",
        answer:
          "Yes. Our septic and excavation capabilities let us coordinate the site work and system installation.",
      },
      {
        question: "Can you help with an existing system?",
        answer:
          "We maintain septic systems as well as install them. Tell us about slow drains, unusual odours, backups or other changes so we can discuss the next step.",
      },
    ],
  },
  {
    slug: "water-treatment",
    title: "Better water. Every day.",
    shortTitle: "Water treatment",
    eyebrow: "Start with what is in your water",
    summary:
      "Water testing, softening, filtration and UV systems, with annual maintenance every April.",
    intro:
      "Hardness, staining, odours and water quality concerns need different solutions. We start by understanding your water, your flow and how you use it, then build a treatment system that addresses the actual problem.",
    image: "/images/water.webp",
    features: [
      {
        title: "Test first. Choose well.",
        body: "We assess your water and household demand before recommending equipment for a well, lake supply or municipal connection.",
      },
      {
        title: "Soften & filter",
        body: "Target hardness, iron, sulfur, manganese and tannin colour with treatment selected for your water conditions.",
      },
      {
        title: "Drinking water options",
        body: "Reverse osmosis can provide a dedicated supply for drinking and cooking, with a kitchen faucet and optional fridge connection.",
      },
      {
        title: "Annual care, every April",
        body: "Our April maintenance program brings your system’s yearly checks, servicing and supply delivery together.",
      },
    ],
    faqs: [
      {
        question: "Which water treatment system do I need?",
        answer:
          "That depends on a water test, your source and your household demand. A softener, filter, reverse osmosis system and UV unit each do a different job; some homes need a combination.",
      },
      {
        question: "Can you help with well or lake water?",
        answer:
          "Yes. We work with rural water supplies and can assess the treatment needed for your water source.",
      },
      {
        question: "Does UV remove hardness or improve taste?",
        answer:
          "UV is used for disinfection. It does not soften water or remove dissolved chemicals, so other treatment may be needed alongside it.",
      },
      {
        question: "Do you offer annual water treatment maintenance?",
        answer:
          "Yes. Our annual program runs each April. Contact us to discuss your system and arrange its yearly care.",
      },
    ],
  },
  {
    slug: "wells",
    title: "Well work. Done properly.",
    shortTitle: "Wells & pumps",
    eyebrow: "Specialist work, below the surface",
    summary:
      "Certified well service, pump replacement and dug well upgrades—even when access is difficult.",
    intro:
      "Your well needs its own kind of expertise. Williams has the appropriate certifications and equipment to work on and test wells. From an ageing concrete dug well to a deeply installed pump, we bring specialist capability to your water supply.",
    image: "/images/water.webp",
    features: [
      {
        title: "Certified well expertise",
        body: "We are authorized and equipped for specialist well work and testing, with the certifications this work requires.",
      },
      {
        title: "Dug well construction & care",
        body: "We construct, maintain and repair dug wells, including work that many contractors do not take on.",
      },
      {
        title: "A cleaner finish above ground",
        body: "We can modernize an old concrete dug well to a neat 6-inch well casing. We assess the existing well and explain what the upgrade involves.",
      },
      {
        title: "Pump replacement without a drilling rig",
        body: "Our equipment lets us replace well pumps without bringing in a drilling rig, including deeply installed pumps.",
      },
      {
        title: "Difficult access is part of the job",
        body: "We can replace pumps in challenging locations. Tell us about the site and we will plan how to reach and service your well.",
      },
      {
        title: "Help with low-yielding wells",
        body: "We work on low-yielding wells and can assess your supply, pump and water-use needs to help determine the next step.",
      },
    ],
    faqs: [
      {
        question: "How is well work different from general plumbing?",
        answer:
          "Well construction, maintenance and testing call for specific qualifications and equipment. Williams has the appropriate certifications and equipment to carry out this specialist work.",
      },
      {
        question: "Do you need a drilling rig to replace my pump?",
        answer:
          "No. We can replace well pumps without a drilling rig, regardless of the pump’s depth. Share the well details and access conditions with us so we can prepare for the job.",
      },
      {
        question: "Can an old concrete dug well be modernized?",
        answer:
          "Yes. We can upgrade an old concrete dug well to a 6-inch well casing for a tidier appearance above ground. We will assess your well and discuss the work involved.",
      },
      {
        question: "Can you help if my well does not produce much water?",
        answer:
          "Yes. We work with low-yielding wells. We will look at your existing setup and how the property uses water before discussing suitable options.",
      },
    ],
  },
  {
    slug: "excavation-aggregate",
    title: "Groundwork for what comes next.",
    shortTitle: "Excavation & aggregate",
    eyebrow: "From first cut to final grade",
    summary:
      "Site preparation, excavation, drainage and aggregate for projects large and small.",
    intro:
      "A good project starts with the ground beneath it. From a new driveway to a home site, we bring the equipment and practical experience to prepare, shape and improve your property.",
    image: "/images/excavation.webp",
    features: [
      {
        title: "Prepare your site",
        body: "Land and tree clearing, new home site development, gravel pads, basement excavation and demolition.",
      },
      {
        title: "Move water where it belongs",
        body: "Ditching, drainage, culvert installation and foundation waterproofing to address water around your property.",
      },
      {
        title: "Build better access",
        body: "Driveway installation and grading, entrances and aggregate for a practical approach to your land.",
      },
      {
        title: "Shape the landscape",
        body: "Retaining walls, pond excavation and landscaping work planned around the way you want to use the property.",
      },
    ],
    faqs: [
      {
        question: "Do you take on smaller projects?",
        answer:
          "Yes. We work on projects of different sizes, from driveway improvements and grading to larger excavation and site development.",
      },
      {
        question: "Can you help with drainage?",
        answer:
          "We provide ditching, drainage solutions, culvert installation and foundation waterproofing. We will assess the site to understand the water problem.",
      },
      {
        question: "Can excavation be coordinated with a septic installation?",
        answer:
          "Yes. Our team provides both septic and excavation services, making it possible to plan the work together.",
      },
    ],
  },
  {
    slug: "logging",
    title: "More possibility in your land.",
    shortTitle: "Logging & land clearing",
    eyebrow: "A.R. Williams Logging",
    summary:
      "Selective harvesting, timber handling and land clearing with your plans in mind.",
    intro:
      "Your woodland can support more than one goal. Whether you want to harvest timber, improve access or prepare for a future build, A.R. Williams Logging works with you to decide what stays, what goes and what comes next.",
    image: "/images/logging.webp",
    features: [
      {
        title: "Selective harvesting",
        body: "You help choose the trees to cut. We plan the work around the surrounding woodland and the future use of your land.",
      },
      {
        title: "Timber & firewood",
        body: "We handle harvesting and transport, and can process and stockpile firewood on site for your own use.",
      },
      {
        title: "Land clearing & access",
        body: "Open up space for a home, cottage, road or improved access, with excavation and gravel sourcing available as part of the project.",
      },
      {
        title: "A coordinated process",
        body: "From permits and paperwork to harvesting and cleanup, we help keep the work organized.",
      },
    ],
    faqs: [
      {
        question: "Can I choose which trees are harvested?",
        answer:
          "Yes. Selective harvesting starts with your input and your plans for the property.",
      },
      {
        question: "Can I keep some of the wood?",
        answer:
          "Yes. We can discuss processing and stockpiling firewood on your property for personal use.",
      },
      {
        question: "Can you prepare access after clearing?",
        answer:
          "We also provide excavation and road-building work. Tell us what you want to do with the land so we can consider the complete project.",
      },
    ],
  },
  {
    slug: "snow-removal",
    title: "Ready for northern winters.",
    shortTitle: "Snow removal",
    eyebrow: "Keep the way clear",
    summary:
      "Driveway clearing, grader service and snow hauling to help you keep winter moving.",
    intro:
      "Winter changes how you use your property. Choose individual driveway clearings or ask about a monthly small-driveway plan, with sanding available separately on request. We also haul snow away by the triaxle load. Tell us about your property and we’ll discuss the right service and availability for your location.",
    image: null,
    features: [
      {
        title: "Driveway clearing",
        body: "Small and double-driveway clearing, with a monthly plan available for small driveways. Sanding is extra, on request.",
      },
      {
        title: "Grader service & snow hauling",
        body: "Hourly grader service for your winter access needs, plus snow hauling at $80 per triaxle load.",
      },
      {
        title: "Sanding on request",
        body: "Sanding is $60 per request, charged separately from your snow clearing or monthly plan.",
      },
    ],
    faqs: [
      {
        question: "Is snow removal available at my address?",
        answer:
          "Contact us with your address and a description of the property. We will confirm current availability and discuss your needs.",
      },
      {
        question: "Do you accept residential and commercial enquiries?",
        answer:
          "Yes. We welcome enquiries from homeowners and businesses. The team will confirm whether we can service your property.",
      },
      {
        question: "What does driveway clearing cost?",
        answer:
          "A small driveway is $40 per clearing and a double driveway is $60 per clearing. A monthly small-driveway plan is about $1,000 per month, with sanding extra at $60 per request. Snow hauling is $80 per triaxle load. Contact us to discuss your property and service needs.",
      },
      {
        question: "How do I request a quote?",
        answer:
          "Use the request form or call us. Include your location, the areas you want cleared and any access details that would help us assess the work.",
      },
    ],
  },
];

export const waterSystems = [
  {
    slug: "water-softener",
    title: "Water softeners",
    summary:
      "Less scale. Easier cleaning. Water-Right CS/RG softeners selected for your home’s hardness and water use.",
    features: [
      "Targets the calcium and magnesium behind hard-water scale.",
      "Metered regeneration responds to actual water use.",
      "Sized around your water test, flow and household demand.",
      "Installation, maintenance and salt-delivery enquiries.",
    ],
  },
  {
    slug: "aio-hybrid-filter",
    title: "AIO / hybrid filtration",
    summary:
      "Address iron staining, sulfur odours and manganese with a Ziron-K air-injection filtration system.",
    features: [
      "Air-injection oxidation paired with Katalox filter media.",
      "Automatic backwashing helps clean the filter media.",
      "Pump and well flow assessed before equipment is selected.",
      "Alternative options considered when backwash flow is limited.",
    ],
  },
  {
    slug: "reverse-osmosis",
    title: "Reverse osmosis",
    summary:
      "A dedicated supply of filtered water for drinking and cooking, with a tidy installation that fits your kitchen.",
    features: [
      "Water-Right reverse osmosis equipment.",
      "Dedicated drinking-water faucet with optional fridge connection.",
      "Basement or utility-area installation where practical.",
      "Filter servicing and optional point-of-use UV.",
    ],
  },
  {
    slug: "whole-home-uv",
    title: "Whole-home UV",
    summary:
      "VIQUA ultraviolet disinfection, sized for your household flow and paired with the right pretreatment.",
    features: [
      "Disinfects water using ultraviolet light without adding chemicals.",
      "Water clarity and pretreatment assessed before installation.",
      "System selection accounts for simultaneous water use.",
      "Lamp replacement, quartz-sleeve cleaning and ongoing support.",
    ],
  },
  {
    slug: "tannin-removal-filter",
    title: "Tannin removal",
    summary:
      "Practical options for the tea-coloured water associated with dissolved organics in some lake and well supplies.",
    features: [
      "Whole-home filtration using specialty anion resin.",
      "Kitchen-only reverse osmosis and UV options where appropriate.",
      "Treatment chosen after a water test and flow assessment.",
      "Can be combined with softening, AIO filtration and UV.",
    ],
  },
];

export const articles = [
  {
    slug: "understanding-septic-systems-a-beginners-guide",
    title: "Understanding septic systems: a beginner’s guide",
    date: "April 7, 2025",
    intro:
      "New to a home with a septic system? Understanding the basics makes it easier to care for the system and recognize when something needs attention.",
    sections: [
      {
        title: "The tank, the drain field and the soil",
        body: "A septic system treats wastewater on the property. In a conventional system, the tank lets solids settle and grease rise. Liquid then moves into a drain field, where the soil provides further treatment. Other systems may include additional treatment equipment or pumps.",
      },
      {
        title: "Changes worth investigating",
        body: "Slow drains, unusual odours, sewage backups or unexpectedly wet and lush patches around the drain field can signal a problem. Arrange an assessment instead of waiting for the symptoms to worsen.",
      },
      {
        title: "Everyday care matters",
        body: "Use water thoughtfully, keep grease and inappropriate materials out of drains, and arrange inspections and pumping on a schedule suited to your system and household. Keep a record of service visits and the system’s location.",
      },
      {
        title: "Know who to call",
        body: "If you are unsure how your system works or have noticed a change, speak with the Williams team. We can discuss your property, the existing system and the next step.",
      },
    ],
  },
  {
    slug: "the-benefits-of-uv-water-treatmenta-comprehensive-guide",
    title: "The benefits of UV water treatment",
    date: "April 7, 2025",
    intro:
      "Ultraviolet treatment can be an important part of a household water system. Here is what it does, what it does not do and why the installation matters.",
    sections: [
      {
        title: "How UV works",
        body: "Water passes through a chamber containing an ultraviolet light source. The UV light inactivates susceptible microorganisms as the water moves through the system.",
      },
      {
        title: "Disinfection without added chemicals",
        body: "UV does not add a disinfectant to the water. It is used for microbial treatment without adding a chemical taste or odour.",
      },
      {
        title: "One part of a complete approach",
        body: "UV does not remove sediment, hardness or dissolved chemicals. Water quality, clarity and flow affect system selection, and filtration or other pretreatment may be needed ahead of the UV chamber.",
      },
      {
        title: "Keep up with maintenance",
        body: "Lamps need replacement and quartz sleeves need cleaning according to the equipment’s service requirements. Ask the team to help identify the system and maintenance plan that suit your water supply.",
      },
    ],
  },
  {
    slug: "top-10-plumbing-tips-every-homeowner-should-know",
    title: "10 plumbing tips every homeowner should know",
    date: "February 6, 2021",
    intro:
      "Small habits can help you spot plumbing problems earlier and take better care of the systems you use every day.",
    sections: [
      {
        title: "1. Find the water shut-off",
        body: "Know where the main water shut-off is and how it operates. Make sure other members of the household know too.",
      },
      {
        title: "2. Be cautious with drain chemicals",
        body: "Avoid relying on harsh chemical drain cleaners. A recurring blockage deserves a proper assessment.",
      },
      {
        title: "3. Look for small leaks",
        body: "Check under sinks and around appliances. Dampness, drips and unexplained staining are worth investigating early.",
      },
      {
        title: "4. Understand your water",
        body: "If scale builds up on fixtures or appliances, ask about a water test and whether a softener would suit the home.",
      },
      {
        title: "5. Prepare for cold weather",
        body: "Identify pipes exposed to freezing conditions and ask about insulation and winter preparation before temperatures drop.",
      },
      {
        title: "6. Take slow drains seriously",
        body: "A slow drain can be an early sign of a blockage. If it persists or affects several fixtures, contact a plumber.",
      },
      {
        title: "7. Be careful what you flush",
        body: "Keep wipes, sanitary products and paper towels out of the toilet. They can contribute to blockages.",
      },
      {
        title: "8. Use drain strainers",
        body: "Strainers in sinks and showers help catch hair and food before they enter the plumbing.",
      },
      {
        title: "9. Have a plan for a leak",
        body: "If a pipe leaks or bursts, stop the water supply if it is safe to do so and contact a professional for help.",
      },
      {
        title: "10. Make maintenance a habit",
        body: "Regular professional checks can identify developing problems. Keep service records and ask what maintenance your particular equipment needs.",
      },
    ],
  },
];
