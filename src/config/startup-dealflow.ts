import type { StartupDealflowItem, StartupDealflowStage, StartupDealflowStatus } from '@/types';

interface CityGeo {
  city: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

const CITIES: Record<string, CityGeo> = {
  // Italy
  milan_it: { city: 'Milan', region: 'Lombardia', country: 'Italy', lat: 45.4642, lon: 9.19 },
  turin_it: { city: 'Turin', region: 'Piemonte', country: 'Italy', lat: 45.0703, lon: 7.6869 },
  rome_it: { city: 'Rome', region: 'Lazio', country: 'Italy', lat: 41.9028, lon: 12.4964 },
  bologna_it: { city: 'Bologna', region: 'Emilia-Romagna', country: 'Italy', lat: 44.4949, lon: 11.3426 },
  florence_it: { city: 'Florence', region: 'Toscana', country: 'Italy', lat: 43.7696, lon: 11.2558 },
  naples_it: { city: 'Naples', region: 'Campania', country: 'Italy', lat: 40.8518, lon: 14.2681 },
  padua_it: { city: 'Padua', region: 'Veneto', country: 'Italy', lat: 45.4064, lon: 11.8768 },
  trento_it: { city: 'Trento', region: 'Trentino-Alto Adige', country: 'Italy', lat: 46.0748, lon: 11.1217 },
  pisa_it: { city: 'Pisa', region: 'Toscana', country: 'Italy', lat: 43.7228, lon: 10.4017 },
  genoa_it: { city: 'Genoa', region: 'Liguria', country: 'Italy', lat: 44.4056, lon: 8.9463 },
  bari_it: { city: 'Bari', region: 'Puglia', country: 'Italy', lat: 41.1171, lon: 16.8719 },
  catania_it: { city: 'Catania', region: 'Sicilia', country: 'Italy', lat: 37.5079, lon: 15.083 },
  parma_it: { city: 'Parma', region: 'Emilia-Romagna', country: 'Italy', lat: 44.8015, lon: 10.3279 },
  modena_it: { city: 'Modena', region: 'Emilia-Romagna', country: 'Italy', lat: 44.6471, lon: 10.9252 },
  verona_it: { city: 'Verona', region: 'Veneto', country: 'Italy', lat: 45.4384, lon: 10.9916 },
  trieste_it: { city: 'Trieste', region: 'Friuli Venezia Giulia', country: 'Italy', lat: 45.6495, lon: 13.7768 },
  palermo_it: { city: 'Palermo', region: 'Sicilia', country: 'Italy', lat: 38.1157, lon: 13.3615 },
  udine_it: { city: 'Udine', region: 'Friuli Venezia Giulia', country: 'Italy', lat: 46.0711, lon: 13.2346 },
  brescia_it: { city: 'Brescia', region: 'Lombardia', country: 'Italy', lat: 45.5416, lon: 10.2118 },
  bergamo_it: { city: 'Bergamo', region: 'Lombardia', country: 'Italy', lat: 45.6983, lon: 9.6773 },
  perugia_it: { city: 'Perugia', region: 'Umbria', country: 'Italy', lat: 43.1107, lon: 12.3908 },
  ancona_it: { city: 'Ancona', region: 'Marche', country: 'Italy', lat: 43.6158, lon: 13.5189 },
  lecce_it: { city: 'Lecce', region: 'Puglia', country: 'Italy', lat: 40.3515, lon: 18.175 },
  como_it: { city: 'Como', region: 'Lombardia', country: 'Italy', lat: 45.8081, lon: 9.0852 },
  reggio_it: { city: 'Reggio Emilia', region: 'Emilia-Romagna', country: 'Italy', lat: 44.6983, lon: 10.6313 },
  cagliari_it: { city: 'Cagliari', region: 'Sardegna', country: 'Italy', lat: 39.2238, lon: 9.1217 },
  messina_it: { city: 'Messina', region: 'Sicilia', country: 'Italy', lat: 38.1938, lon: 15.554 },
  ravenna_it: { city: 'Ravenna', region: 'Emilia-Romagna', country: 'Italy', lat: 44.4184, lon: 12.2035 },
  salerno_it: { city: 'Salerno', region: 'Campania', country: 'Italy', lat: 40.6824, lon: 14.7681 },
  pescara_it: { city: 'Pescara', region: 'Abruzzo', country: 'Italy', lat: 42.4618, lon: 14.2161 },
  laquila_it: { city: "L'Aquila", region: 'Abruzzo', country: 'Italy', lat: 42.3498, lon: 13.3995 },
  brindisi_it: { city: 'Brindisi', region: 'Puglia', country: 'Italy', lat: 40.6327, lon: 17.9418 },
  sassari_it: { city: 'Sassari', region: 'Sardegna', country: 'Italy', lat: 40.7267, lon: 8.5599 },
  frascati_it: { city: 'Frascati', region: 'Lazio', country: 'Italy', lat: 41.8091, lon: 12.6795 },
  // Europe
  paris_fr: { city: 'Paris', region: 'Ile-de-France', country: 'France', lat: 48.8566, lon: 2.3522 },
  berlin_de: { city: 'Berlin', region: 'Berlin', country: 'Germany', lat: 52.52, lon: 13.405 },
  barcelona_es: { city: 'Barcelona', region: 'Catalonia', country: 'Spain', lat: 41.3851, lon: 2.1734 },
  amsterdam_nl: { city: 'Amsterdam', region: 'North Holland', country: 'Netherlands', lat: 52.3676, lon: 4.9041 },
  stockholm_se: { city: 'Stockholm', region: 'Stockholm County', country: 'Sweden', lat: 59.3293, lon: 18.0686 },
  helsinki_fi: { city: 'Helsinki', region: 'Uusimaa', country: 'Finland', lat: 60.1699, lon: 24.9384 },
  madrid_es: { city: 'Madrid', region: 'Community of Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038 },
  munich_de: { city: 'Munich', region: 'Bavaria', country: 'Germany', lat: 48.1351, lon: 11.582 },
  copenhagen_dk: { city: 'Copenhagen', region: 'Capital Region', country: 'Denmark', lat: 55.6761, lon: 12.5683 },
  lisbon_pt: { city: 'Lisbon', region: 'Lisbon', country: 'Portugal', lat: 38.7223, lon: -9.1393 },
  zurich_ch: { city: 'Zurich', region: 'Zurich', country: 'Switzerland', lat: 47.3769, lon: 8.5417 },
  vienna_at: { city: 'Vienna', region: 'Vienna', country: 'Austria', lat: 48.2082, lon: 16.3738 },
  dublin_ie: { city: 'Dublin', region: 'Leinster', country: 'Ireland', lat: 53.3498, lon: -6.2603 },
  brussels_be: { city: 'Brussels', region: 'Brussels-Capital', country: 'Belgium', lat: 50.8503, lon: 4.3517 },
  lyon_fr: { city: 'Lyon', region: 'Auvergne-Rhone-Alpes', country: 'France', lat: 45.764, lon: 4.8357 },
  hamburg_de: { city: 'Hamburg', region: 'Hamburg', country: 'Germany', lat: 53.5511, lon: 9.9937 },
  valencia_es: { city: 'Valencia', region: 'Valencian Community', country: 'Spain', lat: 39.4699, lon: -0.3763 },
  goteborg_se: { city: 'Gothenburg', region: 'Vastra Gotaland', country: 'Sweden', lat: 57.7089, lon: 11.9746 },
  lugano_ch: { city: 'Lugano', region: 'Ticino', country: 'Switzerland', lat: 46.0037, lon: 8.9511 },
};

interface SeedInput {
  id: string;
  name: string;
  cityKey: keyof typeof CITIES;
  status: StartupDealflowStatus;
  stage: StartupDealflowStage;
  sectors: string[];
  website?: string;
  aliases?: string[];
  newsExclusions?: string[];
  newsQuery?: string;
}

function makeItem(input: SeedInput): StartupDealflowItem {
  const city = CITIES[input.cityKey];
  if (!city) {
    throw new Error(`Unknown startup city key: ${String(input.cityKey)}`);
  }
  const baseQuery = `("${input.name}" OR "${(input.aliases?.[0] || input.name)}") (startup OR funding OR round OR product OR partnership)`;
  return {
    id: input.id,
    name: input.name,
    city: city.city,
    region: city.region,
    country: city.country,
    lat: city.lat,
    lon: city.lon,
    status: input.status,
    stage: input.stage,
    sectors: input.sectors,
    website: input.website,
    aliases: input.aliases,
    newsExclusions: input.newsExclusions,
    newsQuery: input.newsQuery || `${baseQuery} (${city.country} OR ${city.city})`,
    lastUpdated: '2026-02-28',
  };
}

const ITALY_PORTFOLIO: SeedInput[] = [
  { id: 'it-pf-exolab', name: 'Exolab Italia', cityKey: 'pescara_it', status: 'portfolio', stage: 'series-a', sectors: ['Materiali Avanzati', 'Advanced materials - Pharma'], website: 'https://exolabitalia.net/' },
  { id: 'it-pf-vbite', name: 'VBite', cityKey: 'laquila_it', status: 'portfolio', stage: 'pre-seed', sectors: ['Manifattura Avanzata', 'Advanced manufacturing'], website: 'https://vbite.it/' },
  { id: 'it-pf-green-independence', name: 'Green Independence', cityKey: 'brindisi_it', status: 'portfolio', stage: 'series-a', sectors: ['Manifattura Avanzata', 'Climate'], website: 'https://greenindependence.eu/' },
  { id: 'it-pf-libera-biotech', name: 'Libera Biotech', cityKey: 'laquila_it', status: 'portfolio', stage: 'seed', sectors: ['Materiali Avanzati', 'BioTech'], website: 'https://liberabiotech.com/' },
  { id: 'it-pf-brief', name: 'Brief', cityKey: 'rome_it', status: 'portfolio', stage: 'pre-seed', sectors: ['Intelligenza Artificiale', 'Artificial Intelligence'], website: 'https://voicebrief.app/', aliases: ['VoiceBrief'], newsExclusions: ['briefing'] },
  { id: 'it-pf-relicta', name: 'Relicta', cityKey: 'sassari_it', status: 'portfolio', stage: 'seed', sectors: ['Materiali Avanzati', 'Bio-plastics'], website: 'https://relictabioplastics.com/' },
  { id: 'it-pf-genomeup', name: 'GenomeUp', cityKey: 'rome_it', status: 'portfolio', stage: 'series-a', sectors: ['Intelligenza Artificiale', 'Genomics'], website: 'https://genomeup.com/' },
  { id: 'it-pf-quantabrain', name: 'QuantaBrain', cityKey: 'pisa_it', status: 'portfolio', stage: 'seed', sectors: ['Intelligenza Artificiale', 'NeuroTech'], website: 'https://quantabrain.org/it/' },
  { id: 'it-pf-spin', name: 'SPiN', cityKey: 'frascati_it', status: 'portfolio', stage: 'series-a', sectors: ['Manifattura Avanzata', 'SpaceTech'], website: 'https://spinintech.com/', aliases: ['SPiN InTech'], newsQuery: '("SPiN InTech" OR "SPiN startup") (space OR satellite OR startup) (Italy OR Frascati)' },
  { id: 'it-pf-ohm-space', name: 'Ohm Space', cityKey: 'rome_it', status: 'portfolio', stage: 'seed', sectors: ['Manifattura Avanzata', 'SpaceTech'], website: 'https://ohm.space/' },
  { id: 'it-pf-sense4med', name: 'Sense4Med', cityKey: 'rome_it', status: 'portfolio', stage: 'seed', sectors: ['Materiali Avanzati', 'MedTech'], website: 'https://sense4med.com/' },
  { id: 'it-pf-fluidwire', name: 'Fluid Wire Robotics', cityKey: 'pisa_it', status: 'portfolio', stage: 'seed', sectors: ['Manifattura Avanzata', 'Robotics'], website: 'https://fluidwirerobotics.com/' },
  { id: 'it-pf-recornea', name: 'Recornea', cityKey: 'udine_it', status: 'portfolio', stage: 'series-a', sectors: ['Materiali Avanzati', 'MedTech'], website: 'https://www.recornea.com/' },
  { id: 'it-pf-cylock', name: 'CyLock', cityKey: 'rome_it', status: 'portfolio', stage: 'seed', sectors: ['Intelligenza Artificiale', 'Cybersecurity'], website: 'https://cylock.tech/' },
  { id: 'it-pf-aviogel', name: 'Aviogel', cityKey: 'laquila_it', status: 'portfolio', stage: 'pre-seed', sectors: ['Materiali Avanzati', 'ClimateTech'], website: 'https://aviogel.com/coming-soon/' },
  { id: 'it-pf-blemishhh', name: 'Blemishhh', cityKey: 'laquila_it', status: 'portfolio', stage: 'pre-seed', sectors: ['Materiali Avanzati', 'Dermatech'], aliases: ['Blemish'] },
  { id: 'it-pf-plantbit', name: 'PlantBit', cityKey: 'parma_it', status: 'portfolio', stage: 'pre-seed', sectors: ['Materiali Avanzati', 'AgriTech'], website: 'https://plantbit.it/' },
  { id: 'it-pf-loto-biotech', name: 'Loto Biotech Platform', cityKey: 'laquila_it', status: 'portfolio', stage: 'pre-seed', sectors: ['Intelligenza Artificiale', 'Biotech'], website: 'https://www.lotobiotech.com/' },
];

const ITALY_DEALFLOW: SeedInput[] = [
  { id: 'it-df-nexarobotics', name: 'Nexa Robotics', cityKey: 'milan_it', status: 'dealflow', stage: 'pre-seed', sectors: ['Robotics', 'AI'] },
  { id: 'it-df-terrasentry', name: 'TerraSentry', cityKey: 'turin_it', status: 'dealflow', stage: 'seed', sectors: ['Climate', 'Data'] },
  { id: 'it-df-fleetlens', name: 'FleetLens', cityKey: 'genoa_it', status: 'dealflow', stage: 'seed', sectors: ['Logistics', 'Computer Vision'] },
  { id: 'it-df-aquafarm', name: 'AquaFarm OS', cityKey: 'bari_it', status: 'dealflow', stage: 'pre-seed', sectors: ['AgriTech', 'IoT'] },
  { id: 'it-df-legalops', name: 'LegalOps AI', cityKey: 'rome_it', status: 'dealflow', stage: 'seed', sectors: ['LegalTech', 'AI'] },
  { id: 'it-df-cartovo', name: 'Cartovo', cityKey: 'bologna_it', status: 'dealflow', stage: 'pre-seed', sectors: ['RetailTech', 'Payments'] },
  { id: 'it-df-vertexbioworks', name: 'Vertex Bioworks', cityKey: 'naples_it', status: 'dealflow', stage: 'pre-seed', sectors: ['BioTech'] },
  { id: 'it-df-heliostorage', name: 'HelioStorage', cityKey: 'trento_it', status: 'dealflow', stage: 'seed', sectors: ['Energy Storage', 'Climate'] },
  { id: 'it-df-neuralforge', name: 'NeuralForge', cityKey: 'padua_it', status: 'dealflow', stage: 'seed', sectors: ['AI Infrastructure'] },
  { id: 'it-df-travelmesh', name: 'TravelMesh', cityKey: 'florence_it', status: 'dealflow', stage: 'pre-seed', sectors: ['TravelTech', 'SaaS'] },
  { id: 'it-df-cyberhive', name: 'CyberHive', cityKey: 'rome_it', status: 'dealflow', stage: 'seed', sectors: ['Cybersecurity'] },
  { id: 'it-df-optiport', name: 'OptiPort', cityKey: 'genoa_it', status: 'dealflow', stage: 'seed', sectors: ['Maritime', 'Optimization'] },
  { id: 'it-df-synapserx', name: 'SynapseRx', cityKey: 'milan_it', status: 'dealflow', stage: 'series-a', sectors: ['Healthtech', 'AI'] },
  { id: 'it-df-carbonloop', name: 'CarbonLoop', cityKey: 'bologna_it', status: 'dealflow', stage: 'seed', sectors: ['Climate', 'Carbon'] },
  { id: 'it-df-foodchainos', name: 'FoodChain OS', cityKey: 'parma_it', status: 'dealflow', stage: 'pre-seed', sectors: ['FoodTech', 'Supply Chain'] },
  { id: 'it-df-urbantwin', name: 'UrbanTwin', cityKey: 'modena_it', status: 'dealflow', stage: 'seed', sectors: ['Digital Twin', 'PropTech'] },
  { id: 'it-df-buildpilot', name: 'BuildPilot', cityKey: 'verona_it', status: 'dealflow', stage: 'seed', sectors: ['ConTech', 'AI'] },
  { id: 'it-df-omniinvoice', name: 'OmniInvoice', cityKey: 'turin_it', status: 'dealflow', stage: 'pre-seed', sectors: ['Fintech', 'SMB SaaS'] },
  { id: 'it-df-assistlyhealth', name: 'Assistly Health', cityKey: 'rome_it', status: 'dealflow', stage: 'seed', sectors: ['Healthtech', 'Assistant AI'] },
  { id: 'it-df-edgefactory', name: 'EdgeFactory', cityKey: 'trieste_it', status: 'dealflow', stage: 'seed', sectors: ['Industry 4.0', 'Edge AI'] },
  { id: 'it-df-vivaphotonics', name: 'VivaPhotonics', cityKey: 'palermo_it', status: 'dealflow', stage: 'pre-seed', sectors: ['Photonics', 'DeepTech'] },
  { id: 'it-df-aeroledger', name: 'AeroLedger', cityKey: 'udine_it', status: 'dealflow', stage: 'seed', sectors: ['Aerospace', 'Blockchain'] },
  { id: 'it-df-vitalnode', name: 'VitalNode', cityKey: 'brescia_it', status: 'dealflow', stage: 'pre-seed', sectors: ['MedTech', 'IoT'] },
  { id: 'it-df-soilmetrics', name: 'SoilMetrics', cityKey: 'bergamo_it', status: 'dealflow', stage: 'pre-seed', sectors: ['AgriTech', 'Data'] },
  { id: 'it-df-meteoguard', name: 'MeteoGuard', cityKey: 'perugia_it', status: 'dealflow', stage: 'seed', sectors: ['Climate Risk', 'AI'] },
  { id: 'it-df-railsense', name: 'RailSense', cityKey: 'ancona_it', status: 'dealflow', stage: 'seed', sectors: ['Mobility', 'IoT'] },
  { id: 'it-df-cleandock', name: 'CleanDock', cityKey: 'lecce_it', status: 'dealflow', stage: 'pre-seed', sectors: ['Maritime', 'Climate'] },
  { id: 'it-df-voicedesk', name: 'VoiceDesk', cityKey: 'como_it', status: 'dealflow', stage: 'pre-seed', sectors: ['Voice AI', 'SaaS'] },
];

const EUROPE_PORTFOLIO: SeedInput[] = [
  { id: 'eu-pf-layerlogic', name: 'LayerLogic', cityKey: 'goteborg_se', status: 'portfolio', stage: 'pre-seed', sectors: ['Materiali Avanzati', 'DeepTech'], website: 'https://www.layerlogic.se/' },
  { id: 'eu-pf-prem-labs', name: 'Prem Labs', cityKey: 'lugano_ch', status: 'portfolio', stage: 'seed', sectors: ['Intelligenza Artificiale', 'AI Infrastructure'], website: 'https://www.premai.io/', aliases: ['Prem AI'] },
];

// Keep a 70-item balanced seed while portfolio is aligned with the uploaded cap table list.
const SUPPLEMENTAL_DEALFLOW: SeedInput[] = [
  { id: 'it-df-urbix', name: 'Urbix', cityKey: 'milan_it', status: 'dealflow', stage: 'series-a', sectors: ['PropTech', 'AI'] },
  { id: 'it-df-agropulse', name: 'AgroPulse', cityKey: 'florence_it', status: 'dealflow', stage: 'seed', sectors: ['AgriTech', 'IoT'] },
  { id: 'it-df-talentforge', name: 'TalentForge', cityKey: 'turin_it', status: 'dealflow', stage: 'seed', sectors: ['HRTech', 'SaaS'] },
  { id: 'it-df-cloudpasta', name: 'CloudPasta', cityKey: 'bologna_it', status: 'dealflow', stage: 'seed', sectors: ['Cloud', 'DevTools'] },
  { id: 'it-df-eduspark', name: 'EduSpark', cityKey: 'bologna_it', status: 'dealflow', stage: 'seed', sectors: ['EdTech', 'AI'] },
  { id: 'it-df-datamosaic', name: 'DataMosaic', cityKey: 'milan_it', status: 'dealflow', stage: 'growth', sectors: ['Data', 'Enterprise'] },
  { id: 'eu-df-canalcloud', name: 'CanalCloud', cityKey: 'amsterdam_nl', status: 'dealflow', stage: 'series-a', sectors: ['Cloud', 'Security'] },
  { id: 'eu-df-alpinemed', name: 'AlpineMed', cityKey: 'zurich_ch', status: 'dealflow', stage: 'series-a', sectors: ['Healthtech', 'AI'] },
];

const EUROPE_DEALFLOW: SeedInput[] = [
  { id: 'eu-df-gaiagrid', name: 'GaiaGrid', cityKey: 'paris_fr', status: 'dealflow', stage: 'seed', sectors: ['Climate', 'Energy'] },
  { id: 'eu-df-elbelogix', name: 'ElbeLogix', cityKey: 'hamburg_de', status: 'dealflow', stage: 'seed', sectors: ['Logistics', 'AI'] },
  { id: 'eu-df-catalanvision', name: 'CatalanVision', cityKey: 'barcelona_es', status: 'dealflow', stage: 'pre-seed', sectors: ['Computer Vision', 'Retail'] },
  { id: 'eu-df-danubehealth', name: 'DanubeHealth', cityKey: 'vienna_at', status: 'dealflow', stage: 'seed', sectors: ['Healthtech'] },
  { id: 'eu-df-atlasquant', name: 'AtlasQuant', cityKey: 'munich_de', status: 'dealflow', stage: 'series-a', sectors: ['AI Infrastructure', 'MLOps'] },
  { id: 'eu-df-fadoai', name: 'FadoAI', cityKey: 'lisbon_pt', status: 'dealflow', stage: 'pre-seed', sectors: ['AI', 'Voice'] },
  { id: 'eu-df-euroledger', name: 'EuroLedger', cityKey: 'brussels_be', status: 'dealflow', stage: 'seed', sectors: ['Fintech', 'Compliance'] },
  { id: 'eu-df-seinebio', name: 'SeineBio', cityKey: 'lyon_fr', status: 'dealflow', stage: 'pre-seed', sectors: ['BioTech'] },
  { id: 'eu-df-dublinflow', name: 'DublinFlow', cityKey: 'dublin_ie', status: 'dealflow', stage: 'seed', sectors: ['Workflow', 'SaaS'] },
  { id: 'eu-df-copenhagencore', name: 'CopenhagenCore', cityKey: 'copenhagen_dk', status: 'dealflow', stage: 'seed', sectors: ['Data Infrastructure'] },
  { id: 'eu-df-valenciafleet', name: 'ValenciaFleet', cityKey: 'valencia_es', status: 'dealflow', stage: 'pre-seed', sectors: ['Mobility', 'Logistics'] },
  { id: 'eu-df-parisfoundry', name: 'ParisFoundry', cityKey: 'paris_fr', status: 'dealflow', stage: 'series-a', sectors: ['DeepTech', 'Industrial'] },
  { id: 'eu-df-berlinscale', name: 'BerlinScale', cityKey: 'berlin_de', status: 'dealflow', stage: 'seed', sectors: ['Go-to-market', 'SaaS'] },
  { id: 'eu-df-amsterdamphotonics', name: 'AmsterdamPhotonics', cityKey: 'amsterdam_nl', status: 'dealflow', stage: 'pre-seed', sectors: ['Photonics', 'Semiconductor'] },
];

export const STARTUP_DEALFLOW_SEED: StartupDealflowItem[] = [
  ...ITALY_PORTFOLIO,
  ...ITALY_DEALFLOW,
  ...EUROPE_PORTFOLIO,
  ...EUROPE_DEALFLOW,
  ...SUPPLEMENTAL_DEALFLOW,
].map(makeItem);

export function getStartupDealflowSeedStats(items: StartupDealflowItem[] = STARTUP_DEALFLOW_SEED): {
  total: number;
  italy: number;
  europe: number;
  portfolio: number;
  dealflow: number;
} {
  const italy = items.filter((item) => item.country === 'Italy').length;
  const portfolio = items.filter((item) => item.status === 'portfolio').length;
  return {
    total: items.length,
    italy,
    europe: items.length - italy,
    portfolio,
    dealflow: items.length - portfolio,
  };
}
